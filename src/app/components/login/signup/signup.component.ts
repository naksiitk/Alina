import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent {
  hide = true;
  signup_form !: FormGroup;

  constructor(private formbuilder : FormBuilder, private api : AuthService) {};

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
              },
          error:()=>{
              alert("Cannot add user!");
          }
        })
      }
    }

}
