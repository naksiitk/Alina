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

}
