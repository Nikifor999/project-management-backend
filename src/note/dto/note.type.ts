
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { NoteVisibility } from '../note.visibility';

@ObjectType('Note')
export class NoteGraphQLType {
  @Field(() => ID)
  id: string;

  @Field()
  projectId: string;

  @Field()
  ownerId: string;

  @Field()
  title: string;

  @Field({ nullable: true })
  content?: string;

  @Field(() => [NoteAttachmentType], { nullable: 'itemsAndList' })
  attachments?: NoteAttachmentType[];

  @Field(() => [String])
  labels: string[];

  @Field()
  pinned: boolean;

  @Field()
  position: number;

  @Field(() => NoteVisibility)
  visibility: NoteVisibility;

  @Field()
  isArchived: boolean;

  @Field({ nullable: true })
  trashedAt?: Date;

  @Field({ nullable: true })
  reminderAt?: Date;

  @Field()
  reminderSent: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;
}


@ObjectType('NoteAttachment')
export class NoteAttachmentType {
  @Field()
  id: string;

  @Field()
  name: string;

  @Field()
  url: string;

  @Field()
  mime: string;

  @Field()
  size: number;
}