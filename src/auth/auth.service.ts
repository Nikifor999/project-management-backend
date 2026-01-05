import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { CreateUserInput } from 'src/auth/dto/create-user.input';
import { User } from 'src/user/user.entity';
import { IsNull, Repository } from 'typeorm';
import { RefreshToken } from '../refresh_token/refresh_token.entity';
import { JwtService } from '@nestjs/jwt';
import { ChangePasswordInput } from './dto/change-password.input';
import { ChangePasswordResponse } from './dto/change-password.response';
import { UserService } from 'src/user/user.service';
import { RefreshTokenService } from 'src/refresh_token/refresh_token.service';

@Injectable()
export class AuthService {

    constructor(
        private readonly jwtService: JwtService,
        private readonly userService: UserService,
        private readonly refreshTokenService: RefreshTokenService,
    ) { }

    private SALT_ROUNDS = 10;

    async registerUser(input: CreateUserInput) {

        const existingUser = await this.userService.findByEmail(input.email);

        if (existingUser) {
            throw new BadRequestException('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(input.password, this.SALT_ROUNDS);

        const newSavedUser = await this.userService.create({
            ...input, password: hashedPassword
        });

        const { accessToken, refreshToken } = await this.generateTokens(newSavedUser);

        await this.saveRefreshToken(newSavedUser, refreshToken);

        return {
            accessToken,
            refreshToken,
        };

    }

    async changePassword(userId: string, input: ChangePasswordInput): Promise<void> {

        const user = await this.userService.findById(userId);

        const { oldPassword, newPassword } = input;

        if (!user.password) {
            throw new BadRequestException('Password change is not available for this account');
        }

        const isOldPasswordValid = await bcrypt.compare(
            oldPassword,
            user.password,
        );

        if (!isOldPasswordValid) {
            throw new BadRequestException('Old password is wrong');
        }

        const isSamePassword = await bcrypt.compare(
            newPassword,
            user.password,
        );

        if (isSamePassword) {
            throw new BadRequestException('Password must be different from old password');
        }

        user.password = await bcrypt.hash(newPassword, this.SALT_ROUNDS);

        await this.userService.save(user);
        await this.refreshTokenService.revokeAllForUser(user.id);
    }

    async signIn(email: string, password: string) {
        const user = await this.userService.findByEmail(email);

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
        const tokens = await this.refreshTokenService.find({
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
        await this.refreshTokenService.save(matchedToken)

        const { accessToken, refreshToken } =
            await this.generateTokens(matchedToken.user);

        await this.saveRefreshToken(matchedToken.user, refreshToken);

        return {
            accessToken,
            refreshToken,
        };
    }

    async logout(userId: string, incomingRefreshToken: string): Promise<void> {
        const tokens = await this.refreshTokenService.find({
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
        await this.refreshTokenService.save(matchedToken);
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

        const entity = this.refreshTokenService.create({
            user,
            tokenHash,
            expiresAt,
        });

        return this.refreshTokenService.save(entity);
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
