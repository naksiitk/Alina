import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {  Router } from '@angular/router';
// import { map, Observable, shareReplay } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogDeleteComponent } from '../../../home/dialog-delete/dialog-delete.component';
// import { DialogComponent } from '../../../home/dialog/dialog.component';
import { AskDialogComponent } from 'src/app/components/auditor_home/ask-dialog/ask-dialog.component';
import { FilesShowDialogComponent } from '../../files-show-dialog/files-show-dialog.component';

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
  
  displayedColumns: string[] = ['filename','purpose','fy','month_quarter', 'comments', 'Action'];
  displayedColumns_mobile: string[] = ['filename','Action'];
  show_everything = false;
  dataSource  : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  Breakpoints = Breakpoints;
  current_break_point = 0;
  readonly breakpoint$ = this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait])
    .pipe(
      tap(value => console.log(value)),
      distinctUntilChanged()
    );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngOnInit(): void {
    // this.getAllfiles();
    this.getAllaskedfiles();

    this.breakpoint$.subscribe(() =>
      this.breakpointChanged()
    );
  }

  private breakpointChanged() {
    if(this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait)) {
      this.current_break_point = 1;
      this.dialog_size_function(this.current_break_point);
  //    this.dialog_size = '90%';
    } else {
      this.current_break_point = 0;
      this.dialog_size_function(this.current_break_point);
  //    this.dialog_size = '30%';
    } 
  }
  dialog_size = '30%'
  dialog_size_function(current_break_point : Number)
  {
    if(this.current_break_point) {
      this.dialog_size = '95%';
    } else {
      this.dialog_size = '30%';
    } 
    return this.dialog_size
  }
  
  uploadfile(row : any){
    console.log(this.dialog_size)
    row["from_asked_dialog_box"]= true
    this.dialog.open(AskDialogComponent,
      {
        width : this.dialog_size, 
        data:row
      }).afterClosed().subscribe(val => {
        if(val === 'save'){
          this.getAllaskedfiles();
          console.log("hi")
          //this.deletefile(row);
        }
      })
      
    };

  openDialogDelete(row: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width : this.dialog_size,
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
    this.api. get_file_asked(this.email).subscribe({
        next:(res)=>{
          console.log(res)
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

  check_upload(row: any)
  {
    //console.log(row.files_uploaded.length);
    if(row.files_uploaded.length == 0)
    {return true;}
    else
    {
      console.log("hi")
      return false;}
  }

  show_uploaded_files(row : any){
    this.dialog_size_function(this.current_break_point)
      this.dialog.open(FilesShowDialogComponent,
        {
          width : this.dialog_size, 
          data:row
        })
  }

 

  

}
