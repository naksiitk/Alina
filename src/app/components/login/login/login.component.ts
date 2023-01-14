import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  hide = true;
  login_form !: FormGroup;

  constructor(private formbuilder : FormBuilder, private api : AuthService, public router: Router) {};

  ngOnInit(): void {

      this.login_form = this.formbuilder.group({
        email : ['', Validators.required],
        password : ['', Validators.required]
      })
  
    }

    CheckUser(){
      if(this.login_form.valid){
          // console.log(this.signup_form.value)
          this.api.checkuser(this.login_form.value)
          .subscribe({
              next:(res)=>{
                // console.log(this.login_form.value.email)
                if(res.status == '200') {
                  this.api.save_email_local('email',this.login_form.value['email'])
                  this.router.navigate(['/home/file_uploaded'])
                  this.login_form.reset()
                } else {
                  alert("Error")
                }
              },
          error:()=>{
              alert("Incorrect credentials");
          }
        })
      }
    }


}
