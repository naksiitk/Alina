import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadFileDashboardComponent } from './upload-file-dashboard.component';

describe('UploadFileDashboardComponent', () => {
  let component: UploadFileDashboardComponent;
  let fixture: ComponentFixture<UploadFileDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadFileDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadFileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
