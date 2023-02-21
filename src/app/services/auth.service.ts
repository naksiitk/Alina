import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from './local-storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
  backend_route =  environment.apiUrl;   //'http://54.90.42.79/api' 
  constructor(private http : HttpClient,private localStorage : LocalStorageService, private router : Router,
    private _snackBar: MatSnackBar) { }

  adduser(data : any){
    return this.http.post<any>(this.backend_route + '/user',data);
  }

  user_signup(data : any){
    console.log(data)
    return this.http.post<any>(this.backend_route + '/user/signup',data);
  }

  otp_verification(data : any){
    console.log(data)
    return this.http.post<any>(this.backend_route + '/user/otp_verification',data);
  }

  change_password(data : any){
    console.log(data)
    return this.http.post<any>(this.backend_route + '/user/password_change',data);
  }


  getalluser(){
    return this.http.get<any>(this.backend_route + '/user');
  }

  generate_otp(data : any){
    return this.http.post<any>(this.backend_route + '/user/generate_otp',data);
  }

  generate_otp_forgot(data : any){
    return this.http.post<any>(this.backend_route + '/user/generate_otp_forgot_otp',data);
  }

  checkuser(data : any){
    console.log(data)
    return this.http.post<any>(this.backend_route + '/login',data);
  }

  login_user(data : any) {
    this.checkuser(data)
    .subscribe({
        next:(res)=>{
          if(res.status == '200') {
            this.localStorage.saveJWT(res.JWT)
            this.localStorage.saveEmail(res.email)
            this.localStorage.saveRole(res.role)
            this.localStorage.saveName(res.name)

            if(res.role == 'client') {
              this.router.navigate(['/home/file_uploaded']);
              this.save_email_local('email_add_file', res.email); 
            }
            else if(res.role == 'auditor') this.router.navigate(['/auditor']);
          } else {
            this._snackBar.open('ERROR', 'TRY AGAIN !!!!!', {
                duration: 2000,
              }); 
          }
        },
    error:()=>{
      this._snackBar.open('INCORRECT CREDENTIALS', 'TRY AGAIN !!!!!', {
        duration: 2000,
      }); 
    }
  })
  }

  logout_user(){
    this.localStorage.clearLocalStorage();
    this.router.navigate(['/login']);
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
