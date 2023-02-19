import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AddClientComponent } from './add-client/add-client.component';
import { AskFileDashboardComponent } from './ask-file-dashboard/ask-file-dashboard.component';
import { UploadFileDashboardComponent } from './upload-file-dashboard/upload-file-dashboard.component';
export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {

  constructor(public dialog: MatDialog,){}
  tiles: Tile[] = [
    {text: 'One', cols: 2, rows: 2, color: 'lightblue'},
    {text: 'Two', cols: 2, rows: 2, color: 'lightgreen'},
    {text: 'Three', cols: 2, rows: 1, color: 'lightpink'},
    {text: 'Four', cols: 2, rows: 1, color: '#DDBDF1'},
    {text: 'Five', cols: 2, rows: 2, color: '#DDBDF1'},
    {text: 'Six', cols: 2, rows: 2, color: '#DDBDF1'},
    {text: 'Seven', cols: 2, rows: 2, color: '#DDBDF1'},
  ];

  ITR = "ITR";
  GST = "GST";
  TDS = "TDS";
  d = new Date();
  date = new Date(Date.now()).toLocaleString('en-GB').split(',')[0];
  client_add(){
    this.dialog.open(AddClientComponent,
      {
        width : '30em', 
      }) 
  }

  upload_file(){
    this.dialog.open(UploadFileDashboardComponent,
      {
        width : '30em', 
      }) 
  }

  ask_file(){
    this.dialog.open(AskFileDashboardComponent,
      {
        width : '30em', 
      }) 
  }
 
}
