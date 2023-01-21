import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsUploadedGstComponent } from './returns-uploaded-gst.component';

describe('ReturnsUploadedGstComponent', () => {
  let component: ReturnsUploadedGstComponent;
  let fixture: ComponentFixture<ReturnsUploadedGstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnsUploadedGstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnsUploadedGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
