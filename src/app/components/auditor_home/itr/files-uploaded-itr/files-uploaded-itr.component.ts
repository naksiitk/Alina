import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {  Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogDeleteComponent } from '../../../home/dialog-delete/dialog-delete.component';
import { DialogComponent } from '../../../home/dialog/dialog.component';


@Component({
  selector: 'app-files-uploaded-itr',
  templateUrl: './files-uploaded-itr.component.html',
  styleUrls: ['./files-uploaded-itr.component.css']
})
export class FilesUploadedItrComponent implements OnInit {

  

  constructor(public dialog: MatDialog, private api : ApiService, private route: Router, private breakpointObserver: BreakpointObserver
    , private api_auth : AuthService) {};

    title = 'my-app';
 
  public email = this.api_auth.get_email_local('auditor_view_client_email_itr')
  
  displayedColumns: string[] = ['filename','fy_month_quarter', 'files_uploaded'];

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
    this.getAllfiles();
  };

  openDialog() {
    this.dialog.open(DialogComponent,
    {
      width : '30%'
    }).afterClosed().subscribe(val => {
      if(val === 'save'){
        this.getAllfiles();
      }
    })
  };
  
  editfile(row : any){
    this.dialog.open(DialogComponent,
      {
        width : '30%', 
        data:row
      }).afterClosed().subscribe(val => {
        if(val === 'update'){
          this.getAllfiles();
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
    this.api.deletefile(row._id)
    .subscribe({
      next:(res) => {alert("File Deleted Successfully");
      this.getAllfiles();
    },
      error:(err) => {alert("File Deletion Failed")}
    });
    
  }
  getAllfiles(){
    this.api.getFilesWithPurpose({"email":this.email, "purpose":"ITR"}).subscribe({
        next:(res)=>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error:()=>{
          alert("Error while fetching products");
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

  show_all_rows(){
    this.show_everything = !this.show_everything;
    if(this.show_everything == true){
      this.displayedColumns.push("uploadedat");
      this.displayedColumns.push("comments");
      this.displayedColumns.push("Action");
    }else
    {
      this.displayedColumns.pop();
      this.displayedColumns.pop();
      this.displayedColumns.pop();
    }
  }
  isChecked(id : string, lock:Boolean)
  {
    console.log(id);
    this.api.locking_the_file(id, {"lock":lock})
    .subscribe({
      next(res) {
        if(lock == true){
        alert("file locked");
        }
        else{
          alert("file unclocked");
        }
      },
      error(err) {
        alert(err);
      }
    });
    //Lock the file id lock is one
  }

}
