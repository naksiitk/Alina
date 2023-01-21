import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsUploadedTdsComponent } from './returns-uploaded-tds.component';

describe('ReturnsUploadedTdsComponent', () => {
  let component: ReturnsUploadedTdsComponent;
  let fixture: ComponentFixture<ReturnsUploadedTdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnsUploadedTdsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnsUploadedTdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
