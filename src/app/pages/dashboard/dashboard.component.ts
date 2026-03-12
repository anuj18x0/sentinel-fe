import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { DashboardStats, Incident, ApiEndpoint } from '../../models/interfaces';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit, OnDestroy {
  stats: DashboardStats | null = null;
  apis: ApiEndpoint[] = [];
  incidents: Incident[] = [];
  loading = true;
  private chart: Chart | null = null;
  private refreshInterval: any;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
    this.refreshInterval = setInterval(() => this.loadData(), 30000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) clearInterval(this.refreshInterval);
    if (this.chart) this.chart.destroy();
  }

  loadData() {
    this.apiService.getDashboardStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });

    this.apiService.getApis().subscribe({
      next: (apis) => {
        this.apis = apis;
        this.cdr.detectChanges();
        this.loadChart();
      },
    });

    this.apiService.getIncidents({ unresolvedOnly: true }).subscribe({
      next: (incidents) => {
        this.incidents = incidents.slice(0, 5);
        this.cdr.detectChanges();
      },
    });
  }

  loadChart() {
    if (this.apis.length === 0) return;

    this.apiService.getLatencyOverview(6).subscribe({
      next: (data) => {
        if (this.chart) this.chart.destroy();

        const canvas = document.getElementById('latencyChart') as HTMLCanvasElement;
        if (!canvas) return;

        const grouped: { [key: string]: { timestamps: string[]; values: number[] } } = {};
        data.forEach((d: any) => {
          if (!grouped[d.name]) grouped[d.name] = { timestamps: [], values: [] };
          grouped[d.name].timestamps.push(new Date(d.timestamp).toLocaleTimeString());
          grouped[d.name].values.push(d.responseTime);
        });

        const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#a78bfa'];
        const datasets = Object.keys(grouped).map((name, i) => ({
          label: name,
          data: grouped[name].values,
          borderColor: colors[i % colors.length],
          backgroundColor: colors[i % colors.length] + '15',
          fill: true,
          tension: 0.4,
          borderWidth: 2,
          pointRadius: 0,
          pointHoverRadius: 4,
        }));

        const maxLabels = Math.max(...Object.values(grouped).map((g) => g.timestamps.length));
        const labels = Object.values(grouped).find((g) => g.timestamps.length === maxLabels)?.timestamps || [];

        this.chart = new Chart(canvas, {
          type: 'line',
          data: { labels, datasets },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: { intersect: false, mode: 'index' },
            plugins: {
              legend: {
                labels: { color: '#94a3b8', font: { family: 'Inter', size: 11 }, boxWidth: 12 },
              },
            },
            scales: {
              x: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 }, maxTicksLimit: 10 } },
              y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#64748b', font: { size: 10 } }, title: { display: true, text: 'ms', color: '#64748b' } },
            },
          },
        });
      },
    });
  }

  getSeverityClass(severity: string): string {
    return `badge badge-${severity}`;
  }

  getStatusClass(status: string): string {
    return `badge badge-${status}`;
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }
}
