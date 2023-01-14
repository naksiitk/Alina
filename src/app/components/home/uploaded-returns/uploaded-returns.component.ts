import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';

import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { DialogComponent } from '../dialog/dialog.component';

@Component({
  selector: 'app-uploaded-returns',
  templateUrl: './uploaded-returns.component.html',
  styleUrls: ['./uploaded-returns.component.css']
})
export class UploadedReturnsComponent  implements OnInit {
  constructor(public dialog: MatDialog, private api : ApiService, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver) {};

  title = 'my-app';
  email = this.route.snapshot.paramMap.get('email');

  displayedColumns: string[] = ['file_name', 'purpose', 'comments', 'files_uploaded'];
  dataSource  !: MatTableDataSource<any>;

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  
  ngOnInit(): void {
    this.getAllfiles();
    console.log(this.route.snapshot.paramMap.get('email'))
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