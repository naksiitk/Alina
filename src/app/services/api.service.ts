import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient, private api_auth:AuthService) { }

  postfile(data : any){
    return this.http.post<any>("http://localhost:8000/doc",data);
  }
  getfile(data:any){  
    return this.http.get<any>("http://localhost:8000/doc/"+data);
  }
  getFilesWithPurpose(data: any) {
    return this.http.post<any>("http://localhost:8000/doc/purpose",data);
  }
  putfile(id: number, data: any)
  {
    
    return this.http.put<any>("http://localhost:8000/doc/"+id,data);
  }
  deletefile(id: number)
  {
    console.log("http://localhost:8000/doc/"+id)
    return this.http.delete<any>("http://localhost:8000/doc/"+id);
  }
}
