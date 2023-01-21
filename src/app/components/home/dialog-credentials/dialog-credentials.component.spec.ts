import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogCredentialsComponent } from './dialog-credentials.component';

describe('DialogCredentialsComponent', () => {
  let component: DialogCredentialsComponent;
  let fixture: ComponentFixture<DialogCredentialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogCredentialsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DialogCredentialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
