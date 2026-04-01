import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobService {
  private apiUrl = 'https://script.google.com/macros/s/AKfycbweu1rWmQkyxLQ-3VvYA-brQeel23cyC6NjFWaIg6fiZ5A9Bu-VWFVp9dsq6Cn04Dk/exec';

  constructor(private http: HttpClient) { }

  getJobs(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}