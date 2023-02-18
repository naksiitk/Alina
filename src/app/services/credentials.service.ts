import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CredentialsService {

  backend_route = 'http://localhost:8000'
  constructor(private http : HttpClient) { }

  AddCredentials(data : any){
    return this.http.post<any>(this.backend_route + '/credential',data);
  }

  FetchAllCredentials(data : any){
    console.log(data)
    return this.http.post<any>(this.backend_route + '/credential/all',data);
  }

  EditOneCredentials(id: number, data: any)
  {
    return this.http.put<any>(this.backend_route + '/credential/'+id,data);
  }

  DeleteOneCredentials(id: number)
  {
    console.log(id);
    console.log(this.backend_route + '/credential/'+id);
    return this.http.delete<any>(this.backend_route + '/credential/'+id);
  }
}
