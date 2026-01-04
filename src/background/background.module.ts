import { Module } from '@nestjs/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { SQSClient } from '@aws-sdk/client-sqs';
import { ScheduleModule } from '@nestjs/schedule';
import { cacheQueueConsumer, cacheQueueProducer } from 'src/config/sqs.config';
import { CacheClearProducer } from './cache-clear.producer';
import { CacheClearConsumer } from './cache-clear.consumer';


@Module({

    imports: [
        ScheduleModule.forRoot(), // Cron

        SqsModule.register({
            consumers: [cacheQueueConsumer],
            producers: [cacheQueueProducer],
        }),
    ],
    providers: [CacheClearConsumer, CacheClearProducer],
})
export class BackgroundModule { }
