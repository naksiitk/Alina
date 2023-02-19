import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OneTimeFileUploadComponent } from './one-time-file-upload.component';

describe('OneTimeFileUploadComponent', () => {
  let component: OneTimeFileUploadComponent;
  let fixture: ComponentFixture<OneTimeFileUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ OneTimeFileUploadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OneTimeFileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
