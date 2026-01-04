import { SQSClient } from '@aws-sdk/client-sqs';

export const sqsClient = new SQSClient({
  endpoint: process.env.SQS_ENDPOINT,
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_KEY!,
  },
});

export const cacheQueueProducer = {
  name: 'cache-queue',
  queueUrl: `${process.env.SQS_ENDPOINT}/000000000000/${process.env.SQS_QUEUE_NAME}`,
  region: process.env.AWS_REGION,
  sqs: sqsClient,
};

export const cacheQueueConsumer = {
  name: 'cache-queue',
  queueUrl: `${process.env.SQS_ENDPOINT}/000000000000/${process.env.SQS_QUEUE_NAME}`,
  region: process.env.AWS_REGION,
  sqs: sqsClient,
};