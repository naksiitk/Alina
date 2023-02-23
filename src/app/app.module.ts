import { NgModule, isDevMode } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MatSnackBarModule} from '@angular/material/snack-bar'; 
import { MatCardModule } from '@angular/material/card';
import { MatSidenavModule} from '@angular/material/sidenav';
import { LoginComponent } from './components/login/login/login.component';
import { SignupComponent } from './components/login/signup/signup.component';
import { HomeComponent } from './components/home/home/home.component';
import { DialogComponent } from './components/home/dialog/dialog.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog'; 
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input'; 
import {MatSelect, MatSelectModule} from '@angular/material/select'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import { LayoutModule } from '@angular/cdk/layout';
import { MatListModule } from '@angular/material/list';
// import { CredentialsComponent } from './components/home/credentials/credentials.component';
import { FileUploadedComponent } from './components/home/file-uploaded/file-uploaded.component';
import {MatTabsModule} from '@angular/material/tabs';
// import { BillingHistoryComponent } from './components/home/billing-history/billing-history.component';
import { UploadedReturnsComponent } from './components/home/uploaded-returns/uploaded-returns.component';
import { DialogDeleteComponent } from './components/home/dialog-delete/dialog-delete.component';
import { DialogCredentialsComponent } from './components/home/dialog-credentials/dialog-credentials.component';
import {MatSortModule} from '@angular/material/sort';
import { AuditorHomeComponent } from './components/auditor_home/auditor-home/auditor-home.component';
import { ItrComponent } from './components/auditor_home/itr/itr.component';
// import { GstComponent } from './components/auditor_home/gst/gst.component';
// import { TdsComponent } from './components/auditor_home/tds/tds.component';
// import { AuditorCredComponent } from './components/auditor_home/auditor-cred/auditor-cred.component';
// import { AudBilingComponent } from './components/auditor_home/aud-biling/aud-biling.component';
import { DashboardComponent } from './components/auditor_home/dashboard/dashboard.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatBadgeModule} from '@angular/material/badge';
import { ClientTabComponent } from './components/auditor_home/itr/client-tab/client-tab.component';
// import { ClientTabDialogComponent } from './components/auditor_home/itr/client-tab-dialog/client-tab-dialog.component';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
// import { ClientTabGstComponent } from './components/auditor_home/gst/client-tab-gst/client-tab-gst.component';
// import { ClientTabTdsComponent } from './components/auditor_home/tds/client-tab-tds/client-tab-tds.component';
import { FilesUploadedItrComponent } from './components/auditor_home/itr/files-uploaded-itr/files-uploaded-itr.component';
import { ReturnsUploadedItrComponent } from './components/auditor_home/itr/returns-uploaded-itr/returns-uploaded-itr.component';
// import { FilesUploadedGstComponent } from './components/auditor_home/gst/files-uploaded-gst/files-uploaded-gst.component';
// import { ReturnsUploadedGstComponent } from './components/auditor_home/gst/returns-uploaded-gst/returns-uploaded-gst.component';
// import { ReturnsUploadedTdsComponent } from './components/auditor_home/tds/returns-uploaded-tds/returns-uploaded-tds.component';
// import { FilesUploadedTdsComponent } from './components/auditor_home/tds/files-uploaded-tds/files-uploaded-tds.component';
// import { ClientTabTdsComponent } from '.components/auditor_home/tds/client-tab-tds/client-tab-tds.component';
// import { ClientTabGstComponent } from '.components/auditor_home/gst/client-tab-gst/client-tab-gst.component'; 
import {MatStepperModule} from '@angular/material/stepper'; 
import { NgOtpInputModule } from 'ng-otp-input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { AskFileItrComponent } from './components/auditor_home/itr/ask-file-itr/ask-file-itr.component';
import { AskDialogComponent } from './components/auditor_home/ask-dialog/ask-dialog.component';
import { AskFileComponent } from './components/home/uploaded-returns/ask-file/ask-file.component'; 
import {MatExpansionModule} from '@angular/material/expansion';
import { FilesShowDialogComponent } from './components/home/files-show-dialog/files-show-dialog.component'; 
import { NgxExtendedPdfViewerModule } from 'ngx-extended-pdf-viewer';
import { FilePreviewDialogComponent } from './components/home/file-preview-dialog/file-preview-dialog.component';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { FileDownloadService } from './services/file-download.service';
import { ClientDocListTableComponent } from './components/auditor_home/dashboard/client-doc-list-table/client-doc-list-table.component';
import { AskFileDashboardComponent } from './components/auditor_home/dashboard/ask-file-dashboard/ask-file-dashboard.component';
import { UploadFileDashboardComponent } from './components/auditor_home/dashboard/upload-file-dashboard/upload-file-dashboard.component'; 
import {MatGridListModule} from '@angular/material/grid-list';
import { AddClientComponent } from './components/auditor_home/dashboard/add-client/add-client.component';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { ForgotPasswordComponent } from './components/login/forgot-password/forgot-password.component'; 
import { OneTimeFileUploadComponent } from './components/login/one-time-file-upload/one-time-file-upload.component';
import {MatMenuModule} from '@angular/material/menu';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ContactUsComponent } from './components/home/contact-us/contact-us.component';
import { LoaderComponent } from './components/loader/loader.component'; 
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
// import { LoaderInterceptor } from './services/loader.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    SignupComponent,
    HomeComponent,
    DialogComponent,
    UploadedReturnsComponent,
    // CredentialsComponent,
    FileUploadedComponent,
    // BillingHistoryComponent,
    AuditorHomeComponent,
    ItrComponent,
    // GstComponent,
    // TdsComponent,
    // AuditorCredComponent,
    // AudBilingComponent,
    DashboardComponent,
    DialogDeleteComponent,
    ClientTabComponent,
    // ClientTabGstComponent,
    // ClientTabTdsComponent,
    FilesUploadedItrComponent,
    ReturnsUploadedItrComponent,
    // FilesUploadedGstComponent,
    // ReturnsUploadedGstComponent,
    // ReturnsUploadedTdsComponent,
    // FilesUploadedTdsComponent,
    DialogCredentialsComponent,
    AskFileItrComponent,
    AskDialogComponent,
    AskFileComponent,
    FilesShowDialogComponent,
    ClientDocListTableComponent,
    AskFileDashboardComponent,
    UploadFileDashboardComponent,
    AddClientComponent,
    ForgotPasswordComponent,
    OneTimeFileUploadComponent,
    FilePreviewDialogComponent,
    ContactUsComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatCardModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSidenavModule,
    LayoutModule,
    MatListModule,
    MatTabsModule,
    FontAwesomeModule,
    MatBadgeModule,
    MatSlideToggleModule,
    MatStepperModule,
    NgOtpInputModule,
    MatDatepickerModule,
    NgbModule,
    MatExpansionModule,
    MatSnackBarModule, 
    MatSortModule,
    MatGridListModule, 
    MatAutocompleteModule,
    NgxExtendedPdfViewerModule,
    MatMenuModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    MatProgressSpinnerModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: HttpInterceptorService, multi: true},
    FileDownloadService,
    // {provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true,},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { 
  
}
