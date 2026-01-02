import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-redis-store';

export const RedisConfig: CacheModuleAsyncOptions = {
    isGlobal: true,
    useFactory: async () => {
        return {
            store: redisStore,
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
            ttl: Number(process.env.REDIS_TTL) || 0,
        };
    },
};