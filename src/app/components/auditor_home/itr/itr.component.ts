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

@Component({
  selector: 'app-itr',
  templateUrl: './itr.component.html',
  styleUrls: ['./itr.component.css']
})
export class ItrComponent implements OnInit {
  constructor(public dialog: MatDialog, private route: ActivatedRoute, private breakpointObserver: BreakpointObserver,
    private api:ApiService, private router : Router, private auth_api : AuthService) {};

  displayedColumns: string[] = ['user.user_name', 'user.PAN', 'email', 'unseen'];
  
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
    this.api.getclient("ITR").subscribe({
        next:(res)=>{
          
          this.dataSource = new MatTableDataSource(res);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
          console.log(res[0])
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
    this.auth_api.save_email_local("auditor_view_client_email_itr", email)
    this.router.navigate(['auditor/itr/client_tab'])
    this.hidden = !this.hidden;
  }


}
