import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subject } from 'rxjs';
import { catchError } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class FileDownloadService {

  constructor(private http: HttpClient, public _snackBar: MatSnackBar) { }

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

  downloadFile(fy : string, email : string, files_uploaded : string){
    this.getFile(fy, email, files_uploaded)
    .subscribe(blob => {
      const a = document.createElement('a')
      const objectUrl = URL.createObjectURL(blob)
      a.href = objectUrl
      a.download = files_uploaded;
      a.click();
      URL.revokeObjectURL(objectUrl);
    }, (err) => {
      this._snackBar.open(err.message,"Contact Us", {
        duration: 2500,
      });
    })
  }

  getFile(fy : string, email : string, files_uploaded : string): Observable<Blob> {
    const doc_url = "http://localhost:8000/docs_upload/images/fy/" + fy + "/email/" + email + "/key/" + files_uploaded

    return this.http.get(doc_url, {responseType: 'blob'}).pipe(catchError(this.parseErrorBlob))
  }

  public getFileBlob(fy : string, email : string, files_uploaded : string) {
    const doc_url = "http://localhost:8000/docs_upload/images/fy/" + fy + "/email/" + email + "/key/" + files_uploaded

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
