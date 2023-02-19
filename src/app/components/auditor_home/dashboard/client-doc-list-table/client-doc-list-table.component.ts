import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Inject, Input } from '@angular/core';
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

@Component({
  selector: 'app-client-doc-list-table',
  templateUrl: './client-doc-list-table.component.html',
  styleUrls: ['./client-doc-list-table.component.css']
})
export class ClientDocListTableComponent implements OnInit {
  constructor(public dialog: MatDialog, private api : ApiService, private route: Router, private breakpointObserver: BreakpointObserver
    , private api_auth : AuthService, public _snackBar: MatSnackBar) {};

    title = 'my-app';
 
  // public email = this.api_auth.get_email_local('auditor_view_client_email_itr')
  
  displayedColumns: string[] = ['user.user_name', 'user.PAN'];//,'PAN', 'emailid','docs_total','docs_unseen'];

  dataSource  : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @Input("childToMaster") value: string;

  ngOnInit(): void {
    this.getAllClients();
  };

  openDialog() {
    this.dialog.open(DialogComponent,
    {
      width : '30px'
    })
  };
  
  getAllClients(){
    this.api.getclient(this.value).subscribe({
      next:(res)=>{
        
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        console.log(res[0])
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
