import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesUploadedGstComponent } from './files-uploaded-gst.component';

describe('FilesUploadedGstComponent', () => {
  let component: FilesUploadedGstComponent;
  let fixture: ComponentFixture<FilesUploadedGstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesUploadedGstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesUploadedGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
