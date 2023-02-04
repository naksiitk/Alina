import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  public saveEmail(value : string) { localStorage.setItem('email', value); }
  public getEmail() { return localStorage.getItem('email'); }

  public saveRole(value : string) { localStorage.setItem('role', value); }
  public getRole() { return localStorage.getItem('role'); }

  public clearLocalStorage() { localStorage.clear(); }

  public remove_email_local(key: string) {
    localStorage.removeItem(key);
  }

}
