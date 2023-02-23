import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoaderService } from './loader.service';
import { LocalStorageService } from './local-storage.service';
import { finalize } from 'rxjs/operators';
@Injectable()
export class HttpInterceptorService implements HttpInterceptor {

  constructor(private injector : Injector, private loaderService: LoaderService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const localStorage =  this.injector.get(LocalStorageService)
    const apiUrl =  environment.apiUrl;
    this.loaderService.show();
    //console.log("intercepting")
    const new_request = request.clone({
      url: apiUrl + request.url,
      setHeaders: {
        Authorization: `Bearer ${localStorage.getJWT()}`
      }
    });

    return next.handle(new_request).pipe(
      finalize(() => this.loaderService.hide()),);
  }
}
