import { AxiosRequestConfig, AxiosResponse } from 'axios';

export type HttpResponse<T> = Omit<
  AxiosResponse<T>,
  'headers' | 'config' | 'request'
>;

export interface IRestClientConfig {
  baseURL: string;
  maxRetries?: number;
  retryDelay?: number;
  retryStatusCodes?: number[];
}

export interface IRestClientService {
  get<T>(url: string, config?: AxiosRequestConfig): Promise<HttpResponse<T>>;
  post<T>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>>;
  put<T>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>>;
  patch<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>>;
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<HttpResponse<T>>;
}

export interface IRestClientConstructor {
  new (config: IRestClientConfig): IRestClientService;
}
