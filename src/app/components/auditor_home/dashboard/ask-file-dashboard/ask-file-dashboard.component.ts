import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
import {FormControl} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ask-file-dashboard',
  templateUrl: './ask-file-dashboard.component.html',
  styleUrls: ['./ask-file-dashboard.component.css']
})
export class AskFileDashboardComponent implements OnInit{
  public userArray: User[] = [];
  selectedYear: number = new Date().getFullYear();
  years: string[] = [];
  d = new Date();
  date = new Date(Date.now()).toLocaleString('en-GB').split(',')[0];
  TDS_Container = false;
  filteredOptions: Observable<string[]>;
  myControl = new FormControl('');
  options : string[] = []
  purpose_list = ["GST", "ITR", "TDS"];
  file_list !: FormGroup;
  actionBtn : string = "Save";
  constructor(private localStorage: LocalStorageService ,private formbuilder : FormBuilder, private api : ApiService,
     private api_auth : AuthService,private dialogref : MatDialogRef<AskFileDashboardComponent>,private _snackBar: MatSnackBar ){

      for (let year = this.selectedYear; year >= 2018; year--) {
        this.years.push(String(year-1)  + "-" + String(year));
    };
    this.api_auth.getalluser().subscribe({
      next:(res)=>{
         
          for( let option = 0; option < res.length; option++){
            let opt: string = res[option].email;
            this.options.push(opt);
          }
        console.log(this.options);
      }
    });
  }

  email: any = this.localStorage.getClientEmailITR()
  ngOnInit(): void {
    
    this.file_list = this.formbuilder.group({
      filename         : ['', Validators.required],
      purpose         : ['', Validators.required],
      comments        : [''],
      email           : [''],
      fy              : ['', Validators.required],
      month_quarter   : [''],
      
    }) 
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );

  }
  private _filter(value: string): string[] {
    console.log(value)
    const filterValue = value.toLowerCase();
    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

  async Closingdoc()
  {
    await this.dialogref.close("save");
    await this.file_list.reset();
  }

  async All_Client_Ask(){
    //await new Promise (resolve => {
    if(this.myControl.value != '' && this.file_list.valid){
      
      await new Promise( resolve => {
        this.AskProduct(this.myControl.value);
      resolve("true");}
      );  
      await new Promise( resolve => {
        this.Closingdoc();
        resolve("true");});  
      
    }
    else {
     
      if(this.userArray.length != 0 && this.file_list.valid){

        await new Promise( resolve => {
        for(let index =0; index < this.userArray.length; index ++ ){
          this.AskProduct(this.userArray[index].email)
        }
        resolve("true");});

        await new Promise( resolve => {
          this.Closingdoc();
          resolve("true");}
        ); 
      }
      else{
        this._snackBar.open("Fill the Form Properly", "Sorry!!", {
          duration: 2000,});
      }
    }
    
  //})
    
}


async Email_draft(data:any){
  await new Promise( resolve => {
    this.api.ask_email(data).subscribe({
      next:(res)=>{
        console.log("hi");
        this._snackBar.open(res.Status, "Hurray!!", {
        duration: 2000,});
      },
      error:(err)=>{
        this._snackBar.open(err.error.Status, "Contact Us", {
          duration: 2000,});
      }        
    });
    resolve("true"); })
  }
  
  async AskProduct(email_client: any){
    console.log(this.file_list.value)
    if(this.file_list.valid){
      console.log(email_client)
      this.file_list.controls['email'].setValue(email_client);
      await new Promise( resolve => {
        this.Email_draft(this.file_list.value)
        this.api.post_file_asked(this.file_list.value)
      .subscribe({
        next:(res)=>{this._snackBar.open("Files Asked","OK", {
          duration: 3000,
        });
        
        
        //this.dialogref.close("save")
        },
        error:(err)=>{
          this._snackBar.open(err.error.Status,"Contact Us", {
            duration: 3000,
          });
        }});
        resolve("true"); })
    }
      
    }

    csv_reader() {
      let csvToRowArray = this.csv.split("\n");
        for (let index = 1; index < csvToRowArray.length - 1; index++) {
          let row = csvToRowArray[index].split(",");
          this.userArray.push(new User(row[0] , row[1]));
        }
        console.log(this.userArray);
    }
    fileName = '';
    csv : string = ''
    file : File ;
    public changeListener(event: any){
    const files = event.target.files;
    console.log(files);
    
    if(files && files.length > 0) {
         this.file = files.item(0); 
         let reader: FileReader = new FileReader();
         reader.readAsText(this.file);
         this.fileName = this.file.name;
         reader.onload = (e) => {
            this.csv = reader.result as string;
            console.log(this.csv);
            this.csv_reader()
         }
      }
  }
  
}

export class User{
  email: string;
  name: String;

  constructor(email: string, name: String){
    this.email = email;
    this.name = name;
  }
}


