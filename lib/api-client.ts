// API base URL configuration
// In Docker, use environment variable or default to relative path

export const getApiUrl = (): string => {
  // Client-side: use environment variable or relative path
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_API_URL || '';
  }
  
  // Server-side: use internal Docker network or localhost
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

// API helper functions
export const apiCall = async (endpoint: string, options?: RequestInit) => {
  const baseUrl = getApiUrl();
  const url = baseUrl ? `${baseUrl}${endpoint}` : endpoint;
  
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  
  return response.json();
};

// Convenience methods
export const api = {
  get: (endpoint: string) => apiCall(endpoint),
  
  post: (endpoint: string, data: any) => 
    apiCall(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  put: (endpoint: string, data: any) =>
    apiCall(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (endpoint: string) =>
    apiCall(endpoint, {
      method: 'DELETE',
    }),
};
