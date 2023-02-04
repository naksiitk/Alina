import { TestBed } from '@angular/core/testing';

import { ClientUnAuthGuard } from './client-un-auth.guard';

describe('ClientUnAuthGuard', () => {
  let guard: ClientUnAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ClientUnAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
