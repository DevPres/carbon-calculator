import { TestBed } from '@angular/core/testing';

import { EstimatesService } from './estimates.service';

describe('EstimatesService', () => {
  let service: EstimatesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EstimatesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
