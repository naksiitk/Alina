import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientAcceptanceComponent } from './client-acceptance.component';

describe('ClientAcceptanceComponent', () => {
  let component: ClientAcceptanceComponent;
  let fixture: ComponentFixture<ClientAcceptanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientAcceptanceComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
