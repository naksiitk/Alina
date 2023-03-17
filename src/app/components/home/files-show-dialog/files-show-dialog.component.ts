import { Component ,Inject, Input, OnInit,ViewChild} from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { environment } from 'src/environments/environment';
import { FileDownloadService } from 'src/app/services/file-download.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { FilePreviewDialogComponent } from '../file-preview-dialog/file-preview-dialog.component';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { MatPaginator } from '@angular/material/paginator';
@Component({
  selector: 'app-files-show-dialog',
  templateUrl: './files-show-dialog.component.html',
  styleUrls: ['./files-show-dialog.component.css']
})
export class FilesShowDialogComponent implements OnInit{
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  doc_url = ''
  fileName_array : any[] = [];
  JWT = this.localStorage.getJWT()
 

  backend_route = environment.apiUrl;
  Breakpoints = Breakpoints;
  current_break_point = 0;
  readonly breakpoint$ = this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait])
    .pipe(
      tap(value => console.log(value)),
      distinctUntilChanged()
    );
  
  constructor(@Inject(MAT_DIALOG_DATA) public filesdata: any, public dialog: MatDialog, 
  public localStorage: LocalStorageService, public fileDownloadService: FileDownloadService, 
  public _snackBar: MatSnackBar,private breakpointObserver: BreakpointObserver){

    for( let index = 0; index<= this.filesdata.files_uploaded.length; index++)
    {
      let file = filesdata.files_uploaded[index];
      if(file){
        this.fileName_array.push({'files_uploaded':file});
        // this.getAllfiles(this.fileName_array); 
      }
    }
    console.log(filesdata)
  }
  ngOnInit(): void {
    this.breakpoint$.subscribe(() =>
      this.breakpointChanged()
    );
    this.getAllfiles(this.fileName_array)
    // this.dataSource.paginator = this.paginator;
  }

  private breakpointChanged() {
    if(this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait)) {
      this.current_break_point = 1;
  //    this.dialog_size = '90%';
    } else {
      this.current_break_point = 0;
  //    this.dialog_size = '30%';
    } 
  }

  dialog_size = '60%'
  dialog_size_function(current_break_point : Number)
  {
    if(this.current_break_point) {
      this.dialog_size = '100%';
    } else {
      this.dialog_size = '60%';
    } 
    return this.dialog_size
  }

  displayedColumns: string[] = ['files_uploaded', 'preview', 'download'];
  displayedColumns_mobile: string[] = ['files_uploaded','download'];
  dataSource  : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  getAllfiles(res : any){ 
    
    this.dataSource = new MatTableDataSource(res);
    this.dataSource.paginator = this.paginator;
  }

  IsPDF(filename : string) {
    if(filename.slice(-4) == '.pdf')
      return true
    else 
      return false
  }
   
  OpenPDFviewer(fy : string, email : string, files_uploaded : string) {
    this.dialog_size_function(this.current_break_point);
    this.fileDownloadService.getFileBlob(this.filesdata._id, files_uploaded)
    .subscribe(blob => {  
      let dialogref = this.dialog.open(FilePreviewDialogComponent,
        {
          width : this.dialog_size,
          height: '95vh',
          data: blob
        })
    }, (err) => {
      this._snackBar.open('Error Fetching File', 'Try Again', {
        duration: 2000,
      });
    })

  }

  downloadFile(fy : string, email : string, files_uploaded : string) {
    this.fileDownloadService.downloadFile(this.filesdata._id, files_uploaded)
  }

  downloadZip() {
    this.fileDownloadService.downloadZip(this.filesdata._id)
  }
}
