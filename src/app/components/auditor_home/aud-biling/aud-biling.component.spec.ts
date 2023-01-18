import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudBilingComponent } from './aud-biling.component';

describe('AudBilingComponent', () => {
  let component: AudBilingComponent;
  let fixture: ComponentFixture<AudBilingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AudBilingComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AudBilingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
