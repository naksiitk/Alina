import { Component, OnInit, ViewChild, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-one-time-file-upload',
  templateUrl: './one-time-file-upload.component.html',
  styleUrls: ['./one-time-file-upload.component.css']
})
export class OneTimeFileUploadComponent implements OnInit {
  hide = true;
  hide1 = true;
  otp_verified = 0;
  formData = new FormData();
  fileName = '';
  selectedYear: number = new Date().getFullYear();
  years: string[] = [];
  d = new Date();
  date = new Date(Date.now()).toLocaleString('en-GB').split(',')[0];

  purpose_list = ["GST", "ITR", "Others"];
  file_list !: FormGroup;
  signup_form !: FormGroup;
  otp_form !: FormGroup;
 
  actionBtn : string = "Save";
 
  constructor(private formbuilder : FormBuilder, private api_auth : AuthService, public router: Router,
    private _snackBar: MatSnackBar, private api : ApiService) {
      for (let year = this.selectedYear; year >= 2018; year--) {
        this.years.push(String(year-1)  + "-" + String(year));
    };}

  @ViewChild('stepper') private myStepper: MatStepper;
  
  pass = true;
  ngOnInit(): void {

      this.signup_form = this.formbuilder.group({
        email : ['', Validators.required],
        mobile: ['', Validators.required],
        user_name : ['', Validators.required],
        PAN : ['', Validators.required],
        password : ['temporary'],
        retype_password : ['temporary'],
        user_type : ['client', Validators.required],
        OTP : ['']
      });

      this.file_list = this.formbuilder.group({
        filename         : ['', Validators.required],
        purpose         : ['', Validators.required],
        comments        : ['', Validators.required],
        files_uploaded  : [[], Validators.required],
        email           : [''],
        uploadedat      : ['', ],
        fy              : ['', Validators.required],
        month_quarter   : ['-'],
        fy_month_quarter: [''],
      }) 

      this.otp_form = this.formbuilder.group({
        otp_mail  : ['', Validators.required],
        otp_phone : ['12345', Validators.required],
      })
    }

    AddProduct(){
        if(this.file_list.valid){
          console.log(this.otp_verified)
          this.file_list.controls['email'].setValue(this.signup_form.value.email);
          this.file_list.controls['uploadedat'].setValue(String(this.date));
          this.formData.append('files_from',this.file_list.value.fy );
          this.formData.append('files_name',this.file_list.value.email )
          console.log(this.formData)
          this.api.post_file_upload_aws(this.formData).subscribe({
            next:(res)=>{
              this._snackBar.open("File Uploaded Successfully","OK", {
                duration: 3000,
              });
              console.log(res.keys);
              this.file_list.controls['files_uploaded'].setValue(res.keys); 
              this.api.postfile(this.file_list.value)
              .subscribe({
                next:(res)=>{
                  this._snackBar.open("Files Added","OK", {
                    duration: 3000,
                  });
                  this.myStepper.next();
                this.file_list.reset();
                this.formData.delete("files");
                this.fileName_array.length = 0;
                this.signup_form.reset();
                this.otp_verified = 0;
                },
                error:(err)=>{
                  
                  this._snackBar.open(err.error.Status,"Contact Us", {
                    duration: 3000,
                  });
                }        
              })
  
            },
            error:(err)=>{
              this._snackBar.open(err.error.Status,"Contact Us", {
                duration: 3000,
              });
            }
          })        
        }
      }

  displayedColumns: string[] = ['files_uploaded'];//, 'Action'];
  dataSource  : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  getAllfiles(res : any){ 
    this.dataSource = new MatTableDataSource(res);
  }

  fileName_array : any[] = [];
  form_final_Data = new FormData();
  upload(event : any){
    //let formData = new FormData();
    const files = event.target.files;
    for( let index = 0; index<= files.length; index++)
    {
      let file = files[index];
      if(file){
        this.file_list.controls['files_uploaded'].setValue([file.name]);
        console.log(file)
        this.formData.append('files', file);
        this.fileName_array.push({'files_uploaded':file.name});
        console.log(this.fileName_array);
        this.getAllfiles(this.fileName_array);   
      }
    }      
  }
  Otp_generation(snackbar_msg : string){
    {
      if(this.signup_form.valid){
        console.log(this.signup_form.value)
        this.api_auth.generate_otp({"email":this.signup_form.value.email})
        .subscribe({
          next:(res)=>{
            this._snackBar.open(snackbar_msg, 'HURRAH !!!!!', {
              duration: 2000,
            });  
          this.otp_verified = 1;         
          this.myStepper.next();
        },
        error:(err)=>{
          console.log(err.error.Status);
          this._snackBar.open('Email already present', 'use login and forgot password', {
            duration: 2000,
          }); 
          this.myStepper.next(); 
        } 
        });
      }
      
      //   
      }
   
  }

  Otp_verification()
  {
    if(this.otp_form.valid)
    {
      this.signup_form.controls['OTP'].setValue(this.otp_form.value.otp_mail);
      this.api_auth.user_signup(this.signup_form.value)
      .subscribe({
        next:(res)=>{
        this._snackBar.open("OTP verified! ", 'Hurrah', {
          duration: 2000,
        });             
        this.myStepper.next();
        },
      error:(err)=>{
        this._snackBar.open(err.error.Status, 'Sorry', {
          duration: 2000,
        });
      }
      });
     
    }
  }

  moveout(){
    this.router.navigate([ '/login' ])
  }
  

}
