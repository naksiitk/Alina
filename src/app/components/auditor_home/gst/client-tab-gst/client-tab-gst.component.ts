import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-client-tab-gst',
  templateUrl: './client-tab-gst.component.html',
  styleUrls: ['./client-tab-gst.component.css']
})
export class ClientTabGstComponent {
  isChecked = true;

  constructor(private api : ApiService, private route: Router, private api_auth : AuthService) {};

    title = 'my-app';

  public email = this.api_auth.get_email_local('auditor_view_client_email_gst')
  

  goback(){
    this.api_auth.remove_email_local("auditor_view_client_email_gst")
    this.route.navigate(["/auditor/gst"])
  }
  


}
