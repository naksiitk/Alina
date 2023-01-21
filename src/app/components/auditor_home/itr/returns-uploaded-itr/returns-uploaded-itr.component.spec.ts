import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnsUploadedItrComponent } from './returns-uploaded-itr.component';

describe('ReturnsUploadedItrComponent', () => {
  let component: ReturnsUploadedItrComponent;
  let fixture: ComponentFixture<ReturnsUploadedItrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReturnsUploadedItrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReturnsUploadedItrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
