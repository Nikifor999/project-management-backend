import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { ProjectService } from './project.service';
import { ProjectType } from './project.type';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { GqlAccessGuard } from 'src/auth/guards/gql-access.guard';
import { UseGuards } from '@nestjs/common';
import { Project } from './project.entity';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';

@Resolver()
export class ProjectResolver {

    constructor(private readonly projectService: ProjectService) { }

    @UseGuards(GqlAccessGuard)
    @Query(() => [ProjectType])
    getUsersProjects(@CurrentUser() user: { userId: string }): Promise<Project[]> {
        return this.projectService.getUserProjects(user.userId);
    };

    @UseGuards(GqlAccessGuard)
    @Mutation(() => ProjectType)
    createProject(@CurrentUser() user: { userId: string },
        @Args('input') input: CreateProjectInput): Promise<Project> {
        return this.projectService.createProject(user.userId, input);
    }

    @UseGuards(GqlAccessGuard)
    @Mutation(() => ProjectType)
    updateProject(
        @CurrentUser() user: { userId: string },
        @Args('projectId') projectId: string,
        @Args('input') input: UpdateProjectInput): Promise<Project> {

        return this.projectService.updateProject(user.userId, projectId, input);
    }


    @Mutation(() => Boolean)
    @UseGuards(GqlAccessGuard)
    async removeProject(
        @Args('projectId') projectId: string,
        @CurrentUser() user: { userId: string },
    ) {
        return this.projectService.removeProject(projectId, user.userId);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAccessGuard)
    async archiveProject(
        @Args('projectId') projectId: string,
    ) {
        return this.projectService.archiveProject(projectId);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAccessGuard)
    async unarchiveProject(
        @Args('projectId') projectId: string,
    ) {
        return this.projectService.unarchiveProject(projectId);
    }
}
