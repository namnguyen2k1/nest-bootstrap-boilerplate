import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios';
import { AnyObject } from 'mongoose';
import { firstValueFrom, lastValueFrom } from 'rxjs';

@Injectable()
export class HttpClientService {
  constructor(private readonly httpService: HttpService) {}

  handleAxiosError(error: unknown, namespace: string = ''): string {
    if (isAxiosError(error)) {
      console.log(`${namespace} axios.external-error`, {
        status: error?.status,
        statusText: error?.response?.statusText,
        url: error?.config?.url,
        req_body: error?.config?.data,
        res_data: error?.response?.data,
      });

      if (error?.response?.data?.data) {
        return error?.response?.data?.data;
      }

      return error?.response?.data;
    }

    console.log(`${namespace} axios.internal-error`, error);
    return (error as Error)?.message;
  }

  async get<T = AnyObject>(
    url: string,
    config?: AxiosRequestConfig<AnyObject>,
  ): Promise<AxiosResponse<T>> {
    const source = this.httpService.get<T>(url, config);

    const response = await lastValueFrom(source);
    return response;
  }

  async post<T = AnyObject>(
    url: string,
    data: AnyObject,
    config?: AxiosRequestConfig<AnyObject>,
  ): Promise<AxiosResponse<T>> {
    const source = this.httpService.post<T>(url, data, config);

    return await lastValueFrom(source);
  }

  async put<T = AnyObject>(
    url: string,
    data: AxiosRequestConfig<AnyObject>,
    config?: AxiosRequestConfig<AxiosRequestConfig<AnyObject>>,
  ): Promise<AxiosResponse<T>> {
    const source = this.httpService.put<T>(url, data, config);

    return await lastValueFrom(source);
  }

  async patch<T = AnyObject>(
    url: string,
    data: AxiosRequestConfig<AnyObject>,
    config?: AxiosRequestConfig<AxiosRequestConfig<AnyObject>>,
  ): Promise<AxiosResponse<T>> {
    const source = this.httpService.patch<T>(url, data, config);

    return await firstValueFrom(source);
  }

  async delete<T = AnyObject>(
    url: string,
    config?: AxiosRequestConfig<AnyObject>,
  ): Promise<AxiosResponse<T>> {
    const source = this.httpService.delete<T>(url, config);

    return await firstValueFrom(source);
  }
}
