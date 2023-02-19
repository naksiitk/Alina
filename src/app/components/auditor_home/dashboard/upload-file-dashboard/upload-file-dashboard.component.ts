import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-upload-file-dashboard',
  templateUrl: './upload-file-dashboard.component.html',
  styleUrls: ['./upload-file-dashboard.component.css']
})
export class UploadFileDashboardComponent implements OnInit{

  formData = new FormData();
  fileName = '';
  selectedYear: number = new Date().getFullYear();
  years: string[] = [];
  d = new Date();
  date = new Date(Date.now()).toLocaleString('en-GB').split(',')[0];
  TDS_Container = false;
  options : string[] = []
  purpose_list = ["GST", "ITR", "Others"];
  file_list !: FormGroup;
  user_list  = []
  actionBtn : string = "Upload";
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('',Validators.required);


  constructor(private formbuilder : FormBuilder, private api : ApiService, 
     private api_auth : AuthService,private dialogref : MatDialogRef<UploadFileDashboardComponent>,
    private _snackBar: MatSnackBar){

      for (let year = this.selectedYear; year >= 2018; year--) {
        this.years.push(String(year-1)  + "-" + String(year));
    };
    this.api_auth.getalluser().subscribe({
      next:(res)=>{
          this.user_list = res;
          for( let option = 0; option < res.length; option++){
            let opt: string = res[option].email;
            this.options.push(opt);
          }
        console.log(this.options);
      }
    });
  }
  
  email : any = this.api_auth.get_email_local('email_add_file');
  ngOnInit(): void {
    
    this.file_list = this.formbuilder.group({
      filename         : ['', Validators.required],
      purpose         : ['', Validators.required],
      comments        : ['', Validators.required],
      files_uploaded  : [[], Validators.required],
      email           : [''],
      uploadedat      : ['', ],
      fy              : ['', Validators.required],
      month_quarter   : [''],
      fy_month_quarter: [''],
    }) 

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    
  }

  private _filter(value: string): string[] {
    console.log(value)
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  AddProduct(){
      if(this.file_list.valid){
        console.log(this.myControl.value)
        this.file_list.controls['email'].setValue(this.myControl.value);
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
              this.dialogref.close("save")
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

  

}
