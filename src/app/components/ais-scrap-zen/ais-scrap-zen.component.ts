import { Component, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-ais-scrap-zen',
  templateUrl: './ais-scrap-zen.component.html',
  styleUrls: ['./ais-scrap-zen.component.css']
})
export class AisScrapZenComponent {
  constructor(public _snackBar: MatSnackBar, private api_auth : AuthService,
    private api : ApiService,private formbuilder : FormBuilder)
  {
    this.get_credentials_top_down()
  }
  displayedColumns: string[] = ['email', 'PAN','Information_source','Information_description', 'Information_category', 'Amount_description', 'Amount'];
  dataSource  : MatTableDataSource<any[]> = new MatTableDataSource<any[]>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  file_list !: FormGroup;

  ngOnInit(): void {
    this.file_list = this.formbuilder.group({
      id        : ["",Validators.required]
    });
  }

  email = "kmbmotorllp@gmail.com"
  PAN = "AASFK11158"

  // getAllfiles(){
  //   this.api_zen.get_PAN(this.email, this.PAN).subscribe({
  //     next:(res)=>{
  //       res["PANorGSTIN"]
  //     },
  //     error:(err)=>{
  //       this._snackBar.open(err.error.message,"Contact Us");
  //     }
  // })
  // }

  generate_AIS(){
    if(this.file_list.valid){
      console.log(this.file_list.value.id)
      this.api.generate_ais_scrap({"id" : this.file_list.value.id}).subscribe({
        next:(res)=>{
          console.log(res)
          this._snackBar.open(res.message,"Click Show");
        },
        error:(err)=>{
          console.log(err)
          this._snackBar.open(err.error.message,"Contact Us");
        }
      })
    }
    else{
      this._snackBar.open("Please Fill this form properly","Ok");
    }
  }
  show_AIS()
  {
    this.api.show_ais_scrap(this.file_list.value.id).subscribe({
      next:(res)=>{
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error:()=>{
        this._snackBar.open("Error while fetching products","Contact Us", {
          duration: 3000,
        });
      }
  })
    
  }
  List_units : any = []
  get_credentials_top_down(){
    this.api.getcredentials_client_ITR(this.api_auth.get_email_local('email')).subscribe({
      next:(res)=>{
        for( let option = 0; option < res.length; option++){
          this.List_units.push(res[option])}
        console.log(res[0])
      },
      error:()=>{
        this._snackBar.open("Error while fetching products","Contact Us");
      }
  })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


}
