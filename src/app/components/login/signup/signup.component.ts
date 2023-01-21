import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  hide = true;

  signup_form !: FormGroup;
  otp_form !: FormGroup;
 
  whole_form !: FormGroup;
  constructor(private formbuilder : FormBuilder, private api : AuthService, public router: Router) {};

  @ViewChild('stepper') private myStepper: MatStepper;
  
  
  ngOnInit(): void {
     
      this.signup_form = this.formbuilder.group({
        email : ['', Validators.required],
        mobile: ['', Validators.required],
        user_name : ['', Validators.required],
        PAN : [''],
        password : ['', Validators.required],
        retype_password : ['', Validators.required],
        user_type : ['client', Validators.required]
      })

      this.whole_form = this.formbuilder.group({
        email : ['', Validators.required],
        mobile: ['', Validators.required],
        user_name : ['', Validators.required],
        PAN : [''],
        password : ['', Validators.required],
        retype_password : ['', Validators.required],
        user_type : ['client', Validators.required],
        otp_mail  : ['', Validators.required],
        otp_phone : ['', Validators.required],
      })

      this.otp_form = this.formbuilder.group({
        otp_mail  : ['', Validators.required],
        otp_phone : ['12345', Validators.required],
      })
    }

  Otp_verification()
  {
    console.log(this.otp_form.value)
    if(this.otp_form.valid)
    {

      this.whole_form.controls['email'].setValue(this.signup_form.controls['email']);
      this.whole_form.controls['mobile'].setValue(this.signup_form.controls['mobile']);
      this.whole_form.controls['user_name'].setValue(this.signup_form.controls['user_name']);
      this.whole_form.controls['PAN'].setValue(this.signup_form.controls['PAN']);
      this.whole_form.controls['password'].setValue(this.signup_form.controls['password']);
      this.whole_form.controls['retype_password'].setValue(this.signup_form.controls['retype_password']);
      this.whole_form.controls['user_type'].setValue(this.signup_form.controls['user_type']);
      this.whole_form.controls['otp_mail'].setValue(this.otp_form.controls['otp_mail']);
      this.whole_form.controls['otp_phone'].setValue(this.otp_form.controls['otp_phone']);
      this.api.generate_otp({"email":this.whole_form.value.email})
      .subscribe({
        next:(res)=>{alert("OTP GENERATED");  
        this.api.user_signup(this.whole_form.value)
      .subscribe({
        next:(res)=>{alert("User Added");        
        this.myStepper.next();
        },
      error:()=>{
        alert("Cannot add user!");
      }
      });
      },
      error:()=>{
        alert("Cannot add user!");
      } 
      });
    }
  }

  AddUser(){
    if(this.signup_form.value.password == this.signup_form.value.retype_password)
    {
      console.log(this.signup_form.value)
      if(this.signup_form.valid){
        this.myStepper.next();
        this.signup_form.reset();  
    }
    }
  }

}
