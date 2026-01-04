import { Injectable, Inject } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import * as AWS from '@aws-sdk/client-sqs';

@Injectable()
export class CacheClearConsumer {

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  @SqsMessageHandler('cache-queue', false) // false = не batch mode 
  async handleMessage(message: AWS.Message) {
    console.log(` SQS Message received: ${message.Body}`);

    const body = JSON.parse(message.Body as string);

    if (body.action === 'CLEAR_ALL_CACHE') {
        console.warn('Clearing REDIS cache...');
        
        await this.cacheManager.clear();
        
        console.log('Cache successfully cleared!');
    }
  }
}