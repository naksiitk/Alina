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
          this.api.login_user(this.login_form.value)
          this.login_form.reset()
      }
    }


}
