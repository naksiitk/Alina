import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilesShowDialogComponent } from './files-show-dialog.component';

describe('FilesShowDialogComponent', () => {
  let component: FilesShowDialogComponent;
  let fixture: ComponentFixture<FilesShowDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilesShowDialogComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FilesShowDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
