import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

export const RedisConfig: CacheModuleAsyncOptions = {
    isGlobal: true,
    useFactory: async () => {
        console.log('Connecting to Redis at', process.env.REDIS_HOST, process.env.REDIS_PORT);
        return {
            store: redisStore,
            host: process.env.REDIS_HOST,
            port: Number(process.env.REDIS_PORT) || 6379,
            ttl: Number(process.env.REDIS_TTL), //|| 0,
        };
    },
};