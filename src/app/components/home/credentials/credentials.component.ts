import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from '../dialog-delete/dialog-delete.component';

export interface PeriodicElement {
  name: string;
  colon: string;
  value: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'GST userID', colon: ':', value: 'GSTN00123848393844'},
  {name: 'GST password', colon: ':', value: '@341Kldkemdsm'},
  {name: 'Registered mobile', colon: ':', value: 'MFEOD1394V'},
  {name: 'Registered email', colon: ':', value: '8483938443'},
];

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css']
})
export class CredentialsComponent {
  displayedColumns: string[] = ['name', 'colon','value'];
  dataSource = ELEMENT_DATA;

  constructor(public dialog: MatDialog) {};

  openDialogDelete() {
    const dialogRef = this.dialog.open(DialogDeleteComponent, {
      width : '30%'
    });
    
    dialogRef.afterClosed().subscribe(result => {
      if(result) this.deleteCredentials();
    })
  };

  deleteCredentials() {
    console.log('deleted')
  };
}
