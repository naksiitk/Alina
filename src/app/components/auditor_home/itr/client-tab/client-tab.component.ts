import { BreakpointObserver } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
@Component({
  selector: 'app-client-tab',
  templateUrl: './client-tab.component.html',
  styleUrls: ['./client-tab.component.css']
})
export class ClientTabComponent{
  
  constructor(public dialog: MatDialog, private api : ApiService, private route: Router, private breakpointObserver: BreakpointObserver
    , private api_auth : AuthService, private router: ActivatedRoute) {
      this.id = String(this.router.snapshot.paramMap.get('id'))
      if(this.id == "ITR")
      {
        this.id_small = 'itr'
      }
      if(this.id == "GST")
      {
        this.id_small = 'gst'
      }
      if(this.id == "TDS")
      {
        this.id_small = 'tds'
      }
      this.email = this.api_auth.get_email_local("auditor_view_client_email"+ this.id)
    };
  id : string = ''
  id_small : string = ''
  public email = this.api_auth.get_email_local("auditor_view_client_email"+ this.id)
  goback(){
    this.api_auth.remove_email_local("auditor_view_client_email"+ this.id)
    this.route.navigate(["/auditor/" + this.id_small,this.id ])
  }
  current_finish =1;
}
