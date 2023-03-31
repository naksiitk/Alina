import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AisScrapZenComponent } from './ais-scrap-zen.component';

describe('AisScrapZenComponent', () => {
  let component: AisScrapZenComponent;
  let fixture: ComponentFixture<AisScrapZenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AisScrapZenComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AisScrapZenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
