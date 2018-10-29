import { TestBed, inject } from '@angular/core/testing';

import { XhrserviceService } from './xhrservice.service';

describe('XhrserviceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [XhrserviceService]
    });
  });

  it('should be created', inject([XhrserviceService], (service: XhrserviceService) => {
    expect(service).toBeTruthy();
  }));
});
