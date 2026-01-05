import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshToken } from '../refresh_token/refresh_token.entity';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token.strategy';
import { RefreshTokenStrategy } from './strategies/refresh-token.strategy';
import { UserModule } from 'src/user/user.module';
import { RefreshTokenModule } from 'src/refresh_token/refresh_token.module';

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    JwtModule.register({}),
    TypeOrmModule.forFeature([RefreshToken])
  ],
  providers: [
    AuthService, AuthResolver,
    AccessTokenStrategy,
    RefreshTokenStrategy,
  ]
})
export class AuthModule { }
