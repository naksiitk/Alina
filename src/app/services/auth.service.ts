import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient,private localStorage : LocalStorageService, private router : Router) { }

  adduser(data : any){
    return this.http.post<any>("http://localhost:8000/user",data);
  }

  user_signup(data : any){
    return this.http.post<any>("http://localhost:8000/user/signup",data);
  }
  generate_otp(data : any){
    return this.http.post<any>("http://localhost:8000/user/generate_otp",data);
  }

  checkuser(data : any){
    return this.http.post<any>("http://localhost:8000/user/login",data);
  }

  login_user(data : any) {
    this.checkuser(data)
    .subscribe({
        next:(res)=>{
          if(res.status == '200') {
            this.localStorage.saveEmail(res.email)
            this.localStorage.saveRole(res.role)

            if(res.role == 'client') this.router.navigate(['/home/file_uploaded']);
            else if(res.role == 'auditor') this.router.navigate(['/auditor']);
          } else {
            alert("Error")
          }
        },
    error:()=>{
        alert("Incorrect credentials");
    }
  })
  }

  public save_email_local(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  public get_email_local(key: string) {
    return localStorage.getItem(key)
  }
  public remove_email_local(key: string) {
    localStorage.removeItem(key);
  }

  public clear_data_local() {
    localStorage.clear();
  }
}
