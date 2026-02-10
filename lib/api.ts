// API client for communicating with DocChase backend

// Helper to ensure URL has protocol
const ensureAbsoluteUrl = (url: string | undefined): string => {
  if (!url) return 'http://localhost:3001';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

// @ts-ignore - Next.js env vars are injected at build time
const API_URL = ensureAbsoluteUrl(process.env.NEXT_PUBLIC_API_URL);

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    console.log('[ApiClient] Request:', endpoint, 'with token:', this.token ? `${this.token.substring(0, 10)}...` : 'none');

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    console.log('[ApiClient] Response status:', response.status, 'for:', endpoint);

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      console.error('[ApiClient] Request failed:', response.status, error);
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Generic methods for custom endpoints
  async get(endpoint: string) {
    return this.request(endpoint);
  }

  async post(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put(endpoint: string, data?: any) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete(endpoint: string) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // Dashboard
  async getDashboard() {
    return this.request('/api/dashboard');
  }

  // Clients
  async getClients() {
    return this.request('/api/clients');
  }

  async getClient(id: string) {
    return this.request(`/api/clients/${id}`);
  }

  async createClient(data: { name: string; phone: string; email?: string }) {
    return this.request('/api/clients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateClient(id: string, data: { name?: string; phone?: string; email?: string }) {
    return this.request(`/api/clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteClient(id: string) {
    return this.request(`/api/clients/${id}`, {
      method: 'DELETE',
    });
  }

  // Campaigns
  async getCampaigns() {
    return this.request('/api/campaigns');
  }

  async getCampaign(id: string) {
    return this.request(`/api/campaigns/${id}`);
  }

  async createCampaign(data: {
    name: string;
    document_type?: string;
    period: string;
    client_ids: string[];
    reminder_day_3?: boolean;
    reminder_day_6?: boolean;
    flag_after_day_9?: boolean;
    reminder_1_days?: number;
    reminder_2_days?: number;
    reminder_3_days?: number;
    reminder_send_time?: string;
    initial_message?: string;
  }) {
    return this.request('/api/campaigns', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async startCampaign(id: string) {
    return this.request(`/api/campaigns/${id}/start`, {
      method: 'POST',
    });
  }

  async updateCampaign(id: string, data: {
    name?: string;
    period?: string;
    reminder_1_days?: number;
    reminder_2_days?: number;
    reminder_3_days?: number;
    reminder_send_time?: string;
    initial_message?: string;
    reminder_day_3?: boolean;
    reminder_day_6?: boolean;
    flag_after_day_9?: boolean;
  }) {
    return this.request(`/api/campaigns/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

export const apiClient = new ApiClient(API_URL);
