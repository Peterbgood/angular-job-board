import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { JobService } from './job'; // Changed 'Job' to 'JobService'

describe('JobService', () => {
  let service: JobService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient()]
    });
    service = TestBed.inject(JobService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});