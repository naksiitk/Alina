import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CredentialClientComponent } from './credential-client.component';

describe('CredentialClientComponent', () => {
  let component: CredentialClientComponent;
  let fixture: ComponentFixture<CredentialClientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CredentialClientComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CredentialClientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
