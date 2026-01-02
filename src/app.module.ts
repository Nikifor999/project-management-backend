import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { HelloResolver } from './hello/hello.resolver';
import { postgresConfig } from './config/postgres.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { mongoConfig } from './config/mongo.config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { ProjectModule } from './project/project.module';
import { NoteModule } from './note/note.module';
import { AuthModule } from './auth/auth.module';
import { SearchModule } from './search/search.module';
import { dataSourceOptions } from './db/datasource';
import { CacheModule } from '@nestjs/cache-manager';
import { RedisConfig } from './config/redis.config';

@Module({
  imports: [
    MongooseModule.forRoot(mongoConfig.uri as string),
    TypeOrmModule.forRoot(dataSourceOptions),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
      context: ({ req, res }) => ({ req, res }),
    }),
    CacheModule.registerAsync(RedisConfig),
    UserModule,
    ProjectModule,
    NoteModule,
    AuthModule,
    SearchModule,
  ],
  controllers: [AppController],
  providers: [AppService, HelloResolver],
})
export class AppModule { }
