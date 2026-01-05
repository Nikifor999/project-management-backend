import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CreateUserInput } from 'src/auth/dto/create-user.input';
import { AuthService } from './auth.service';
import { AuthResponse } from './dto/auth.response';
import { SignInInput } from './dto/sign-in.input';
import { UseGuards } from '@nestjs/common';
import { GqlRefreshGuard } from './guards/gql-refresh.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { ChangePasswordResponse } from './dto/change-password.response';
import { GqlAccessGuard } from './guards/gql-access.guard';
import { ChangePasswordInput } from './dto/change-password.input';

@Resolver()
export class AuthResolver {

    constructor(private readonly authService: AuthService) { }

    @Mutation(() => AuthResponse)
    signUp(@Args('input') input: CreateUserInput
    ): Promise<AuthResponse> {
        return this.authService.registerUser(input);
    }

    @Mutation(() => ChangePasswordResponse)
    @UseGuards(GqlAccessGuard)
    async changePassword(
        @Args('input') input: ChangePasswordInput,
        @CurrentUser() user: { userId: string }
    ): Promise<ChangePasswordResponse> {

        await this.authService.changePassword(user.userId, input);
        return {
            success: true,
            message: 'Password has been changed',
        }
    }


    @Mutation(() => AuthResponse)
    async signIn(
        @Args('input') input: SignInInput,
    ): Promise<AuthResponse> {
        return this.authService.signIn(
            input.email,
            input.password,
        );
    }

    @UseGuards(GqlRefreshGuard)
    @Mutation(() => AuthResponse)
    async refreshTokens(
        @CurrentUser() user: { userId: string; email: string; refreshToken: string },
    ): Promise<AuthResponse> {
        const userId = user.userId;
        const refreshToken = user.refreshToken;
        return this.authService.refreshTokens(userId, refreshToken);
    }

    @UseGuards(GqlRefreshGuard)
    @Mutation(() => Boolean)
    async logout(
        @CurrentUser() user: { userId: string; email: string; refreshToken: string },
    ): Promise<boolean> {
        await this.authService.logout(user.userId, user.refreshToken);
        return true;
    }
}
