import { TestBed } from '@angular/core/testing';

import { AuditorUnAuthGuard } from './auditor-un-auth.guard';

describe('AuditorUnAuthGuard', () => {
  let guard: AuditorUnAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuditorUnAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
