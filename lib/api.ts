// API client for communicating with DocChase backend

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

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
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
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

  async createCampaign(data: {
    name: string;
    document_type?: string;
    period: string;
    client_ids: string[];
    reminder_day_3?: boolean;
    reminder_day_6?: boolean;
    flag_after_day_9?: boolean;
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
}

export const apiClient = new ApiClient(API_URL);
