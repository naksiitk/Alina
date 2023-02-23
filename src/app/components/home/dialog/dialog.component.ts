import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit{
  formData = new FormData();
  fileName = '';
  selectedYear: number = new Date().getFullYear();
  years: string[] = [];
  d = new Date();
  date = new Date(Date.now()).toLocaleString('en-GB').split(',')[0];
  TDS_Container = false;
  
  
  purpose_list = ["GST", "ITR", "Others"];
  file_list !: FormGroup;
 
  actionBtn : string = "Save";
  constructor(private formbuilder : FormBuilder, private api : ApiService, private dialogref : MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editdata: any, private api_auth : AuthService,
    private _snackBar: MatSnackBar){

      for (let year = this.selectedYear; year >= 2018; year--) {
        this.years.push(String(year-1)  + "-" + String(year));
    };
  }
  email : any = this.api_auth.get_email_local('email_add_file');
  ngOnInit(): void {
    
    this.file_list = this.formbuilder.group({
      filename         : ['', Validators.required],
      purpose         : ['', Validators.required],
      comments        : ['', Validators.required],
      files_uploaded  : [[], Validators.required],
      email           : [this.email, Validators.required],
      uploadedat      : ['', ],
      fy              : ['', Validators.required],
      month_quarter   : ['-'],
      fy_month_quarter: [''],
    }) 
    if(this.editdata)
    {
      this.actionBtn = "Edit";
      this.file_list.controls['filename'].setValue(this.editdata.filename);
      this.file_list.controls['purpose'].setValue(this.editdata.purpose);
      this.file_list.controls['comments'].setValue(this.editdata.comments);
      this.file_list.controls['files_uploaded'].setValue(this.editdata.files_uploaded);
      this.file_list.controls['email'].setValue(this.email);
      this.file_list.controls['fy'].setValue(this.editdata.fy);
      this.file_list.controls['month_quarter'].setValue(this.editdata.month_quarter);
      this.file_list.controls['uploadedat'].setValue(this.date);

      const files = this.editdata.files_uploaded;
      this.fileName_array.length = 0;
      for( let index = 0; index<= files.length; index++)
      {
        let file = files[index];
        if(file){
          this.fileName_array.push({'files_uploaded':file});
        }
        this.getAllfiles(this.fileName_array); 
      }
    }
  }
  
  AddProduct(){
    
    if(!this.editdata || this.editdata.from_asked_dialog_box){
      if(this.file_list.valid){
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
              this.file_list.reset();
              this.formData.delete("files");
              this.fileName_array.length = 0;
              this.dialogref.close("save");
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
      else{
        this._snackBar.open("File Not filed properly","Contact Us", {
          duration: 3000,
        });
      }
    }
    else{
      this._snackBar.open("It is going to update","Contact Us", {
        duration: 3000,
      });
      this.updateProduct();
    }
  }

  updateProduct(){
    this.formData.append('files_from',this.file_list.value.fy );
    this.formData.append('files_name',this.file_list.value.email )
    this.file_list.controls['uploadedat'].setValue(String(this.date));

    if(this.formData.has("files")){
      this.api.post_file_upload_aws(this.formData).subscribe({
        next:(res)=>{ 
          this._snackBar.open("File Uploaded Successfully","OK", {
            duration: 3000,
          });
         
          let total_files = this.editdata.files_uploaded.concat(res.keys);
          this.file_list.controls['files_uploaded'].setValue(total_files);
          console.log(this.file_list.value.files_uploaded)
          this.api.putfile(this.editdata._id, this.file_list.value)
            .subscribe({
              next:(res)=>{
                this._snackBar.open("File Updated Successfully","OK", {
                  duration: 3000,
                });
                this.api.copy_file_upload_aws(
                  {files_uploaded : this.editdata.files_uploaded,
                    source_files_name : this.email,
                    dest_files_name : this.email,
                    source_files_from : this.editdata.fy,
                    dest_files_from : this.file_list.value.fy
                }).subscribe({
                  next:(res)=>{
                    this._snackBar.open("File Updated Successfully","OK", {
                      duration: 3000,
                    });
                  this.file_list.reset();
                  this.dialogref.close("update");},
                  error:(err)=>{
                    this._snackBar.open(err.error.message,"Contact Us", {
                      duration: 3000,
                    });}
                });
              },
              error:(err)=>{
                this._snackBar.open(err.error.message,"Contact Us", {
                  duration: 3000,
                });
              }
            }) 
        },
        error:(err)=>{this._snackBar.open(err.error.message,"Contact Us", {
          duration: 3000,
        });}
      }); 
    }
    else{
      this.file_list.controls['files_uploaded'].setValue(this.editdata.files_uploaded);
      console.log(this.file_list.value.files_uploaded);
      this.api.putfile(this.editdata._id, this.file_list.value)
      .subscribe({
        next:(res)=>{
          this._snackBar.open("File Updated Successfully","OK", {
            duration: 3000,
          });
          this.api.copy_file_upload_aws(
            {files_uploaded : this.editdata.files_uploaded,
              source_files_name : this.email,
              dest_files_name : this.email,
              source_files_from : this.editdata.fy,
              dest_files_from : this.file_list.value.fy
          }).subscribe({
            next:(res)=>{
              this._snackBar.open("File Updated Successfully","OK", {
                duration: 3000,
              });
            this.file_list.reset();
            this.dialogref.close("update");},
            error:(err)=>{this._snackBar.open(err.error.message,"Contact Us", {
              duration: 3000,
            });}
          });
        },
        error:(err)=>{
          this._snackBar.open(err.error.message,"Contact Us", {
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
        this._snackBar.open(file.name,"Ok", {
          duration: 3000,
        });
      }
      
    }
       
  }

  

}
