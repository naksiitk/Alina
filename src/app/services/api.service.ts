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
    console.log(data)
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
    return this.http.put<any>("http://localhost:8000/doc/update/"+id,data);
  }

  deletefile(id: number)
  {
    console.log("http://localhost:8000/doc/"+id)
    return this.http.delete<any>("http://localhost:8000/doc/"+id);
  }

  getclient(data:any){  
    return this.http.get<any>("http://localhost:8000/doc/client_list/"+data);
  }

  locking_the_file(id : string, data : any)
  {
    return this.http.put<any>("http://localhost:8000/doc/lock/"+id,data);
  }

  post_file_asked(data : any){
    console.log(data)
    return this.http.post<any>("http://localhost:8000/asked_files/asked_files/",data);
  }

  get_file_asked(data:any){  
    return this.http.get<any>("http://localhost:8000/asked_files/asked_files/"+data);
  }

  get_asked_FilesWithPurpose(data: any) {
    return this.http.post<any>("http://localhost:8000/asked_files/asked_files/purpose",data);
  }
  put_file_asked(id: number, data: any)
  {
    return this.http.put<any>("http://localhost:8000/asked_files/asked_files/update/"+id,data);
  }

  delete_file_asked(id: number)
  {
    console.log("http://localhost:8000/asked_files/"+id)
    return this.http.delete<any>("http://localhost:8000/asked_files/asked_files/"+id);
  }
}
