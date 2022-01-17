import { TestBed } from '@angular/core/testing';
import { BaseModel } from 'src/app/models/base-model';

import { CrudService } from './crud.service';

describe('CrudService', () => {
  let service: CrudService<BaseModel>;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CrudService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
