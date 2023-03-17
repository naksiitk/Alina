import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})

export class ForgotPasswordComponent implements OnInit {
  hide = true;
  hide1 = true;

  signup_form !: FormGroup;
  otp_form !: FormGroup;
  email_form !: FormGroup;
 
  whole_form !: FormGroup;
  constructor(private formbuilder : FormBuilder, private api : AuthService, public router: Router,
    private _snackBar: MatSnackBar) {};

  @ViewChild('stepper') private myStepper: MatStepper;
  
  pass = true;
  ngOnInit(): void {
     
    this.email_form = this.formbuilder.group({
      email : ['', [Validators.required, Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
 
    })

      this.signup_form = this.formbuilder.group({
        password : ['', Validators.compose(
          [Validators.minLength(5), Validators.required])],
        retype_password : ['', Validators.compose(
          [Validators.minLength(5), Validators.required])],
      
      },
      );
      this.otp_form = this.formbuilder.group({
        otp_mail  : ['', Validators.required],
        otp_phone : ['12345', Validators.required],
      })
    }

    Otp_generation(snackbar_msg : string){
      {
        if(this.email_form.valid){
          console.log(this.email_form.value)
          this.api.generate_otp_forgot({"email":this.email_form.value.email})
          .subscribe({
            next:(res)=>{
              this._snackBar.open(snackbar_msg, 'HURRAH !!!!!', {
                duration: 2000,
              });           
            this.myStepper.next();
          },
          error:(err)=>{
            console.log(err.error.Status);
            this._snackBar.open(err.error.Status, 'Email not present', {
              duration: 2000,
            });  
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
      this.api.otp_verification({email : this.email_form.value.email, OTP : this.otp_form.value.otp_mail})
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

  Change_password()
  {
    if(this.signup_form.valid && this.signup_form.value.password == this.signup_form.value.retype_password)
    {
      this.api.change_password({email : this.email_form.value.email, password : this.signup_form.value.password})
      .subscribe({
        next:(res)=>{
        this._snackBar.open("Password Changed", 'Hurrah', {
          duration: 2000,
        });             
        this.myStepper.next();
        },
      error:(err)=>{
        this._snackBar.open(err.error.message, 'Sorry', {
          duration: 2000,
        });
      }
      });
     
    }
    else{
      this.pass = false;
    }

  }


  moveout(){
    this.router.navigate([ '/login' ])
  }
  

}
