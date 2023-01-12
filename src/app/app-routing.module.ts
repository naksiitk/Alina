import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadedReturnsComponent } from './components/home/uploaded_returns/uploaded-returns/uploaded-returns.component';
import { HomeComponent } from './components/home/home/home.component';
import { LoginComponent } from './components/login/login/login.component';
import { SignupComponent } from './components/login/signup/signup.component';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'home', component: HomeComponent},
  {path: 'signup', component: SignupComponent },
  {path: 'uploaded_returns', component: UploadedReturnsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
