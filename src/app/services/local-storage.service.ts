import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public saveJWT(value : string) { localStorage.setItem('JWT', value); }
  public getJWT() { return localStorage.getItem('JWT'); }

  public saveEmail(value : string) { localStorage.setItem('email', value); }
  public getEmail() { return localStorage.getItem('email'); }

  public saveRole(value : string) { localStorage.setItem('role', value); }
  public getRole() { return localStorage.getItem('role'); }

  public saveClientEmailITR(value : string) { return localStorage.setItem('auditor_view_client_email_itr', value); }
  public getClientEmailITR() { return localStorage.getItem('auditor_view_client_email_itr'); }


  public clearLocalStorage() { localStorage.clear(); }

  public remove_email_local(key: string) {
    localStorage.removeItem(key);
  }

}
