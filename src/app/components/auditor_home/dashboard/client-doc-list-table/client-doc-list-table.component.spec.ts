import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDocListTableComponent } from './client-doc-list-table.component';

describe('ClientDocListTableComponent', () => {
  let component: ClientDocListTableComponent;
  let fixture: ComponentFixture<ClientDocListTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientDocListTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDocListTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
