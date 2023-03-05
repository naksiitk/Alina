import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import {  Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { FilesShowDialogComponent } from 'src/app/components/home/files-show-dialog/files-show-dialog.component';
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
 
  email : any = ''
  //public email = this.api_auth.get_email_local('auditor_view_client_email_itr')
  
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
    this.email = this.api_auth.get_email_local('auditor_view_client_email' + this.id_ITR)
    this.getAllaskedfiles();
  };

  openDialog() {
    this.api_auth.save_email_local('email_add_file', this.email)
    this.dialog.open(AskDialogComponent,
    {
      width : '30%',
      
    }).afterClosed().subscribe(val => {
      if(val === 'save'){
        this.getAllaskedfiles();
      }
    })
  };
  
  uploadfile(row : any){
    row["from_asked_dialog_box"]= true
    this.dialog.open(AskDialogComponent,
      {
        width : '30%', 
        data:row
      }).afterClosed().subscribe(val => {
        if(val === 'save'){
          this.getAllfiles();
          //this.deletefile(row);
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
    this.api.get_asked_FilesWithPurpose({"email":this.email, "purpose":this.id_ITR}).subscribe({
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
    // console.log(this.email)
    // console.log(this.id_ITR)
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

  check_upload(row: any)
  {
    //console.log(row.files_uploaded.length);
    if(row.files_uploaded.length == 0)
    {return true;}
    else
    {
      //console.log("hi")
      return false;}
  }

  show_uploaded_files(row : any){
    this.dialog.open(FilesShowDialogComponent,
      {
        width : '30%', 
        data:row
      })
  }

  reminder_upload(row : any){
    this.api.reminder(row).subscribe({
      next:(res)=>{this._snackBar.open("Email Sent", "Hurray!!", {
        duration: 2000,});
      },
      error:(err)=>{
        this._snackBar.open(err.error.Status, "Contact Us", {
          duration: 2000,});
      }        
    });

  }
  

}
