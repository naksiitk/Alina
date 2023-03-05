import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
// import { map, Observable, shareReplay } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
// import { AskFileDashboardComponent } from '../dashboard/ask-file-dashboard/ask-file-dashboard.component';
// import { UploadFileDashboardComponent } from '../dashboard/upload-file-dashboard/upload-file-dashboard.component';

@Component({
  selector: 'app-client-details',
  templateUrl: './client-details.component.html',
  styleUrls: ['./client-details.component.css']
})
export class ClientDetailsComponent implements OnInit {
  constructor(public dialog: MatDialog, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver,
    private api:ApiService, private router : Router, private auth_api : AuthService) {
      this.id = this.route.snapshot.paramMap.get('id')
    };
  id : any 
  get_id_route()
  {
    return this.route.snapshot.paramMap.get('id')
  }
  displayedColumns: string[] = ['user_name', 'PAN', 'email'];
  
  dataSource  : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.getclients();
  };

  getclients(){
    this.api.getclient_all().subscribe({
        next:(res)=>{
          
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          //console.log(this.id)
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

  hidden = false;

  


}
