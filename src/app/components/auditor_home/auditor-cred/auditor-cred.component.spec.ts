import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuditorCredComponent } from './auditor-cred.component';

describe('AuditorCredComponent', () => {
  let component: AuditorCredComponent;
  let fixture: ComponentFixture<AuditorCredComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuditorCredComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuditorCredComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
