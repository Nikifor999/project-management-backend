import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet';

export const RedisConfig: CacheModuleAsyncOptions = {
  isGlobal: true,
  useFactory: async () => {
    const store = await redisStore({
      socket: {
        host: process.env.REDIS_HOST || 'cashe_redis', // Имя контейнера
        port: Number(process.env.REDIS_PORT) || 6379,
      },
      ttl: Number(process.env.REDIS_TTL) || 500000,
    });

    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      store: store as any,
    };
  },
};

// docker exec -it cashe_redis redis-cli
