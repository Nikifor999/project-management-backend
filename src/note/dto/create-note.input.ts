import { InputType, Field } from '@nestjs/graphql';
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';
import { NoteVisibility } from '../note.visibility';

@InputType()
export class CreateNoteInput {

    @Field() 
    @IsNotEmpty()
    @IsUUID()
    projectId: string;

    @Field()
    @IsNotEmpty()
    @MaxLength(255)
    title: string;

    @Field({ nullable: true })
    content?: string;

    @Field({ nullable: true })
    @IsEnum(NoteVisibility)
    visibility?: NoteVisibility;

    @Field({ nullable: true })
    reminderAt?: Date;

    @Field(() => [String], { nullable: true })
    labels?: string[]

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    postion?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    pinned?: boolean;
}
