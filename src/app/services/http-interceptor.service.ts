import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private injector : Injector) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localStorage =  this.injector.get(LocalStorageService)

    const new_request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${localStorage.getJWT()}`
      }
    });

    return next.handle(new_request);
  }
}
