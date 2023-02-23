import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoaderService {

  isLoading = new Subject<boolean>();

  constructor() {
  }

  show() {
    //  console.log("hi")
     this.isLoading.next(true);
  }

  hide() {
    // console.log("bye")
     this.isLoading.next(false);
  }
}
