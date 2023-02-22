import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  constructor(private http : HttpClient) { }

  AddCredentials(data : any){
    return this.http.post<any>('/credential',data);
  }

  FetchAllCredentials(data : any){
    console.log(data)
    return this.http.post<any>('/credential/all',data);
  }

  EditOneCredentials(id: number, data: any)
  {
    return this.http.put<any>('/credential/'+id,data);
  }

  DeleteOneCredentials(id: number)
  {
    console.log(id);
    console.log('/credential/'+id);
    return this.http.delete<any>('/credential/'+id);
  }
}
