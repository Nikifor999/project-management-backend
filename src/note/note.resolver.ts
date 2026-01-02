import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { NoteService } from './note.service';
import { NoteGraphQLType } from './dto/note.type';
import { UseGuards } from '@nestjs/common';
import { GqlAccessGuard } from 'src/auth/guards/gql-access.guard';
import { Note } from './note.schema';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { CreateNoteInput } from './dto/create-note.input';
import { CreateNoteAttachmentInput } from './dto/create-attachment.input';

@Resolver(() => NoteGraphQLType)
export class NoteResolver {

    constructor(private readonly noteService: NoteService) { }

    @UseGuards(GqlAccessGuard)
    @Query(() => [NoteGraphQLType])
    getProjectsNotes(@Args('projectId') projectId: string): Promise<Note[]> {
        return this.noteService.findByProject(projectId);
    }

    @UseGuards(GqlAccessGuard)
    @Query(() => [NoteGraphQLType])
    getUsersNotes(@CurrentUser() user: { userId: string }): Promise<Note[]> {
        return this.noteService.findByOwner(user.userId);
    }

    @UseGuards(GqlAccessGuard)
    @Mutation(() => NoteGraphQLType)
    createNote(@CurrentUser() user: { userId: string },
        @Args('input') input: CreateNoteInput,
    ): Promise<Note> {
        return this.noteService.create(user.userId, input);
    }

    @Mutation(() => Boolean)
    @UseGuards(GqlAccessGuard)
    async removeNote(
        @Args('noteId') noteId: string,
        @CurrentUser() user: { userId: string },
    ) {
        return this.noteService.removeNote(noteId, user.userId);
    }

    @Mutation(() => NoteGraphQLType)
    @UseGuards(GqlAccessGuard)
    addAttachment(@Args('input') input: CreateNoteAttachmentInput,
        @CurrentUser() user: { userId: string },
    ): Promise<Note> {
        return this.noteService.addAttachmentToNote(user.userId, input);
    }


    @Mutation(() => NoteGraphQLType)
    @UseGuards(GqlAccessGuard)
    removeAttachment(
        @Args('noteId') noteId: string,
        @Args('attachmentId') attachmentId: string,
        @CurrentUser() user: { userId: string },
    ): Promise<Note> {
        return this.noteService.removeAttachmentFromNote(user.userId, noteId, attachmentId);
    }

}
