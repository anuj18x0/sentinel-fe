import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ApiEndpoint,
  CreateApiRequest,
  UpdateApiRequest,
  ApiLog,
  Incident,
  DashboardStats,
  AiInsightResponse,
  AnomalyResponse,
  FailurePrediction,
} from '../models/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private baseUrl = 'http://localhost:5000/api';

  constructor(private http: HttpClient) {}

  // ── APIs ──────────────────────────────────────────────

  getApis(): Observable<ApiEndpoint[]> {
    return this.http.get<ApiEndpoint[]>(`${this.baseUrl}/apis`);
  }

  getApi(id: number): Observable<ApiEndpoint> {
    return this.http.get<ApiEndpoint>(`${this.baseUrl}/apis/${id}`);
  }

  createApi(request: CreateApiRequest): Observable<ApiEndpoint> {
    return this.http.post<ApiEndpoint>(`${this.baseUrl}/apis`, request);
  }

  updateApi(id: number, request: UpdateApiRequest): Observable<ApiEndpoint> {
    return this.http.put<ApiEndpoint>(`${this.baseUrl}/apis/${id}`, request);
  }

  deleteApi(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/apis/${id}`);
  }

  getDashboardStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.baseUrl}/apis/dashboard`);
  }

  // ── Logs ──────────────────────────────────────────────

  getLogs(params?: {
    apiId?: number;
    anomalyOnly?: boolean;
    from?: string;
    to?: string;
    page?: number;
    pageSize?: number;
  }): Observable<ApiLog[]> {
    let httpParams = new HttpParams();
    if (params?.apiId) httpParams = httpParams.set('apiId', params.apiId.toString());
    if (params?.anomalyOnly) httpParams = httpParams.set('anomalyOnly', 'true');
    if (params?.from) httpParams = httpParams.set('from', params.from);
    if (params?.to) httpParams = httpParams.set('to', params.to);
    if (params?.page) httpParams = httpParams.set('page', params.page.toString());
    if (params?.pageSize) httpParams = httpParams.set('pageSize', params.pageSize.toString());
    return this.http.get<ApiLog[]>(`${this.baseUrl}/logs`, { params: httpParams });
  }

  getChartData(apiId: number, hours: number = 24): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/logs/chart/${apiId}?hours=${hours}`);
  }

  getLatencyOverview(hours: number = 24): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/logs/latency-overview?hours=${hours}`);
  }

  // ── Incidents ─────────────────────────────────────────

  getIncidents(params?: {
    apiId?: number;
    severity?: string;
    unresolvedOnly?: boolean;
  }): Observable<Incident[]> {
    let httpParams = new HttpParams();
    if (params?.apiId) httpParams = httpParams.set('apiId', params.apiId.toString());
    if (params?.severity) httpParams = httpParams.set('severity', params.severity);
    if (params?.unresolvedOnly) httpParams = httpParams.set('unresolvedOnly', 'true');
    return this.http.get<Incident[]>(`${this.baseUrl}/incidents`, { params: httpParams });
  }

  resolveIncident(id: number): Observable<Incident> {
    return this.http.patch<Incident>(`${this.baseUrl}/incidents/${id}/resolve`, {});
  }

  // ── AI ────────────────────────────────────────────────

  askAi(question: string): Observable<AiInsightResponse> {
    return this.http.post<AiInsightResponse>(`${this.baseUrl}/ai/ask`, { question });
  }

  getAnomalies(hours: number = 24): Observable<AnomalyResponse[]> {
    return this.http.get<AnomalyResponse[]>(`${this.baseUrl}/ai/anomalies?hours=${hours}`);
  }

  getFailurePredictions(): Observable<FailurePrediction[]> {
    return this.http.get<FailurePrediction[]>(`${this.baseUrl}/ai/predictions`);
  }
}
