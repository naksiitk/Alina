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
    // console.log(data)
    return this.http.post<any>("/doc",data);
  }
  postfile_new(data : any){
    // console.log(data)
    return this.http.post<any>("/doc/post",data);
  }
  postfile_new_asked(data : any, id:string){
    // console.log(data)
    return this.http.post<any>("/doc/post_asked/"+id,data);
  }
  getfile(data:any){
    return this.http.get<any>("/doc/"+data);
  }
  getFilesWithPurpose(data: any) {
    return this.http.post<any>("/doc/purpose",data);
  }
  putfile(id: number, data: any)
  {
    // console.log(data)
    return this.http.put<any>('/doc/update/'+id,data);
  }

  deletefile(id: number)
  {
    // console.log('/doc/'+id)
    return this.http.delete<any>('/doc/'+id);
  }

  getclient(data:any){  
    // console.log(data)
    return this.http.get<any>('/doc/client_list/'+data);
  }

  locking_the_file(id : string, data : any)
  {
    return this.http.put<any>('/doc/lock/'+id,data);
  }

  post_file_asked(data : any){
    // console.log(data)
    return this.http.post<any>('/asked_files/asked_files/',data);
  }

  get_file_asked(data:any){  
    return this.http.get<any>('/asked_files/asked_files/'+data);
  }

  get_asked_FilesWithPurpose(data: any) {
    return this.http.post<any>('/asked_files/asked_files/purpose',data);
  }
  put_file_asked(id: number, data: any)
  {
    return this.http.put<any>('/asked_files/asked_files/update/'+id,data);
  }

  delete_file_asked(id: number)
  {
    // console.log('/asked_files/'+id)
    return this.http.delete<any>('/asked_files/asked_files/'+id);
  }

  post_file_upload_aws(data : any)
  {
    return this.http.post<any>('/docs_upload/file',data);
  }

  delete_file_upload_aws(id : any, i : any)
  {
    return this.http.delete<any>('/docs_upload/images/fy/' + id.fy + 
    "/email/" + id.email + "/key/" + id.files_uploaded[i]);
  }
  copy_file_upload_aws(id : any)
  {
    return this.http.put<any>('/docs_upload/file_copy', id);
  }

  dec_client_doc_seen(id : any)
  {
    return this.http.put<any>('/doc/client_summary/seen/' + id, id);
  }

  onboard(data:any){  
    return this.http.get<any>("/user/onboarding/"+data);
  }

  reminder(data:any){  
    return this.http.post<any>("/user/reminder/",data);
  }

  ask_email(data:any){  
    return this.http.post<any>("/user/ask_file_mail",data);
  }

  getclient_all(){  
    return this.http.get<any>("/user/");
  }

  getclient_verified(){  
    return this.http.get<any>("/user/verified/");
  }

  accept_client_verified(data: any){  
    return this.http.post<any>("/user/verified/check/", data);
  }

  delete_client(data: any){  
    return this.http.delete<any>("/user/email/" +  data);
  }
  
  //Credentials URL for BackEnd

  deletecredentials(data: any){  
    return this.http.post<any>("/credential/delete/" +  data,'');
  }

  getcredentials_client(get_details_option : string){
    if(get_details_option == 'client')
    {
    return this.http.get<any>("/credential/client/all/");
    }
    else {
      return this.http.get<any>("/credential/auditor/all/purpose/"+get_details_option);
    }
  }
 
  AddCredentials(data : any){
    return this.http.post<any>('/credential/add_new_credential/',data);
  }

  getcredentials_client_ITR(email :any){
    return this.http.get<any>("/credential/client/AIS/"+email);
  }

  // Python script API 

  generate_ais_scrap(data : any){
    // console.log(data)
    return this.http.post<any>("http://localhost:3056/", data)
  }

  show_ais_scrap(data: any){
    return this.http.get<any>("/credential/AIS/AIS/show/"+data)
  }



  


}
