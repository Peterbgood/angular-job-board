import { Component, signal, inject, OnInit, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex h-screen bg-[#f8fafc] font-sans text-slate-900 overflow-hidden">
      
      <aside class="w-72 bg-white border-r border-slate-200 p-8 flex flex-col hidden lg:flex">
        <div class="mb-12">
          <div class="flex items-center gap-2 mb-1">
            <div class="w-3 h-3 bg-indigo-600 rounded-full animate-pulse"></div>
            <span class="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Live System</span>
          </div>
          <h1 class="text-3xl font-black text-indigo-950 tracking-tighter leading-none italic">PIPELINE.OS</h1>
        </div>

        <nav class="space-y-8 flex-1">
          <div>
            <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Pipeline Metrics</h3>
            <div class="grid gap-3">
              <div class="bg-indigo-50 p-4 rounded-2xl">
                <p class="text-[10px] font-bold text-indigo-400 uppercase">Total Opportunities</p>
                <p class="text-2xl font-black text-indigo-900">{{ jobs().length }}</p>
              </div>
              <div class="bg-emerald-50 p-4 rounded-2xl">
                <p class="text-[10px] font-bold text-emerald-500 uppercase">Active Links</p>
                <p class="text-2xl font-black text-emerald-900">{{ activeLinks() }}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-4">Quick Filters</h3>
            <ul class="space-y-2 text-xs font-bold text-slate-500">
              <li class="flex items-center justify-between p-2 bg-slate-50 rounded-lg text-indigo-600">
                <span>All Roles</span>
                <span class="opacity-50">/</span>
              </li>
              <li class="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-not-allowed">
                <span>Remote Only</span>
                <span class="w-2 h-2 rounded-full bg-slate-200"></span>
              </li>
              <li class="flex items-center justify-between p-2 hover:bg-slate-50 rounded-lg cursor-not-allowed">
                <span>High Salary</span>
                <span class="w-2 h-2 rounded-full bg-slate-200"></span>
              </li>
            </ul>
          </div>
        </nav>

        <div class="pt-6 border-t border-slate-100">
          <p class="text-[9px] font-medium text-slate-400 leading-relaxed uppercase tracking-tighter">
            Cloud-synced Ledger <br> Last Updated: {{ lastUpdated }}
          </p>
        </div>
      </aside>

      <main class="flex-1 overflow-y-auto custom-scrollbar">
        <header class="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-200 px-10 py-6 flex justify-between items-center">
          <div class="flex items-center gap-4">
             <div class="h-8 w-[2px] bg-indigo-600 hidden md:block"></div>
             <h2 class="text-sm font-black uppercase tracking-widest text-slate-500">Opportunity Ledger v4.0</h2>
          </div>
          <div class="flex gap-3">
             <div class="h-10 w-10 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg">📁</div>
             <div class="h-10 px-4 rounded-full bg-slate-900 text-white flex items-center text-[10px] font-black uppercase tracking-widest">User: PG_DEV</div>
          </div>
        </header>

        <div class="p-10">
          @if (loading()) {
            <div class="flex flex-col items-center justify-center h-[60vh] gap-4">
               <div class="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">Decrypting Data...</p>
            </div>
          } @else {
            <div class="grid gap-4">
              @for (job of jobs(); track job) {
                <div class="bg-white border border-slate-200 p-6 rounded-3xl hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 transition-all flex items-center gap-6 group">
                  <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-50 transition-colors">
                    {{ job.company.charAt(0) }}
                  </div>
                  
                  <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                      <a [href]="job.url" target="_blank" class="text-xl font-black text-slate-900 hover:text-indigo-600 transition-colors">
                        {{ job.title }}
                      </a>
                      <span class="text-[8px] font-black px-2 py-0.5 border border-slate-200 text-slate-400 rounded-md uppercase tracking-tighter">{{ job.type }}</span>
                    </div>
                    <div class="flex items-center gap-4 text-[11px] font-bold text-slate-400 uppercase tracking-tight">
                      <span class="text-indigo-600 font-black">{{ job.company }}</span>
                      <span>•</span>
                      <span>{{ job.location }}</span>
                      <span>•</span>
                      <span class="text-emerald-500">{{ job.salary }}</span>
                    </div>
                  </div>

                  <div class="text-right">
                    <span class="inline-block px-3 py-1 bg-slate-900 text-white text-[9px] font-black uppercase rounded-lg tracking-widest mb-2 shadow-lg shadow-slate-200">
                      {{ job.status }}
                    </span>
                    <p class="text-[9px] font-bold text-slate-300 uppercase tracking-tighter">Entry Ref: #{{ job.company.substring(0,3) }}-{{ $index }}</p>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </main>

      <aside class="w-80 bg-[#f1f5f9] p-8 hidden xl:flex flex-col border-l border-slate-200">
        <h3 class="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-6">Activity Monitor</h3>
        
        <div class="space-y-6">
          @for (item of [1,2,3]; track item) {
            <div class="relative pl-6 border-l-2 border-slate-200 pb-2">
              <div class="absolute -left-[5px] top-0 w-2 h-2 bg-indigo-500 rounded-full"></div>
              <p class="text-[10px] font-black text-slate-900 uppercase tracking-tighter">System Pulse</p>
              <p class="text-[11px] text-slate-500 leading-tight">Syncing node_{{item}} with Google Sheets API successfully.</p>
              <p class="text-[9px] font-bold text-slate-300 mt-1 uppercase">Just now</p>
            </div>
          }
        </div>

        <div class="mt-auto bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
           <h4 class="text-xs font-black text-slate-900 mb-2 italic">Quick Note</h4>
           <p class="text-[11px] text-slate-500 leading-relaxed font-medium">This pipeline updates in real-time from the master deployment sheet. Hover over entries to reveal deep-links.</p>
        </div>
      </aside>

    </div>
  `
})
export class AppComponent implements OnInit {
  private http = inject(HttpClient);
  private apiUrl = 'https://script.google.com/macros/s/AKfycbweu1rWmQkyxLQ-3VvYA-brQeel23cyC6NjFWaIg6fiZ5A9Bu-VWFVp9dsq6Cn04Dk/exec';
  
  jobs = signal<any[]>([]);
  loading = signal(true);
  lastUpdated = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Computed signals for sidebar busy-ness
  activeLinks = computed(() => this.jobs().filter(j => j.url !== '#').length);

  ngOnInit() {
    this.http.jsonp<any[]>(this.apiUrl, 'callback').subscribe({
      next: (rawData) => {
        const mappedData = rawData.map(item => ({
          title: item.jobTitle || 'Untitled Position',
          company: item.company || 'Unknown Company',
          location: item.locationType || 'Remote',
          type: item.employmentType || 'FT',
          salary: item.salaryRange || 'TBD',
          status: item.description || 'Active', 
          url: item.applyUrl || '#'
        }));

        this.jobs.set(mappedData);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }
}