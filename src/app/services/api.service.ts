import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http : HttpClient) { }

  postfile(data : any){
    return this.http.post<any>("http://localhost:3000/File_list",data);
  }
  getfile(){
    return this.http.get<any>("http://localhost:3000/File_list");
  }
  putfile(id: number, data: any)
  {
    return this.http.put<any>("http://localhost:3000/File_list/"+id,data);
  }
  deletefile(id: number)
  {
    return this.http.delete<any>("http://localhost:3000/File_list/"+id);
  }
}
