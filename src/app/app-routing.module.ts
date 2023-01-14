import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { LoginComponent } from './components/login/login/login.component';
import { SignupComponent } from './components/login/signup/signup.component';
import { CredentialsComponent } from './components/home/credentials/credentials.component';
import { FileUploadedComponent } from './components/home/file-uploaded/file-uploaded.component';
import { BillingHistoryComponent } from './components/home/billing-history/billing-history.component';
import { UploadedReturnsComponent } from './components/home/uploaded-returns/uploaded-returns.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'signup', component: SignupComponent },
  {
    path: 'home',
    component: HomeComponent,
    children: [
      {path: '', redirectTo: '/home/file_uploaded', pathMatch: 'full'},
      {path: 'file_uploaded', component: FileUploadedComponent},
      {path: 'credentials', component: CredentialsComponent},
      {path: 'uploaded_returns', component: UploadedReturnsComponent},
      {path: 'billing_history', component: BillingHistoryComponent}
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
