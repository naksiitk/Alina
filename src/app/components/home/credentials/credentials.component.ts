import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { Component, OnInit, ViewChild, Input} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css']
})
export class CredentialsComponent implements OnInit {
  displayedColumns: string[]
  @Input('childToMaster') get_details_option: string;

  constructor(public dialog: MatDialog, private api : ApiService, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver
    , private api_auth : AuthService,public _snackBar: MatSnackBar,
    ) {

      
        
    };

  title = 'my-app';

  public email = this.api_auth.get_email_local('email')
  
  // displayedColumns_mobile: string[] = ['filename','files_uploaded'];

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
    if(this.get_details_option == 'client'){
      this.displayedColumns = ['credential_type', 'user_id','password','PAN_GSTIN', 'registered_mobile', 'registered_email', 'Action'];
      }
    else{
      this.displayedColumns = ['user_name', 'user_id','password','PAN_GSTIN', 'registered_mobile', 'registered_email', 'Action'];
    }
    
    this.getAllcredentials();

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
  
  openDialogDelete(row: any) {
    this.dialog_size_function(this.current_break_point)
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width : this.dialog_size,
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result) this.deletecredentials(row);
    })
  };

  deletecredentials(row : any){
    this.api.deletecredentials(row._id)
    .subscribe({
      next:(res) => {this._snackBar.open("Credential Deleted Successfully","OK", {
        duration: 3000,
      });
      this.getAllcredentials();
      },
      error:(err) => {this._snackBar.open(err.error.message,"Contact Us", {
        duration: 3000,
      });}
      });
  }
  
  getAllcredentials(){
    this.api.getcredentials_client(this.get_details_option).subscribe({
        next:(res)=>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        },
        error:(err)=>{
          this._snackBar.open(err.error.message,"Contact Us", {
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