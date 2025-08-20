import axios from 'axios';
import type { AxiosInstance } from 'axios';
import { FrameAPIError } from './errors/FrameAPIError';

export interface AuthOptions {
  apiKey: string;
}

export interface ClientConfig {
  baseURL: string;
  auth: AuthOptions;
}

export const createApiClient = ({ baseURL, auth }: ClientConfig): AxiosInstance => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };

  headers['Authorization'] = `Bearer ${auth.apiKey}`;

  const client = axios.create({
    baseURL,
    headers
  });

  client.interceptors.response.use(
    response => response,
    (error) => {
      if (error.response) {
        const { status, data } = error.response;
        const code = data.code || 'unknown_error';
        const message = data.message || 'An error occurred';
        throw new FrameAPIError(message, code, status, data);
      }

      throw new FrameAPIError(error.message, 'network_error', 0, error);
    }
  );

  return client;
};