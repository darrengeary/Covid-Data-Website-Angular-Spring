import { TestBed } from '@angular/core/testing';

import { CountryLiveService } from './country-live.service';

describe('CountryLiveService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CountryLiveService = TestBed.get(CountryLiveService);
    expect(service).toBeTruthy();
  });
});
