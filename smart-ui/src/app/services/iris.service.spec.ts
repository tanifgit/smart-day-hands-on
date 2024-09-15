import { TestBed } from '@angular/core/testing';

import { IrisService } from './iris.service';

describe('IrisService', () => {
  let service: IrisService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IrisService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
