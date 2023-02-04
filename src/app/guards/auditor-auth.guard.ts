import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuditorAuthGuard implements CanActivate {
  
  constructor(private localStorage : LocalStorageService, public router: Router) {
  }
  
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const email = this.localStorage.getEmail()
    const role = this.localStorage.getRole()

    if(email && role == 'auditor') {
      return true
    }
    
    this.router.navigate(['/login']);
    return false
  }
  
}
