import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupPageAuditorComponent } from './signup-page-auditor.component';

describe('SignupPageAuditorComponent', () => {
  let component: SignupPageAuditorComponent;
  let fixture: ComponentFixture<SignupPageAuditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupPageAuditorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignupPageAuditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
