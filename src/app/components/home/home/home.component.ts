import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  title = 'my-app';

  displayedColumns: string[] = ['file_name', 'purpose', 'comments', 'files_uploaded', 'Edit', 'Delete'];
  dataSource  !: MatTableDataSource<any>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(public dialog: MatDialog, private api : ApiService ) {}
  ngOnInit(): void {
    this.getAllfiles();
  }
;

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
  
  deletefile(row : any){
    console.log(row.id);
    this.api.deletefile(row.id)
    .subscribe({
      next:(res) => {alert("product Successfully Deleted");
      this.getAllfiles();
    },
      error:(err) => {alert("File Deletion Failed")}
    });
    
  }
  getAllfiles(){
    this.api.getfile().subscribe({
        next:(res)=>{
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(res);
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

}
