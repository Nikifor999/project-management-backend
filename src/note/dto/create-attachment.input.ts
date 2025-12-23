import { Field, InputType, Int, ObjectType } from "@nestjs/graphql";
import { IsMimeType, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID } from "class-validator";

@InputType('CreateNoteAttachment')
export class CreateNoteAttachmentInput {

    @Field()
    @IsNotEmpty()
    @IsUUID() 
    noteId: string;

    @Field()
    @IsNotEmpty()
    @IsString()
    name: string;

    @Field()
    @IsNotEmpty() 
    @IsUrl()
    url: string;

    @Field()
    @IsNotEmpty()
    @IsMimeType()
    mime: string;

    @Field(() => Int)
    @IsNumber()
    size: number;
}