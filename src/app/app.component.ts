import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor() {
    // console.log(environment.production); // Logs false for development environment
  }

  ngOnInit(): void {
   ;}

}
