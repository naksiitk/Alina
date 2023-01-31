import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskFileComponent } from './ask-file.component';

describe('AskFileComponent', () => {
  let component: AskFileComponent;
  let fixture: ComponentFixture<AskFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
