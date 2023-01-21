import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesUploadedTdsComponent } from './files-uploaded-tds.component';

describe('FilesUploadedTdsComponent', () => {
  let component: FilesUploadedTdsComponent;
  let fixture: ComponentFixture<FilesUploadedTdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesUploadedTdsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesUploadedTdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
