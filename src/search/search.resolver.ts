import { Args, Query, Resolver } from '@nestjs/graphql';
import { SearchService } from './search.service';
import { SearchResultUnion } from './search-result.union';
import { UseGuards } from '@nestjs/common';
import { GqlAccessGuard } from 'src/auth/guards/gql-access.guard';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';

@Resolver()
export class SearchResolver {

    constructor(private readonly searchService: SearchService) { }

    @Query(() => [SearchResultUnion])
    @UseGuards(GqlAccessGuard)
    search(
        @CurrentUser() user: { userId: string },
        @Args('query') query: string
    ) {
        if (!query || query.length < 3) return [];
        return this.searchService.globalSearch(user.userId, query);
    }
}
