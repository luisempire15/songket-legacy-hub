const BASE_URL = 'http://localhost:5000/api';

export class ApiService {
  protected static async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };

    const response = await fetch(url, config);
    const data = await response.json();
    
    if (!response.ok || (data && data.success === false)) {
      throw new Error(data?.message || 'Something went wrong');
    }
    
    return data as T;
  }
}
