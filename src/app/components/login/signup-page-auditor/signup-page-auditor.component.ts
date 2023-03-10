import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup-page-auditor',
  templateUrl: './signup-page-auditor.component.html',
  styleUrls: ['./signup-page-auditor.component.css']
})
export class SignupPageAuditorComponent implements OnInit {
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
      mobile: ['', [Validators.required,Validators.minLength(10) ]]
    })

      this.signup_form = this.formbuilder.group({
        user_name : ['', Validators.required],
        PAN : ['', Validators.required],
        password : ['', Validators.compose(
          [Validators.minLength(5), Validators.required])],
        retype_password : ['', Validators.compose(
          [Validators.minLength(5), Validators.required])],
        user_type : ['client', Validators.required]
      },
      );

      this.whole_form = this.formbuilder.group({
        email : ['', Validators.required],
        mobile: ['', Validators.required],
        user_name : ['', Validators.required],
        PAN : [''],
        password : ['', Validators.compose(
          [Validators.minLength(5), Validators.required])],
        retype_password : ['', Validators.compose(
          [Validators.minLength(5), Validators.required])],
        user_type : ['client', Validators.required],
        OTP  : ['', Validators.required],
        otp_phone : ['', Validators.required],
      })

      this.otp_form = this.formbuilder.group({
        otp_mail  : ['', Validators.required],
        otp_phone : ['12345', Validators.required],
      })
    }

    Otp_generation(){
      if(this.signup_form.value.password == this.signup_form.value.retype_password)
      {
        if(this.signup_form.valid && this.email_form.valid){
          console.log(this.signup_form.value)
          console.log(this.email_form.value)
          this.api.generate_otp({"email":this.email_form.value.email})
          .subscribe({
            next:(res)=>{
              this._snackBar.open('OTP GENERATED', 'HURRAH !!!!!', {
                duration: 2000,
              });           
            this.myStepper.next();
          },
          error:(err)=>{
            console.log(err.error.Status);
            this._snackBar.open(err.error.Status, 'Use /login', {
              duration: 2000,
            });  
          } 
          });
        
        //   
        }
      }
      else{
        this.pass = false;
      }
    }

  Otp_verification()
  {
    console.log(this.otp_form.value)
    if(this.otp_form.valid)
    {

      this.whole_form.controls['email'].setValue(this.email_form.value['email']);
      this.whole_form.controls['mobile'].setValue(this.email_form.value['mobile']);
      this.whole_form.controls['user_name'].setValue(this.signup_form.value['user_name']);
      this.whole_form.controls['PAN'].setValue(this.signup_form.value['PAN']);
      this.whole_form.controls['password'].setValue(this.signup_form.value['password']);
      this.whole_form.controls['retype_password'].setValue(this.signup_form.value['retype_password']);
      this.whole_form.controls['user_type'].setValue(this.signup_form.value['user_type']);
      
      this.whole_form.controls['OTP'].setValue(this.otp_form.value['otp_mail']);
      this.whole_form.controls['otp_phone'].setValue(this.otp_form.value['otp_phone']);
      console.log(this.whole_form.value)

      this.api.user_signup(this.whole_form.value)
      .subscribe({
        next:(res)=>{
        this._snackBar.open("User Added Hurrah", 'Hurrah', {
          duration: 2000,
        });
                
        this.myStepper.next();
        this.signup_form.reset();
        this.email_form.reset();
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
