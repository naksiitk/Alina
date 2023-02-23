import { Component,  } from '@angular/core';
import { ActivatedRoute,} from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-auditor-home',
  templateUrl: './auditor-home.component.html',
  styleUrls: ['./auditor-home.component.css']
})
export class AuditorHomeComponent {
  constructor( private route: ActivatedRoute, 
    private localStorage : LocalStorageService,
    private authService: AuthService) {}
;
 
 
 Name : any = this.localStorage.getName();
 current_finish = 0
 logout(){
    this.authService.logout_user()
   }

}
