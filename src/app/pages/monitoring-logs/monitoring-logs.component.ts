import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { ApiLog, ApiEndpoint } from '../../models/interfaces';

@Component({
  selector: 'app-monitoring-logs',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './monitoring-logs.component.html',
  styleUrl: './monitoring-logs.component.css',
})
export class MonitoringLogsComponent implements OnInit {
  logs: ApiLog[] = [];
  apis: ApiEndpoint[] = [];
  loading = true;

  filters = {
    apiId: null as number | null,
    anomalyOnly: false,
    page: 1,
    pageSize: 30,
  };

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.apiService.getApis().subscribe({
      next: (apis) => {
        this.apis = apis;
        this.cdr.detectChanges();
      },
    });
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;
    this.apiService
      .getLogs({
        apiId: this.filters.apiId ?? undefined,
        anomalyOnly: this.filters.anomalyOnly || undefined,
        page: this.filters.page,
        pageSize: this.filters.pageSize,
      })
      .subscribe({
        next: (logs) => {
          this.logs = logs;
          this.loading = false;
          this.cdr.detectChanges();
        },
        error: () => {
          this.loading = false;
          this.cdr.detectChanges();
        },
      });
  }

  applyFilter() {
    this.filters.page = 1;
    this.loadLogs();
  }

  nextPage() {
    this.filters.page++;
    this.loadLogs();
  }

  prevPage() {
    if (this.filters.page > 1) {
      this.filters.page--;
      this.loadLogs();
    }
  }

  getStatusBadge(statusCode: number): string {
    if (statusCode >= 200 && statusCode < 300) return 'badge badge-healthy';
    if (statusCode >= 400 && statusCode < 500) return 'badge badge-high';
    if (statusCode >= 500) return 'badge badge-critical';
    if (statusCode === 0) return 'badge badge-critical';
    return 'badge badge-unknown';
  }

  getApiName(log: ApiLog): string {
    if (log.api?.name) return log.api.name;
    const api = this.apis.find((a) => a.id === log.apiId);
    return api?.name || `API #${log.apiId}`;
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }

  formatLatency(ms: number): string {
    return ms < 1000 ? `${ms.toFixed(0)}ms` : `${(ms / 1000).toFixed(2)}s`;
  }
}
