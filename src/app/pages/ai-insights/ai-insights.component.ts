import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiService } from '../../services/api.service';
import { AnomalyResponse, FailurePrediction, Incident } from '../../models/interfaces';

@Component({
  selector: 'app-ai-insights',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ai-insights.component.html',
  styleUrl: './ai-insights.component.css',
})
export class AiInsightsComponent implements OnInit {
  anomalies: AnomalyResponse[] = [];
  predictions: FailurePrediction[] = [];
  incidents: Incident[] = [];
  loading = true;

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.apiService.getAnomalies(48).subscribe({
      next: (data) => {
        this.anomalies = data;
        this.cdr.detectChanges();
      },
    });

    this.apiService.getFailurePredictions().subscribe({
      next: (data) => {
        this.predictions = data;
        this.cdr.detectChanges();
      },
    });

    this.apiService.getIncidents({}).subscribe({
      next: (data) => {
        this.incidents = data;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  resolveIncident(id: number) {
    this.apiService.resolveIncident(id).subscribe({
      next: () => this.loadData(),
    });
  }

  getSeverityClass(severity: string): string {
    return `badge badge-${severity}`;
  }

  getRiskClass(riskLevel: string): string {
    return `badge badge-${riskLevel}`;
  }

  formatTime(timestamp: string): string {
    return new Date(timestamp).toLocaleString();
  }

  getProbabilityWidth(probability: number): string {
    return `${probability * 100}%`;
  }

  getProbabilityColor(probability: number): string {
    if (probability > 0.7) return 'var(--accent-danger)';
    if (probability > 0.4) return 'var(--accent-warning)';
    if (probability > 0.2) return 'var(--accent-info)';
    return 'var(--accent-success)';
  }
}
