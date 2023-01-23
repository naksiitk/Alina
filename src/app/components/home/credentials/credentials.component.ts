import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { range } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { CredentialsService } from 'src/app/services/credentials.service';
import { DialogCredentialsComponent } from '../dialog-credentials/dialog-credentials.component';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';

export interface RowValue {
  name: string;
  colon: string;
  value: string;
  _id: string;
}

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css']
})
export class CredentialsComponent implements OnInit {
  displayedColumns: string[] = ['name', 'colon','value'];
  dataSource: [RowValue[],RowValue[],RowValue[]] = [[],[],[]]
  credential_type = ['GST', 'Income Tax', 'TDS'];

  constructor(public dialog: MatDialog, private api : CredentialsService, private api_auth: AuthService) {};

  ngOnInit(): void {
    this.getAllcredentials();
  };

  getAllcredentials() {
    const user_email = this.api_auth.get_email_local('email')

    this.api.FetchAllCredentials({email : user_email}).subscribe({
      next:(res)=>{
        
        for(var i= 0; i < res.length; i++) {

          let row0: RowValue = {name: res[i].credential_type + ' user_name', colon: ':', value: res[i].user_id, _id:res[i]._id}
          let row1: RowValue = {name: res[i].credential_type + ' password', colon: ':', value: res[i].password, _id:res[i]._id}
          let row2: RowValue = {name: 'Registered Mobile', colon: ':', value: res[i].registered_mobile, _id:res[i]._id}
          let row3: RowValue = {name: 'Registered Email', colon: ':', value: res[i].registered_email, _id:res[i]._id}

          if(res[i].credential_type == 'GST') this.dataSource[0] = [row0,row1,row2,row3]
          if(res[i].credential_type == 'ITR') this.dataSource[1] = [row0,row1,row2,row3]
          if(res[i].credential_type == 'TDS') this.dataSource[2] = [row0,row1,row2,row3]

        }

        console.log(res);
        // this.dataSource = res;
      },
      error:()=>{
        alert("Error while fetching products");
      }
    })
  }

  openDialogAdd(type: string) {
    console.log('You are awesome')
    const dialogRef = this.dialog.open(DialogCredentialsComponent, {
      width : '30%'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      
    })
  };

  openDialogDelete(credential_id: any) {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width : '30%'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result) this.deleteCredentials(credential_id);
    })
  };

  deleteCredentials(credential_id: any) {
    console.log(credential_id)
    // this.api.DeleteOneCredentials()
  };
}
