import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  constructor(private http : HttpClient) { }


  AddCredentials(data : any){
    return this.http.post<any>("http://localhost:8000/credential",data);
  }

  FetchAllCredentials(data : any){
    console.log(data)
    return this.http.post<any>("http://localhost:8000/credential/all",data);
  }

  EditOneCredentials(id: number, data: any)
  {
    return this.http.put<any>("http://localhost:8000/credential/"+id,data);
  }

  DeleteOneCredentials(id: number)
  {
    console.log("http://localhost:8000/credential/"+id)
    return this.http.delete<any>("http://localhost:8000/credential/"+id);
  }
}
