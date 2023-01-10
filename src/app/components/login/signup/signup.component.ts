import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  hide = true;
  signup_form !: FormGroup;

  constructor(private formbuilder : FormBuilder, private api : AuthService, public router: Router) {};

  ngOnInit(): void {

      this.signup_form = this.formbuilder.group({
        email : ['', Validators.required],
        password : ['', Validators.required]
      })
  
    }

    AddUser(){
      if(this.signup_form.valid){
          // console.log(this.signup_form.value)
          this.api.adduser(this.signup_form.value)
          .subscribe({
              next:(res)=>{alert("User Added");
              this.signup_form.reset();
              this.router.navigate(['/login']);
              },
          error:()=>{
              alert("Cannot add user!");
          }
        })
      }
    }

}
