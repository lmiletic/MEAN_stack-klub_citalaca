import { TestBed } from '@angular/core/testing';

import { KorisnickiService } from './korisnicki.service';

describe('KorisnickiService', () => {
  let service: KorisnickiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(KorisnickiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
