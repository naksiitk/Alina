import { Component ,Inject, Input} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { FilePreviewDialogComponent } from '../file-preview-dialog/file-preview-dialog.component';
@Component({
  selector: 'app-files-show-dialog',
  templateUrl: './files-show-dialog.component.html',
  styleUrls: ['./files-show-dialog.component.css']
})
export class FilesShowDialogComponent {

  doc_url = ''
  fileName_array : any[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) public filesdata: any, public dialog: MatDialog){

    for( let index = 0; index<= this.filesdata.files_uploaded.length; index++)
    {
      let file = filesdata.files_uploaded[index];
      if(file){
        this.fileName_array.push({'files_uploaded':file});
        this.getAllfiles(this.fileName_array); 
      }
    }
    console.log(filesdata)
  }

  displayedColumns: string[] = ['files_uploaded', 'preview', 'download'];
  dataSource  : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  getAllfiles(res : any){ 

    this.dataSource = new MatTableDataSource(res);
  }

  IsPDF(filename : string) {
    if(filename.slice(-4) == '.pdf')
      return true
    else 
      return false
  }

  OpenPDFviewer(fy : string, email : string, files_uploaded : string) {
    this.doc_url = "http://localhost:8000/docs_upload/images/fy/" + fy + "/email/" + email + "/key/" + files_uploaded

    let dialogref = this.dialog.open(FilePreviewDialogComponent,
      {
        width : '60%',
        height: '95vh',
        data: this.doc_url
      })
  }

}
