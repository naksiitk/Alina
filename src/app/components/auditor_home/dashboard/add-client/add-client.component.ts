import { Component, OnInit, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-add-client',
  templateUrl: './add-client.component.html',
  styleUrls: ['./add-client.component.css']
})


export class AddClientComponent {

  public userArray: User[] = [];

  

  constructor(private localStorage: LocalStorageService ,private formbuilder : FormBuilder, private api : ApiService,
    private api_auth : AuthService, private _snackBar: MatSnackBar, private dialogref : MatDialogRef<AddClientComponent>,){}
  client_list !: FormGroup;
  ngOnInit(): void {
    
    this.client_list = this.formbuilder.group({
      clientemail         : [[''],  Validators.email],
      clientname         : [['']] 
    }) 
  }
  getErrorMessage() {
    if (this.client_list.hasError('required')) {
      return 'You must enter a value';
    }
    return this.client_list.hasError('email') ? 'Not a valid email' : '';
  }



  Onboard_Client(){
    console.log(this.client_list.value)
    if(this.client_list.valid){
      this.api.onboard(this.client_list.value.clientemail).subscribe({
        next:(res)=>{this._snackBar.open(res.Status, "Hurray!!", {
          duration: 2000,});
        this.client_list.reset();
        this.dialogref.close("save");
        },
        error:(err)=>{
          this._snackBar.open(err.error.Status, "Contact Us", {
            duration: 2000,});
        }        
      });
    }
    else {
      if(this.userArray != null){
        for(let index =0; index < this.userArray.length; index ++ ){
          console.log(this.userArray[index].email)
          this.api.onboard(this.userArray[index].email).subscribe({
            next:(res)=>{this._snackBar.open(res.Status, "Hurray!!", {
              duration: 2000,});
            this.client_list.reset();
            this.dialogref.close("save");
            },
            error:(err)=>{
              this._snackBar.open(err.error.Status, "Contact Us", {
                duration: 2000,});
            }        
          });
        }
      }
      else{
        this._snackBar.open("Fill the Form", "Sorry!!", {
          duration: 2000,});
      }
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
