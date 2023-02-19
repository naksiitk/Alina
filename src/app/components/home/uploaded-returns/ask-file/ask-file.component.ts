import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
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

@Component({
  selector: 'app-ask-file',
  templateUrl: './ask-file.component.html',
  styleUrls: ['./ask-file.component.css']
})
export class AskFileComponent implements OnInit {
  constructor(public dialog: MatDialog, private route: Router, private breakpointObserver: BreakpointObserver
    , private api_auth : AuthService, private api : ApiService, public _snackBar: MatSnackBar,    ) {};

    title = 'my-app';
 
  public email = this.api_auth.get_email_local('email')
  
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
    this.api. get_file_asked(this.api_auth.get_email_local('email')).subscribe({
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
    this.api. get_asked_FilesWithPurpose({"email":this.email, "purpose":"ITR"}).subscribe({
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
