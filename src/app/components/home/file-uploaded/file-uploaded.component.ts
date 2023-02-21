import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { Component, OnInit, ViewChild} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { DialogComponent } from '../dialog/dialog.component';
import { FilesShowDialogComponent } from '../files-show-dialog/files-show-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-file-uploaded',
  templateUrl: './file-uploaded.component.html',
  styleUrls: ['./file-uploaded.component.css']
})
export class FileUploadedComponent implements OnInit {
  constructor(public dialog: MatDialog, private api : ApiService, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver
    , private api_auth : AuthService,public _snackBar: MatSnackBar,
    ) {console.log(environment.production);};

  title = 'my-app';

  public email = this.api_auth.get_email_local('email')
  displayedColumns: string[] = ['filename', 'purpose','fy','month_quarter', 'files_uploaded'];
  displayedColumns_mobile: string[] = ['filename','files_uploaded'];
  
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
    this.getAllfiles();
    this.getAllaskedfiles();

    this.breakpoint$.subscribe(() =>
      this.breakpointChanged()
    );
  
  };

  private breakpointChanged() {
    if(this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait)) {
      this.current_break_point = 1;
  //    this.dialog_size = '90%';
    } else {
      this.current_break_point = 0;
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
  
  openDialog() {
    this.dialog_size_function(this.current_break_point)
    this.dialog.open(DialogComponent,
    {
      width : this.dialog_size,
    }).afterClosed().subscribe(val => {
      if(val === 'save'){
        this.getAllfiles();
      }
    })
  };
  
  editfile(row : any){
    this.dialog_size_function(this.current_break_point)
    this.dialog.open(DialogComponent,
      {
        width : this.dialog_size,
        data:row
      }).afterClosed().subscribe(val => {
        if(val === 'update'){
          this.getAllfiles();
        }
      })
    };

  openDialogDelete(row: any) {
    this.dialog_size_function(this.current_break_point)
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width : this.dialog_size,
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result) this.deletefile(row);
    })
  };

  deletefile(row : any){
    console.log(row.files_uploaded.length );
    let k = 0, i =0;
    if(k == i)
    {
      this.api.deletefile(row._id)
      .subscribe({
        next:(res) => {this._snackBar.open("File Deleted Successfully","OK", {
          duration: 3000,
        });
        this.getAllfiles();
        },
        error:(err) => {this._snackBar.open(err.error.message,"Contact Us", {
          duration: 3000,
        });}
        });
    } 

    console.log(k,i);

    for (i = 0 ; i<= row.files_uploaded.length ; i++)
    {
      this.api.delete_file_upload_aws(row, i)
      .subscribe({
        next:(res) => {k = k+1; console.log(k)},
        error:(err) => {this._snackBar.open(err.error.Status,"Contact Us", {
          duration: 2000,
        });}
      });
    }  
  }
  
  getAllfiles(){
    this.api.getfile(this.api_auth.get_email_local('email')).subscribe({
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

  show_more : boolean = false;
  showmore(){
    this.show_more = !this.show_more;
  }

  show_uploaded_files(row : any){
    this.dialog_size_function(this.current_break_point)
      this.dialog.open(FilesShowDialogComponent,
        {
          width : this.dialog_size, 
          data:row
        })
  }

  counter = 1;
  getAllaskedfiles(){
    this.api. get_asked_FilesWithPurpose({"email":this.email, "purpose":"ITR"}).subscribe({
        next:(res)=>{
          this.counter = res.length;
        }
      })
  }

}
