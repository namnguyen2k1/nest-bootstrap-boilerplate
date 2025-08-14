import { HttpModuleOptions, HttpModuleOptionsFactory } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import * as http from 'http';
import * as https from 'https';

@Injectable()
export class HttpClientConfig implements HttpModuleOptionsFactory {
  createHttpOptions(): HttpModuleOptions {
    const httpsAgent = new https.Agent({
      family: 4,
      keepAlive: true,
      maxSockets: 100,
    });

    const httpAgent = new http.Agent({
      family: 4,
      keepAlive: true,
      maxSockets: 100,
    });

    return {
      timeout: 10 * 60 * 1000, // 10m
      maxRedirects: 5,
      httpAgent,
      httpsAgent,
    };
  }
}
