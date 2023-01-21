import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesUploadedItrComponent } from './files-uploaded-itr.component';

describe('FilesUploadedItrComponent', () => {
  let component: FilesUploadedItrComponent;
  let fixture: ComponentFixture<FilesUploadedItrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesUploadedItrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesUploadedItrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
