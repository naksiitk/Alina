import { Component, OnInit, Inject} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ask-dialog',
  templateUrl: './ask-dialog.component.html',
  styleUrls: ['./ask-dialog.component.css']
})
export class AskDialogComponent implements OnInit{
  
  selectedYear: number = new Date().getFullYear();
  years: string[] = [];
  d = new Date();
  date = new Date(Date.now()).toLocaleString('en-GB').split(',')[0];
  formData = new FormData();
  
  purpose_list = ["GST", "ITR", "TDS"];
  file_list !: FormGroup;
  actionBtn : string = "Ask";
  constructor(private localStorage: LocalStorageService ,private formbuilder : FormBuilder, private api : ApiService, private dialogref : MatDialogRef<AskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editdata: any, private api_auth : AuthService, private _snackBar: MatSnackBar ){

      for (let year = this.selectedYear; year >= 2018; year--) {
        this.years.push(String(year-1)  + "-" + String(year));
    };
  }
  files_asked_upload = 0;

  email: any = this.api_auth.get_email_local('auditor_view_client_email_itr')
  ngOnInit(): void {
    
    this.file_list = this.formbuilder.group({
      filename         : ['', Validators.required],
      purpose         : ['', Validators.required],
      comments        : [''],
      email           : [this.email, Validators.required],
      fy              : ['', Validators.required],
      month_quarter   : [''],
      files_uploaded  : [[]],
    }) 
    if(this.editdata)
    {
      this.actionBtn = "Upload";
      if(this.editdata.from_asked_dialog_box == 1){
        this.files_asked_upload=1;
      this.file_list.controls['filename'].setValue(this.editdata.filename);
      this.file_list.controls['purpose'].setValue(this.editdata.purpose);
      this.file_list.controls['comments'].setValue(this.editdata.comments);
      this.file_list.controls['files_uploaded'].setValue(this.editdata.files_uploaded);
      this.file_list.controls['email'].setValue(this.email);
      this.file_list.controls['fy'].setValue(this.editdata.fy);
      this.file_list.controls['month_quarter'].setValue(this.editdata.month_quarter);
    }
    }
    
  }
  async Email_draft(data:any){
  await new Promise( resolve => {
    this.api.ask_email(data).subscribe({
      next:(res)=>{
        console.log("hi");
        this._snackBar.open(res.Status, "Hurray!!", {
        duration: 2000,});
      },
      error:(err)=>{
        this._snackBar.open(err.error.Status, "Contact Us", {
          duration: 2000,});
      }        
    });
    resolve("true"); })
  }
  
  AddProduct(){
    if(this.email == null)
    { this.email = this.api_auth.get_email_local('email_add_file')}
    this.file_list.controls['email'].setValue(this.email);
    if(!this.editdata){
      if(this.file_list.valid){
        this.api.post_file_asked(this.file_list.value)
        .subscribe({
          next:(res)=>{alert("file_added");
          this.Email_draft(this.file_list.value)
          this.file_list.reset();
          this.dialogref.close("save");
          },
          error:()=>{
            alert("Error while adding");
          }        
        })
      }
    }
    else{
      this.updateProduct();
    }
  }

  updateProduct(){
    if(this.email == null)
    { this.email = this.api_auth.get_email_local('email_add_file')}
    console.log(this.email);
    if(this.file_list.value.files_uploaded.length != 0)
    {
      this.formData.append('fy',this.file_list.value.fy );
      this.formData.append('email',this.email);
      this.formData.append('filename',this.file_list.value.filename);
      this.formData.append('purpose',this.file_list.value.purpose);
      this.formData.append('comments',this.file_list.value.comments);
      this.formData.append('month_quarter',this.file_list.value.month_quarter);
      console.log(this.formData)

      // this.api.put_file_asked(this.editdata._id, this.file_list.value)
      // .subscribe({
      //   next:(res)=>{
      //     alert("File Updated Successfully");
      //     this.file_list.reset();
      //     this.dialogref.close("update");
      //   },
      //   error:(err)=>{
      //     alert(err);
      //     console.log(err);
      //   }
      // })
      console.log(this.editdata)
      this.api.postfile_new_asked(this.formData, this.editdata._id)
            .subscribe({
              next:(res)=>{
                this._snackBar.open("Files Added","OK", {
                  duration: 3000,
                });
              this.file_list.reset();
              this.formData.delete("files");
              this.fileName_array.length = 0;
              this.dialogref.close("save");
              const keys = [];
            for (const key of this.formData.keys()) {
                keys.push(key);
            }
            for (const idx in keys) {
                this.formData.delete(keys[idx]);
            }
              },
              error:(err)=>{
                this._snackBar.open(err.error.Status,"Contact Us", {
                  duration: 3000,
                });
              }        
            })
            
    }
    else{
      this._snackBar.open("Attach the file"," ", {
        duration: 3000,
      });
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
