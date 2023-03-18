import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
import { FilesShowDialogComponent } from '../../../home/files-show-dialog/files-show-dialog.component';
import { AskDialogComponent } from '../../ask-dialog/ask-dialog.component';


@Component({
  selector: 'app-files-uploaded-itr',
  templateUrl: './files-uploaded-itr.component.html',
  styleUrls: ['./files-uploaded-itr.component.css']
})
export class FilesUploadedItrComponent implements OnInit {

  show_everything = true;

  constructor(public dialog: MatDialog, private api : ApiService, private route: Router, private breakpointObserver: BreakpointObserver
    , private api_auth : AuthService, public _snackBar: MatSnackBar) {

      if(this.show_everything == true){
        this.displayedColumns.push("uploadedat");
        this.displayedColumns.push("comments");
        this.displayedColumns.push("Action");
      }
    };

  email : any = ''
  
  @Input('childToMaster') id_ITR: string; 
  displayedColumns: string[] = ['filename','fy','month_quarter', 'files_uploaded'];

  
  dataSource  : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngOnInit(): void {
    this.email = this.api_auth.get_email_local('auditor_view_client_email' + this.id_ITR)
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
    this.api.deletefile(row._id)
    .subscribe({
      next:(res) => {
        this._snackBar.open("File Deleted Successfully","OK", {
          duration: 3000,
        });
      this.getAllfiles();
    },
      error:(err) => {
        this._snackBar.open(err.error.message,"Contact Us", {
          duration: 3000,
        });}
    });
  }
  getAllfiles(){
    // console.log(this.email)
    this.api.getFilesWithPurpose({"email":this.email, "purpose":this.id_ITR}).subscribe({
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
    // console.log(id);
    this.api.locking_the_file(id, {"lock":lock}).subscribe({
      next:(res)=>{
        if(lock == true){
          this._snackBar.open("File Locked","Ok", {
            duration: 1000,
          });
        }
        else{
          this._snackBar.open("File Unlocked","Ok", {
            duration: 1000,});
        }
      },
      error:(err)=>{
        this._snackBar.open(err.error.message,"Contact Us", {
          duration: 4000,});
      }
    });
    //Lock the file id lock is one
  }

  show_uploaded_files(row : any){
    if(row.seen == 0){
    this.api.dec_client_doc_seen(row._id).subscribe({
      next:(res)=> {
        this._snackBar.open("File Seen","Ok", {
          duration: 1000,});
        this.getAllfiles();
      },
      error:(err)=> {
        this._snackBar.open(err.error.message,"Contact Us", {
          duration: 4000,});
      }
    });
  }
    this.dialog.open(FilesShowDialogComponent,
      {
        width : '40%', 
        data:row
      })
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
}
