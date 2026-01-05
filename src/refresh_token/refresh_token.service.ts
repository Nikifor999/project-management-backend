import { Injectable } from '@nestjs/common';
import { RefreshToken } from './refresh_token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, FindOperator, Repository } from 'typeorm';
import { User } from 'src/user/user.entity';

@Injectable()
export class RefreshTokenService {

    constructor(
        @InjectRepository(RefreshToken)
        private readonly refTokenRep: Repository<RefreshToken>,
    ) { }

    async revokeAllForUser(userId: string, manager?: EntityManager): Promise<void> {
        if (manager) {
            await manager.delete(RefreshToken, { user: { id: userId } });
        } else {
            await this.refTokenRep.delete({ user: { id: userId } });
        }
    }

    async find(params: Object) {
        return this.refTokenRep.find(params);
    }

    async save(matchedToken: RefreshToken) {
        return this.refTokenRep.save(matchedToken);
    }

    create(data: Partial<RefreshToken>): RefreshToken {
        return this.refTokenRep.create(data);
    }


}
