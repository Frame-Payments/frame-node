import axios from 'axios';
import type { AxiosInstance } from 'axios';

export interface AuthOptions {
  apiKey?: string;
  basicAuth?: {
    username: string;
    password: string;
  };
}

export interface ClientConfig {
  baseURL: string;
  auth: AuthOptions;
}

export const createApiClient = ({ baseURL, auth }: ClientConfig): AxiosInstance => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  // Add auth headers
  if (auth.apiKey) {
    headers['Authorization'] = `Bearer ${auth.apiKey}`;
  } else if (auth.basicAuth) {
    const encoded = Buffer.from(`${auth.basicAuth.username}:${auth.basicAuth.password}`).toString('base64');
    headers['Authorization'] = `Basic ${encoded}`;
  }

  return axios.create({
    baseURL,
    headers
  });
};