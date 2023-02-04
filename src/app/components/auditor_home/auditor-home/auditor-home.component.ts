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
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-auditor-home',
  templateUrl: './auditor-home.component.html',
  styleUrls: ['./auditor-home.component.css']
})
export class AuditorHomeComponent {
  constructor(public dialog: MatDialog, private api : ApiService, private route: ActivatedRoute, 
    private breakpointObserver: BreakpointObserver,
    private localStorage : LocalStorageService ) {}
;
 
 title = 'my-app';
 email : any = this.localStorage.getEmail();
 
 isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
   .pipe(
     map(result => result.matches),
     shareReplay()
   );

 logout(){
   this.localStorage.clearLocalStorage();
   }

}
