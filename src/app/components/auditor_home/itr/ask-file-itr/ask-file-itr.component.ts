import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {  Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogDeleteComponent } from '../../../home/dialog-delete/dialog-delete.component';
import { DialogComponent } from '../../../home/dialog/dialog.component';
import { AskDialogComponent } from '../../ask-dialog/ask-dialog.component';

@Component({
  selector: 'app-ask-file-itr',
  templateUrl: './ask-file-itr.component.html',
  styleUrls: ['./ask-file-itr.component.css']
})
export class AskFileItrComponent implements OnInit {
  @Input('childToMaster') id_ITR:string;
  constructor(public dialog: MatDialog, private api : ApiService, private route: Router, private breakpointObserver: BreakpointObserver
    , private api_auth : AuthService, public _snackBar: MatSnackBar) {};

    title = 'my-app';
 
  public email = this.api_auth.get_email_local('auditor_view_client_email_itr')
  
  displayedColumns: string[] = ['filename','fy','month_quarter', 'comments', 'Action'];

  show_everything = false;
  dataSource  : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngOnInit(): void {
    // this.getAllfiles();
    this.getAllaskedfiles();
  };

  openDialog() {
    this.dialog.open(AskDialogComponent,
    {
      width : '30%'
    }).afterClosed().subscribe(val => {
      if(val === 'save'){
        this.getAllaskedfiles();
      }
    })
  };
  
  uploadfile(row : any){
    row["from_asked_dialog_box"]= true
    this.dialog.open(DialogComponent,
      {
        width : '30%', 
        data:row
      }).afterClosed().subscribe(val => {
        if(val === 'save'){
          this.getAllfiles();
          this.deletefile(row);
        }
      })
      
    };

  openDialogDelete(row: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width : '30%'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result) this.deletefile(row);
    })
  };

  deletefile(row : any){
    console.log(row._id);
    this.api.delete_file_asked(row._id)
    .subscribe({
      next:(res) => {this._snackBar.open("File Deleted Successfully","OK", {
        duration: 3000,
      });
      this.getAllaskedfiles();
    },
      error:(err) => {this._snackBar.open(err.error.Status,"Contact Us", {
        duration: 3000,
      });}
    });
    
  }
  getAllfiles(){
    this.api. getFilesWithPurpose({"email":this.email, "purpose":this.id_ITR}).subscribe({
        next:(res)=>{
          // this.dataSource = new MatTableDataSource(res);
          // this.dataSource.paginator = this.paginator;
          // this.dataSource.sort = this.sort;
        },
        error:()=>{
          this._snackBar.open("Error while fetching products","Contact Us", {
            duration: 3000,
          });
        }
      })
  }

  getAllaskedfiles(){
    this.api. get_asked_FilesWithPurpose({"email":this.email, "purpose":this.id_ITR}).subscribe({
        next:(res)=>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error:()=>{
          this._snackBar.open("Error while fetching products","Contact Us", {
            duration: 3000,
          });
        }
      })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  

}
