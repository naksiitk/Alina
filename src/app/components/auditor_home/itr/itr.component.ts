import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { AskFileDashboardComponent } from '../dashboard/ask-file-dashboard/ask-file-dashboard.component';
import { UploadFileDashboardComponent } from '../dashboard/upload-file-dashboard/upload-file-dashboard.component';

@Component({
  selector: 'app-itr',
  templateUrl: './itr.component.html',
  styleUrls: ['./itr.component.css']
})
export class ItrComponent implements OnInit {
  constructor(public dialog: MatDialog, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver,
    private api:ApiService, private router : Router, private auth_api : AuthService) {
      this.id = this.route.snapshot.paramMap.get('id')
    };
  id : any 
  get_id_route()
  {
    return this.route.snapshot.paramMap.get('id')
  }
  displayedColumns: string[] = ['user.user_name', 'user.PAN', 'email', 'unseen'];
  
  dataSource  : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  ngOnInit(): void {
    this.id = this.route.snapshot.paramMap.get('id')
    this.getclients();
  };

  getclients(){
    this.api.getclient(this.get_id_route()).subscribe({
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

  router_link_client_tab(email : string) {
    this.auth_api.save_email_local('auditor_view_client_email' + this.id, email)
    this.auth_api.save_email_local('email_add_file', email); 
    this.router.navigate(['auditor/' + this.id + '/client_tab',this.id])
    this.hidden = !this.hidden;
  }

  upload_file(){
    this.dialog.open(UploadFileDashboardComponent,
      {
        width : '30em', 
        // height : '95vh',
        data: {'purpose_selected' : this.id}
      }).afterClosed().subscribe(val => {
        if(val === 'save'){
          this.getclients();
        }
      })
  }

  ask_file(){
    this.dialog.open(AskFileDashboardComponent,
      {
        width : '30em', 
        data: {'purpose_selected' : this.id}
      }).afterClosed().subscribe(val => {
        if(val === 'save'){
          this.getclients();
        }
      })
  }
}
