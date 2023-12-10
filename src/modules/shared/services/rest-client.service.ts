import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';

import { injectable } from 'tsyringe';
import { IRestClientInterface } from '../types/rest-client.service.type';
import {
  HttpResponse,
  IRestClientConfig,
} from '../interfaces/rest-client.service.interface';

@injectable()
export class RestClientService implements IRestClientInterface {
  protected axiosInstance: AxiosInstance;

  protected baseURL: string;

  protected maxRetries: number;

  protected currentRetry: number;

  protected retryDelay: number;

  protected retryStatusCodes: number[];

  constructor(config: IRestClientConfig) {
    this.baseURL = config.baseURL;
    this.axiosInstance = axios.create({
      baseURL: config.baseURL,
    });
    this.maxRetries = config.maxRetries || 3;
    this.retryDelay = config.retryDelay || 1000;
    this.currentRetry = 0;
    this.retryStatusCodes = config.retryStatusCodes || [
      400, 401, 404, 403, 500, 501, 502,
    ];
    this.setupInterceptors();
  }

  protected async executeRequest<T>(
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    try {
      return await this.axiosInstance(config);
    } catch (error) {
      throw error;
    }
  }

  protected async retryRequest<T>(
    config: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    this.currentRetry++;
    this.retryDelay *= 2;

    await this.delay(this.retryDelay);
    return this.executeRequest(config);
  }

  protected async delay(ms: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, ms);
    });
  }

  protected setupInterceptors() {
    let retryCount = 0;
    this.axiosInstance.interceptors.response.use(
      async (response: AxiosResponse) => {
        if (this.shouldRetry(response) && retryCount < this.maxRetries) {
          retryCount++;
          return this.retryRequest(response.config);
        }
        return response;
      },
      async (error: AxiosError) => {
        if (
          error.response &&
          this.shouldRetry(error.response) &&
          retryCount < this.maxRetries
        ) {
          retryCount++;
          const retryConfig = error.config || {};
          return this.retryRequest(retryConfig);
        }
        return Promise.reject(error);
      },
    );
  }

  protected shouldRetry(response: AxiosResponse): boolean {
    return this.retryStatusCodes.includes(response.status);
  }

  async get<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.axiosInstance.get<T, AxiosResponse<T>>(url, config);
  }

  async post<T = unknown>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.axiosInstance.post<T, AxiosResponse<T>>(url, data, config);
  }

  async put<T = unknown>(
    url: string,
    data: unknown,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.axiosInstance.put<T, AxiosResponse<T>>(url, data, config);
  }

  async patch<T = unknown>(
    url: string,
    data: any,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.axiosInstance.patch<T, AxiosResponse<T>>(url, data, config);
  }

  async delete<T = unknown>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<HttpResponse<T>> {
    return this.axiosInstance.delete<T, AxiosResponse<T>>(url, config);
  }
}
