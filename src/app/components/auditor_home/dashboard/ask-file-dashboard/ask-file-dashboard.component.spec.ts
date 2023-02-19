import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskFileDashboardComponent } from './ask-file-dashboard.component';

describe('AskFileDashboardComponent', () => {
  let component: AskFileDashboardComponent;
  let fixture: ComponentFixture<AskFileDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskFileDashboardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskFileDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
