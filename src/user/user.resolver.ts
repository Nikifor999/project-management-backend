import { Query, Resolver } from '@nestjs/graphql';
import { UserType } from './dto/user.type';
import { UserService } from './user.service';
import { GqlAccessGuard } from 'src/auth/guards/gql-access.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver(() => UserType)
export class UserResolver {

    constructor(private readonly userService: UserService) {

    }

    @UseGuards(GqlAccessGuard)
    @Query(() => UserType)
    getUser(@CurrentUser() user: { userId: string }) {
        return this.userService.findById(user.userId);
    }

    

}
