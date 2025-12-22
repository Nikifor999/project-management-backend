import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import bcrypt from 'node_modules/bcryptjs';
import { CreateUserInput } from 'src/auth/dto/create-user.input';
import { User } from 'src/user/user.entity';
import { IsNull, Repository } from 'typeorm';
import { RefreshToken } from './entities/refresh-token.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(RefreshToken) private refTokenRepository: Repository<RefreshToken>,
        private readonly jwtService: JwtService,
    ) { }

    async registerUser(input: CreateUserInput) {

        const existingUser = await this.userRepository.findOne({
            where: { email: input.email },
        })

        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);

        const newUser = this.userRepository.create({
            ...input, password: hashedPassword
        });

        const savedUser = await this.userRepository.save(newUser);

        const { accessToken, refreshToken } = await this.generateTokens(savedUser);

        await this.saveRefreshToken(savedUser, refreshToken);

        return {
            accessToken,
            refreshToken,
        };

    }


    async signIn(email: string, password: string) {
        const user: User | null = await this.userRepository.findOne({ where: { email } });

        if (!user) {
            throw new ForbiddenException('Invalid credentials');
        }

        const passwordHasMatch = await bcrypt.compare(
            password,
            user.password,
        );

        if (!passwordHasMatch) {
            throw new ForbiddenException('Invalid password');
        }

        const { accessToken, refreshToken } =
            await this.generateTokens(user);

        await this.saveRefreshToken(user, refreshToken);

        return {
            accessToken,
            refreshToken,
        };

    }

    async refreshTokens(userId: string, incomingRefreshToken: string) {
        const tokens = await this.refTokenRepository.find({
            where: {
                user: { id: userId },
                revokedAt: IsNull(),
            },
            relations: ['user'],
        });

        if (!tokens.length) {
            throw new ForbiddenException('Access denied');
        }

        const matchedToken = await this.findMatchingToken(
            tokens,
            incomingRefreshToken,
        );

        if (!matchedToken) {
            throw new ForbiddenException('Access denied');
        }

        matchedToken.revokedAt = new Date();
        await this.refTokenRepository.save(matchedToken);

        const { accessToken, refreshToken } =
            await this.generateTokens(matchedToken.user);

        await this.saveRefreshToken(matchedToken.user, refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }

    async logout(userId: string, incomingRefreshToken: string): Promise<void> {
        const tokens = await this.refTokenRepository.find({
            where: {
                user: { id: userId },
                revokedAt: IsNull(),
            },
            relations: ['user'],
        });

        const matchedToken = await this.findMatchingToken(
            tokens,
            incomingRefreshToken,
        );

        if (!matchedToken) {
            throw new ForbiddenException('Access denied');
        }

        matchedToken.revokedAt = new Date();
        await this.refTokenRepository.save(matchedToken);
    }


    private async generateTokens(user: User) {
        const payload = { sub: user.id, email: user.email };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_ACCESS_SECRET,
            expiresIn: parseInt(process.env.JWT_ACCESS_EXPIRATION || '3600'),
        });

        const refreshToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: parseInt(process.env.JWT_REFRESH_EXPIRATION || '604800'),
        });

        return { accessToken, refreshToken };
    }


    private async saveRefreshToken(
        user: User,
        refreshToken: string,
    ): Promise<RefreshToken> {
        const tokenHash = await bcrypt.hash(refreshToken, 10);

        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        const entity = this.refTokenRepository.create({
            user,
            tokenHash,
            expiresAt,
        });

        return this.refTokenRepository.save(entity);
    }

    private async findMatchingToken(
        tokens: RefreshToken[],
        incomingToken: string,
    ): Promise<RefreshToken | null> {
        for (const token of tokens) {
            const match = await bcrypt.compare(
                incomingToken,
                token.tokenHash,
            );

            if (match) {
                return token;
            }
        }

        return null;
    }
}
