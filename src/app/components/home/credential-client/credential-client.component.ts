import { BreakpointObserver , Breakpoints} from '@angular/cdk/layout';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { DialogCredentialsComponent } from '../dialog-credentials/dialog-credentials.component';
import { DialogComponent } from '../dialog/dialog.component';


@Component({
  selector: 'app-credential-client',
  templateUrl: './credential-client.component.html',
  styleUrls: ['./credential-client.component.css']
})
export class CredentialClientComponent implements OnInit {

  constructor(public dialog: MatDialog, public breakpointObserver: BreakpointObserver){};

  Breakpoints = Breakpoints;
  current_break_point = 0;
  readonly breakpoint$ = this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait])
    .pipe(
      tap(value => console.log(value)),
      distinctUntilChanged()
    );
    
  ngOnInit(): void {
    this.breakpoint$.subscribe(() =>
      this.breakpointChanged()
    );
  
  };

  private breakpointChanged() {
    if(this.breakpointObserver.isMatched(Breakpoints.HandsetPortrait)) {
      this.current_break_point = 1;
  //    this.dialog_size = '90%';
    } else {
      this.current_break_point = 0;
  //    this.dialog_size = '30%';
    } 
  }
  dialog_size = '30%'
  dialog_size_function(current_break_point : Number)
  {
    if(this.current_break_point) {
      this.dialog_size = '95%';
    } else {
      this.dialog_size = '30%';
    } 
    return this.dialog_size
  }

  option = 'client'

  openDialog() {
    this.dialog_size_function(this.current_break_point)
    this.dialog.open(DialogCredentialsComponent,
    {
      width : this.dialog_size,
    })
  };
}
