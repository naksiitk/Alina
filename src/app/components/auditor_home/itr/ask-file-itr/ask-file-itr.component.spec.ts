import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AskFileItrComponent } from './ask-file-itr.component';

describe('AskFileItrComponent', () => {
  let component: AskFileItrComponent;
  let fixture: ComponentFixture<AskFileItrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AskFileItrComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AskFileItrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
