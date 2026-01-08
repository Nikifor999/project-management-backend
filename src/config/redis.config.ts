import { CacheModuleAsyncOptions } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-redis-yet'; // <--- Используем современную либу

export const RedisConfig: CacheModuleAsyncOptions = {
    isGlobal: true,
    useFactory: async () => {
        const store = await redisStore({
            socket: {
                host: process.env.REDIS_HOST || 'cashe_redis', // Имя контейнера
                port: Number(process.env.REDIS_PORT) || 6379,
            },
            ttl: Number(process.env.REDIS_TTL) || 500000, // ВАЖНО: В v5+ это миллисекунды! (5000 = 5 сек)
        });

        return {
            store: store as any, // 'as any' нужен из-за небольшого конфликта типов в NestJS враппере
        };
    },
};

// docker exec -it cashe_redis redis-cli