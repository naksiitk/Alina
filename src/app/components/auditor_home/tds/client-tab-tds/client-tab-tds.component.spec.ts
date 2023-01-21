import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientTabTdsComponent } from './client-tab-tds.component';

describe('ClientTabTdsComponent', () => {
  let component: ClientTabTdsComponent;
  let fixture: ComponentFixture<ClientTabTdsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientTabTdsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientTabTdsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
