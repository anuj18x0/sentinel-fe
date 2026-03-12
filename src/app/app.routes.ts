import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
  },
  {
    path: 'apis',
    loadComponent: () =>
      import('./pages/api-management/api-management.component').then((m) => m.ApiManagementComponent),
  },
  {
    path: 'logs',
    loadComponent: () =>
      import('./pages/monitoring-logs/monitoring-logs.component').then((m) => m.MonitoringLogsComponent),
  },
  {
    path: 'insights',
    loadComponent: () =>
      import('./pages/ai-insights/ai-insights.component').then((m) => m.AiInsightsComponent),
  },
  {
    path: 'assistant',
    loadComponent: () =>
      import('./pages/devops-assistant/devops-assistant.component').then((m) => m.DevopsAssistantComponent),
  },
  { path: '**', redirectTo: 'dashboard' },
];
