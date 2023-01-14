import { Component } from '@angular/core';
export interface PeriodicElement {
  head: string;
  amount: number;
  status: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {head: 'Income Tax 22-23 Filling', amount: 5000, status: 'due'},
  {head: 'December 22 GST Filling', amount: 3500, status: 'due'},
  {head: 'November 22 GST Filling', amount: 3500, status: 'due'},
  {head: 'October 22 GST Filling', amount: 3500, status: 'paid'},
  {head: 'September 22 GST Filling', amount: 3500, status: 'paid'},
];
@Component({
  selector: 'app-billing-history',
  templateUrl: './billing-history.component.html',
  styleUrls: ['./billing-history.component.css']
})
export class BillingHistoryComponent {
  displayedColumns: string[] = ['head', 'amount','status'];
  dataSource = ELEMENT_DATA;
}
