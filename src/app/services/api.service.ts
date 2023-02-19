import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckboxControlValueAccessor } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  backend_route =  environment.apiUrl;    //'http://54.90.42.79/api' 
  constructor(private http : HttpClient, private api_auth:AuthService) { }

  postfile(data : any){
    console.log(data)
    return this.http.post<any>(this.backend_route + "/doc",data);
  }
  getfile(data:any){  
    console.log(this.backend_route)
    return this.http.get<any>(this.backend_route + "/doc/"+data);
  }
  getFilesWithPurpose(data: any) {
    return this.http.post<any>(this.backend_route + "/doc/purpose",data);
  }
  putfile(id: number, data: any)
  {
    return this.http.put<any>(this.backend_route + '/doc/update/'+id,data);
  }

  deletefile(id: number)
  {
    console.log(this.backend_route + '/doc/'+id)
    return this.http.delete<any>(this.backend_route + '/doc/'+id);
  }

  getclient(data:any){  
    return this.http.get<any>(this.backend_route + '/doc/client_list/'+data);
  }

  locking_the_file(id : string, data : any)
  {
    return this.http.put<any>(this.backend_route + '/doc/lock/'+id,data);
  }

  post_file_asked(data : any){
    console.log(data)
    return this.http.post<any>(this.backend_route + '/asked_files/asked_files/',data);
  }

  get_file_asked(data:any){  
    return this.http.get<any>(this.backend_route + '/asked_files/asked_files/'+data);
  }

  get_asked_FilesWithPurpose(data: any) {
    return this.http.post<any>(this.backend_route + '/asked_files/asked_files/purpose',data);
  }
  put_file_asked(id: number, data: any)
  {
    return this.http.put<any>(this.backend_route + '/asked_files/asked_files/update/'+id,data);
  }

  delete_file_asked(id: number)
  {
    console.log(this.backend_route + '/asked_files/'+id)
    return this.http.delete<any>(this.backend_route + '/asked_files/asked_files/'+id);
  }

  post_file_upload_aws(data : any)
  {
    return this.http.post<any>(this.backend_route + '/docs_upload/file',data);
  }

  delete_file_upload_aws(id : any, i : any)
  {
    return this.http.delete<any>(this.backend_route + '/docs_upload/images/fy/' + id.fy + 
    "/email/" + id.email + "/key/" + id.files_uploaded[i]);
  }
  copy_file_upload_aws(id : any)
  {
    return this.http.put<any>(this.backend_route + '/docs_upload/file_copy', id);
  }

  dec_client_doc_seen(id : any)
  {
    return this.http.put<any>(this.backend_route + '/doc/client_summary/seen/' + id, id);
  }

  onboard(data:any){  
    return this.http.get<any>(this.backend_route + "/user/onboarding/"+data);
  }

  ask_email(data:any){  
    return this.http.post<any>(this.backend_route + "/user/ask_file_mail",data);
  }



}
