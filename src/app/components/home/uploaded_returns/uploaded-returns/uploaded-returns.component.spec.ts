import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadedReturnsComponent } from './uploaded-returns.component';

describe('UploadedReturnsComponent', () => {
  let component: UploadedReturnsComponent;
  let fixture: ComponentFixture<UploadedReturnsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UploadedReturnsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UploadedReturnsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
