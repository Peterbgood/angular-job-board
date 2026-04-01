import { Component, signal, inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="p-6 max-w-5xl mx-auto font-sans bg-gray-50 min-h-screen">
      <header class="mb-10 text-center">
        <h1 class="text-5xl font-black text-indigo-900 tracking-tight">Job Board</h1>
        <p class="text-gray-500 mt-3 text-lg">Current Pipeline Status</p>
      </header>

      @if (loading()) {
        <div class="flex flex-col items-center gap-4 p-20">
          <div class="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
          <p class="text-indigo-900 font-bold animate-pulse">Syncing with Google Sheets...</p>
        </div>
      } @else {
        <div class="grid gap-4">
          @for (job of jobs(); track job) {
            <div class="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row md:items-center justify-between group">
              <div class="flex-1">
                <div class="flex items-center gap-3 mb-1">
                  <h2 class="text-2xl font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                    {{ job.title }}
                  </h2>
                  <span class="text-xs font-bold px-2 py-1 bg-gray-100 text-gray-600 rounded uppercase tracking-widest">
                    {{ job.type }}
                  </span>
                </div>
                <p class="text-indigo-600 text-xl font-semibold">{{ job.company }}</p>
                
                <div class="flex flex-wrap gap-5 mt-4 text-gray-500 text-sm font-medium">
                  <div class="flex items-center gap-1.5">
                    <span class="text-lg">📍</span> {{ job.location }}
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-lg">💰</span> {{ job.salary }}
                  </div>
                  <div class="flex items-center gap-1.5">
                    <span class="text-lg">📋</span> {{ job.status }}
                  </div>
                </div>
              </div>
              
              <div class="mt-4 md:mt-0 flex gap-2">
                <a [href]="job.url" target="_blank" 
                   class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-bold transition-colors text-sm shadow-sm">
                  View Details
                </a>
              </div>
            </div>
          } @empty {
            <div class="text-center p-20 bg-white rounded-3xl border-2 border-dashed border-gray-200">
              <p class="text-gray-400 text-xl">No job entries found in the sheet.</p>
            </div>
          }
        </div>
      }
    </div>
  `
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'https://script.google.com/macros/s/AKfycbweu1rWmQkyxLQ-3VvYA-brQeel23cyC6NjFWaIg6fiZ5A9Bu-VWFVp9dsq6Cn04Dk/exec';
  
  jobs = signal<any[]>([]);
  loading = signal(true);

  ngOnInit() {
    this.http.jsonp<any[]>(this.apiUrl, 'callback').subscribe({
      next: (rawData) => {
        console.log('Sheet Data:', rawData);
        
        // MAPPING: These keys now match your image headers exactly
        const mappedData = rawData.map(item => ({
          title: item.jobTitle || 'Untitled Position',
          company: item.company || 'Unknown Company',
          location: item.locationType || 'Remote',
          type: item.employmentType || 'Full-time',
          salary: item.salaryRange || 'TBD',
          status: item.description || 'Open', // Using 'description' column for the status label
          url: item.applyUrl || '#'
        }));

        this.jobs.set(mappedData);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Connection failed:', err);
        this.loading.set(false);
      }
    });
  }
}