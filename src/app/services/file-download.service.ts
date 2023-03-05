import { HttpClient, HttpErrorResponse } from '@angular/common/http'
import { Injectable } from '@angular/core'
import { MatSnackBar } from '@angular/material/snack-bar'
import { Observable, Subject } from 'rxjs'
import { catchError } from 'rxjs/operators'
 import { saveAs } from 'file-saver'
//var FileSaver = require('file-saver');

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor(private http: HttpClient, public _snackBar: MatSnackBar) { 
   
  }
  
  parseErrorBlob(err: HttpErrorResponse): Observable<any> {
    const reader: FileReader = new FileReader();

    const obs = new Observable(observer => {
      reader.onloadend = (e) => {
            if (typeof reader.result === 'string') {
              observer.error(JSON.parse(reader.result));
              observer.complete();
            }
        }
      });

    reader.readAsText(err.error);
    return obs;
  }


  downloadFile(id : string, files_uploaded : string){
    this.getFile(id, files_uploaded)
    .subscribe(resultBlob => 
      {
        //Success
        console.log('start download:', resultBlob);
        var blob = new Blob([resultBlob]);
        saveAs(blob, files_uploaded);
        
      },
    error => {
      //Error
      this._snackBar.open(error.message,"Contact Us", {
        duration: 3000,
      });
    });
  }


  getFile(id : string, files_uploaded : string): Observable<Blob> {
    const doc_url = "/docs_upload/images/" + id  + "/key/" + files_uploaded
    return this.http.get<Blob>(doc_url, { responseType: 'blob' as 'json' })
  }


  public getFileBlob(id : string, files_uploaded : string) {
    const doc_url =  "/docs_upload/images/" + id  + "/key/" + files_uploaded

    var subject = new Subject<Blob>();

    this.http.get(doc_url, {responseType: 'blob'})
    .pipe(catchError(this.parseErrorBlob))
    .subscribe((blob : Blob) => {
        console.log(blob)
        subject.next(blob)
      }, (err) => {
        this._snackBar.open(err.message,"Contact Us", {
          duration: 2500,
      });
    })

    return subject.asObservable()
  }

}
