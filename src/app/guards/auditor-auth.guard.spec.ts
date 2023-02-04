import { TestBed } from '@angular/core/testing';

import { AuditorAuthGuard } from './auditor-auth.guard';

describe('AuditorAuthGuard', () => {
  let guard: AuditorAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuditorAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
