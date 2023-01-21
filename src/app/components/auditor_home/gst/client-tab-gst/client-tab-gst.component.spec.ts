import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTabGstComponent } from './client-tab-gst.component';

describe('ClientTabGstComponent', () => {
  let component: ClientTabGstComponent;
  let fixture: ComponentFixture<ClientTabGstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientTabGstComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientTabGstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
