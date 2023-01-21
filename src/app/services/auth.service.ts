import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) { }

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
