import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { HomeComponent } from '../home/home.component';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.css']
})

export class DialogComponent implements OnInit{
  
  selectedYear: number = new Date().getFullYear();
  years: string[] = [];
  d = new Date();
  date = new Date(Date.now()).toLocaleString('en-GB').split(',')[0];
  TDS_Container = false;
  
  
  purpose_list = ["GST", "ITR", "Others"];
  file_list !: FormGroup;
  actionBtn : string = "Save";
  constructor(private formbuilder : FormBuilder, private api : ApiService, private dialogref : MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public editdata: any, private api_auth : AuthService ){

      for (let year = this.selectedYear; year >= 2018; year--) {
        this.years.push(String(year) + "-" + String(year-1));
    };
  }

  email : any = this.api_auth.get_email_local('email');
  ngOnInit(): void {
    
    this.file_list = this.formbuilder.group({
      filename         : ['', Validators.required],
      purpose         : ['', Validators.required],
      comments        : ['', Validators.required],
      files_uploaded  : ['', Validators.required],
      email           : [this.email, Validators.required],
      uploadedat      : ['', ],
      fy              : ['', Validators.required],
      month_quarter   : [''],
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
      //this.file_list.controls['fy_month_quarter'].setValue(this.editdata.fy +
      // ' ; ' + this.editdata.month_quarter);
      
      this.file_list.controls['uploadedat'].setValue(this.date);
    }
  }
  
  AddProduct(){
    
    if(!this.editdata || this.editdata.from_asked_dialog_box){
      if(this.file_list.valid){
        this.file_list.controls['fy_month_quarter'].setValue(this.file_list.value.fy 
          + ' ; ' + this.file_list.value.month_quarter);
        this.file_list.controls['uploadedat'].setValue(String(this.date));
        this.api.postfile(this.file_list.value)
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
    this.file_list.controls['fy_month_quarter'].setValue(this.file_list.value.fy 
      + ' ; ' + this.file_list.value.month_quarter);
    this.api.putfile(this.editdata._id, this.file_list.value)
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
