import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CheckboxControlValueAccessor } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  postfile(data : any){
    return this.http.post<any>("http://localhost:8000/doc_client",data);
  }
  getfile(){
    
    return this.http.get<any>("http://localhost:8000/doc_client/");
  }
  putfile(id: number, data: any)
  {
    
    return this.http.put<any>("http://localhost:8000/doc_client/"+id,data);
  }
  deletefile(id: number)
  {
    console.log("http://localhost:8000/doc_client/"+id)
    return this.http.delete<any>("http://localhost:8000/doc_client/"+id);
  }
}
