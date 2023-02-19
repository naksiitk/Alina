import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home/home.component';
import { LoginComponent } from './components/login/login/login.component';
import { SignupComponent } from './components/login/signup/signup.component';
import { CredentialsComponent } from './components/home/credentials/credentials.component';
import { FileUploadedComponent } from './components/home/file-uploaded/file-uploaded.component';
import { BillingHistoryComponent } from './components/home/billing-history/billing-history.component';
import { UploadedReturnsComponent } from './components/home/uploaded-returns/uploaded-returns.component';
import { AuditorHomeComponent } from './components/auditor_home/auditor-home/auditor-home.component';
import { DashboardComponent } from './components/auditor_home/dashboard/dashboard.component';
import { ItrComponent } from './components/auditor_home/itr/itr.component';
import { TdsComponent } from './components/auditor_home/tds/tds.component';
import { AuditorCredComponent } from './components/auditor_home/auditor-cred/auditor-cred.component';
import { AudBilingComponent } from './components/auditor_home/aud-biling/aud-biling.component';
import { GstComponent } from './components/auditor_home/gst/gst.component';
import { ClientTabComponent } from './components/auditor_home/itr/client-tab/client-tab.component';
import { ClientTabTdsComponent } from './components/auditor_home/tds/client-tab-tds/client-tab-tds.component';
import { ClientTabGstComponent } from './components/auditor_home/gst/client-tab-gst/client-tab-gst.component';
import { ClientUnAuthGuard } from './guards/client-un-auth.guard';
import { AuditorUnAuthGuard } from './guards/auditor-un-auth.guard';
import { ClientAuthGuard } from './guards/client-auth.guard';
import { AuditorAuthGuard } from './guards/auditor-auth.guard';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component';
import { OneTimeFileUploadComponent } from './components/login/one-time-file-upload/one-time-file-upload.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [ClientUnAuthGuard,AuditorUnAuthGuard] },
  {path: 'signup', component: SignupComponent, canActivate: [ClientUnAuthGuard,AuditorUnAuthGuard] },
  {path: 'forgot_password', component: ForgotPasswordComponent, canActivate: [ClientUnAuthGuard,AuditorUnAuthGuard] },
  {path: 'one_time_upload', component: OneTimeFileUploadComponent, canActivate: [ClientUnAuthGuard,AuditorUnAuthGuard] },
  {
    path: 'home',
    component: HomeComponent,
    canActivate: [ClientAuthGuard,AuditorUnAuthGuard],
    children: [
      {path: '', redirectTo: '/home/file_uploaded', pathMatch: 'full'},
      {path: 'file_uploaded', component: FileUploadedComponent},
      {path: 'credentials', component: CredentialsComponent},
      {path: 'uploaded_returns', component: UploadedReturnsComponent},
      {path: 'billing_history', component: BillingHistoryComponent}
    ]
  },
  {
    path: 'auditor', 
    component: AuditorHomeComponent, 
    canActivate: [AuditorAuthGuard,ClientUnAuthGuard],
    children: [
      {path: '', redirectTo: '/auditor/dashboard', pathMatch: 'full'},
      {path: 'dashboard', component: DashboardComponent},
      {path: 'itr', component: ItrComponent},
      {path: 'gst', component: GstComponent},
      {path: 'tds', component: TdsComponent},
      {path: 'credentials', component: AuditorCredComponent},
      {path: 'billing_history', component: AudBilingComponent},
      {path: 'itr/client_tab', component: ClientTabComponent },
      {path: 'gst/client_tab', component: ClientTabGstComponent },
      {path: 'tds/client_tab', component: ClientTabTdsComponent }
    ]
  },
  {path: '**', redirectTo: '/login', pathMatch: 'full'}
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
