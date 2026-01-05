import { Module } from '@nestjs/common';
import { RefreshToken } from './refresh_token.entity';
import { RefreshTokenService } from './refresh_token.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [TypeOrmModule.forFeature([RefreshToken])],
    providers: [RefreshTokenService],
    exports: [RefreshTokenService],
})
export class RefreshTokenModule {

}
