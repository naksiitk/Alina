import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CredentialsService } from 'src/app/services/credentials.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-dialog-credentials',
  templateUrl: './dialog-credentials.component.html',
  styleUrls: ['./dialog-credentials.component.css']
})
export class DialogCredentialsComponent {

  credential_form !: FormGroup;
  which_side = 0;
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('');
  options : string[] = []

  constructor(private formbuilder : FormBuilder, private api : ApiService, public dialogref: MatDialogRef<DialogCredentialsComponent>,
    @Inject(MAT_DIALOG_DATA) public editdata: any, private api_auth : AuthService, private _snackBar: MatSnackBar ){

      this.api_auth.getalluser().subscribe({
        next:(res)=>{
            for( let option = 0; option < res.length; option++){
              let opt: string = res[option].user_name +"//"+res[option].email;
              this.options.push(opt);
            }
          //console.log(this.options);
        }
      });
    };

  email : any = this.api_auth.get_email_local('email');

  ngOnInit(): void {
    
    this.credential_form = this.formbuilder.group({
      credential_type : ['', Validators.required],
      user_id : ['', Validators.required],
      PANorGSTIN : ['', Validators.required],
      password : ['', Validators.required],
      registered_mobile : ['', Validators.required],
      registered_email : ['', Validators.required],
      email : [this.email]
    })
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

    if(this.editdata.which_side != null)
    {this.which_side = this.editdata.which_side;}
  }

  private _filter(value: string): string[] {
    //console.log(value)
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }
  
  AddProduct(){

      if((this.credential_form.valid && this.which_side==0) || (this.credential_form.valid && this.which_side==1 && this.myControl.value != '')){
        if(this.which_side==1){
        this.credential_form.controls['email'].setValue(this.myControl.value);
        }
        this.api.AddCredentials(this.credential_form.value)
        .subscribe({
          next:(res)=>{
          this.credential_form.reset();
          this.dialogref.close("save");
          this._snackBar.open("Credentials Added","Refresh");
          },
          error:(err)=>{
            this._snackBar.open(err.error.message,"Contact Us");
          }        
        })
      }
      else{
        this._snackBar.open("Fill the Form Properly","OK");
      }
    }
  

}
