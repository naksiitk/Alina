import { Component ,Inject, Input} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'app-files-show-dialog',
  templateUrl: './files-show-dialog.component.html',
  styleUrls: ['./files-show-dialog.component.css']
})
export class FilesShowDialogComponent {

  fileName_array : any[] = [];
  backend_route : string
  constructor(@Inject(MAT_DIALOG_DATA) public filesdata: any){
    this.backend_route = environment.apiUrl;

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

  displayedColumns: string[] = ['files_uploaded'];
  dataSource  : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  getAllfiles(res : any){ 

    this.dataSource = new MatTableDataSource(res);
  }


  
  
       


}
