import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuditorUnAuthGuard implements CanActivate {

  constructor(private localStorage : LocalStorageService, public router: Router) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

      const role = this.localStorage.getRole()
      const jwt = this.localStorage.getJWT()
  
      if(jwt && role == 'auditor') {
        this.router.navigate(['/auditor']);
        return false
      }
      
      return true
  }
  
}
