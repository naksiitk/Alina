import { Component } from '@angular/core';

export interface PeriodicElement {
  name: string;
  colon: string;
  value: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {name: 'GST number', colon: ':', value: 'GSTN00123848393844'},
  {name: 'GST password', colon: ':', value: '@341Kldkemdsm'},
  {name: 'PAN', colon: ':', value: 'MFEOD1394V'},
  {name: 'Registered number', colon: ':', value: '8483938443'},
];

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.css']
})
export class CredentialsComponent {
  displayedColumns: string[] = ['name', 'colon','value'];
  dataSource = ELEMENT_DATA;
}
