import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CredentialsService } from 'src/app/services/credentials.service';

@Component({
  selector: 'app-dialog-credentials',
  templateUrl: './dialog-credentials.component.html',
  styleUrls: ['./dialog-credentials.component.css']
})
export class DialogCredentialsComponent {
  CredentialType = 'GST';
  addORedit = 'Add';

  credential_form !: FormGroup;

  constructor(private formbuilder : FormBuilder, private api : CredentialsService, public dialogref: MatDialogRef<DialogCredentialsComponent>,
    @Inject(MAT_DIALOG_DATA) public editdata: any, private api_auth : AuthService ){};

  email : any = this.api_auth.get_email_local('email');

  ngOnInit(): void {
    
    this.credential_form = this.formbuilder.group({
      user_name : ['', Validators.required],
      password : ['', Validators.required],
      reg_mobile : ['', Validators.required],
      reg_email : ['', Validators.required],
      email : [this.email, Validators.required]
    })

    if(this.editdata)
    {
      this.addORedit = "Edit";
      this.credential_form.controls['user_name'].setValue(this.editdata.user_name);
      this.credential_form.controls['password'].setValue(this.editdata.password);
      this.credential_form.controls['reg_mobile'].setValue(this.editdata.reg_mobile);
      this.credential_form.controls['reg_email'].setValue(this.editdata.reg_email);
      this.credential_form.controls['email'].setValue(this.email);
    }
  }
  
  AddProduct(){
    if(!this.editdata){
      if(this.credential_form.valid){
        this.api.AddCredentials(this.credential_form.value)
        .subscribe({
          next:(res)=>{alert("file_added");
          this.credential_form.reset();
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
    this.api.EditOneCredentials(this.editdata._id, this.credential_form.value)
    .subscribe({
      next:(res)=>{
        alert("File Updated Successfully");
        this.credential_form.reset();
        this.dialogref.close("update");
        
      },
      error:(err)=>{
        alert("File Updation Failed");
      }
    })
  }

}
