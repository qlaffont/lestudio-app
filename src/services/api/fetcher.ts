import { API_BASE } from '../env';

/* eslint-disable @typescript-eslint/no-unsafe-return */
export const fetcher = ({
  method,
  body,
  url = '',
}: {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: HeadersInit;
  body?: BodyInit | null;
  url?: string;
}) => {
  return async () => {
    const allHeaders: Record<string, string> = {};

    allHeaders['Content-Type'] = `application/json`;

    const res = await fetch(`${API_BASE}${url}`, {
      method,
      headers: allHeaders,
      body,
    });

    if (!res.ok) {
      try {
        const response = await res.json();
        throw response;
      } catch (error) {
        const response = await res.text();
        throw response;
      }
    }

    try {
      const response = await res.json();
      return response;
    } catch (error) {
      try {
        const response = await res.text();
        return response;
      } catch (error) {
        return 'OK';
      }
    }
  };
};
