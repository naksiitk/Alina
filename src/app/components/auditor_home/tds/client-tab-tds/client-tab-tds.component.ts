import { BreakpointObserver} from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import {Router } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-client-tab-tds',
  templateUrl: './client-tab-tds.component.html',
  styleUrls: ['./client-tab-tds.component.css']
})
export class ClientTabTdsComponent {

  constructor(public dialog: MatDialog, private api : ApiService, private route: Router, private breakpointObserver: BreakpointObserver
    , private api_auth : AuthService) {};

  public email = this.api_auth.get_email_local('auditor_view_client_email_tds')
 
  goback(){
    this.api_auth.remove_email_local("auditor_view_client_email_tds")
    this.route.navigate(["/auditor/tds"])
  }
  
}
