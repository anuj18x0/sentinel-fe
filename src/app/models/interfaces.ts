export interface ApiEndpoint {
  id: number;
  name: string;
  url: string;
  checkInterval: number;
  createdAt: string;
  isActive: boolean;
  status: 'healthy' | 'unhealthy' | 'unknown';
  lastResponseTime?: number;
}

export interface CreateApiRequest {
  name: string;
  url: string;
  checkInterval: number;
}

export interface UpdateApiRequest {
  name?: string;
  url?: string;
  checkInterval?: number;
  isActive?: boolean;
}

export interface ApiLog {
  id: number;
  apiId: number;
  responseTime: number;
  statusCode: number;
  timestamp: string;
  isAnomaly: boolean;
  errorMessage?: string;
  api?: ApiEndpoint;
}

export interface Incident {
  id: number;
  apiId: number;
  incidentType: string;
  severity: string;
  aiSummary?: string;
  timestamp: string;
  isResolved: boolean;
  api?: ApiEndpoint;
}

export interface DashboardStats {
  totalApis: number;
  healthyApis: number;
  unhealthyApis: number;
  anomaliesDetectedToday: number;
  activeIncidents: number;
  averageLatency: number;
}

export interface AiInsightResponse {
  answer: string;
  timestamp: string;
}

export interface AnomalyResponse {
  logId: number;
  apiName: string;
  responseTime: number;
  statusCode: number;
  timestamp: string;
}

export interface FailurePrediction {
  apiId: number;
  apiName: string;
  failureProbability: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
