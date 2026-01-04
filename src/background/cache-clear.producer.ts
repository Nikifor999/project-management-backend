import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { SqsService } from '@ssut/nestjs-sqs';

@Injectable()
export class CacheClearProducer {

    constructor(private readonly sqsService: SqsService) { }

    //@Cron(CronExpression.EVERY_MINUTE)
    @Cron(CronExpression.EVERY_HOUR)
    async scheduleCacheClear() {
        console.log('CRON triggered: Sending cache clear message to SQS...');

        try {
            await this.sqsService.send('cache-queue', {
                id: 'id-' + Date.now(),
                body: { action: 'CLEAR_ALL_CACHE', timestamp: new Date().toISOString() },
            });
            console.log(' Message sent to SQS');
        } catch (error) {
            console.error('Failed to send message to SQS', error);
        }
    }
}