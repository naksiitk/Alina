import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { HomeComponent } from '../../home/home/home.component';

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
  TDS_Container = false;
  
  
  purpose_list = ["GST", "ITR", "TDS"];
  file_list !: FormGroup;
  actionBtn : string = "Save";
  constructor(private localStorage: LocalStorageService ,private formbuilder : FormBuilder, private api : ApiService, private dialogref : MatDialogRef<AskDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editdata: any, private api_auth : AuthService ){

      for (let year = this.selectedYear; year >= 2018; year--) {
        this.years.push(String(year-1)  + "-" + String(year));
    };
  }

  email: any = this.localStorage.getClientEmailITR()
  ngOnInit(): void {
    
    this.file_list = this.formbuilder.group({
      filename         : ['', Validators.required],
      purpose         : ['', Validators.required],
      comments        : [''],
      email           : [this.email, Validators.required],
      fy              : ['', Validators.required],
      month_quarter   : [''],
      
    }) 
    if(this.editdata)
    {
      this.actionBtn = "Edit";
      this.file_list.controls['filename'].setValue(this.editdata.filename);
      this.file_list.controls['purpose'].setValue(this.editdata.purpose);
      this.file_list.controls['comments'].setValue(this.editdata.comments);
      this.file_list.controls['files_uploaded'].setValue(this.editdata.files_uploaded);
      this.file_list.controls['fy'].setValue(this.editdata.fy);
      this.file_list.controls['month_quarter'].setValue(this.editdata.month_quarter);
      this.file_list.controls['email'].setValue(this.email);
     
    }
  }
  
  AddProduct(){
    
    if(!this.editdata){
      if(this.file_list.valid){
        this.api.post_file_asked(this.file_list.value)
        .subscribe({
          next:(res)=>{alert("file_added");
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
    console.log(this.editdata);
    this.api.put_file_asked(this.editdata._id, this.file_list.value)
    .subscribe({
      next:(res)=>{
        alert("File Updated Successfully");
        this.file_list.reset();
        this.dialogref.close("update");
      },
      error:(err)=>{
        alert(err);
        console.log(err);
      }
    })
  }
}
