import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, MinLength } from "class-validator";


@InputType()
export class CreateUserInput {

    @IsString()
    @Field()
    name: string;

    @IsEmail()
    @Field()
    email: string;

    @Field()
    @MinLength(6)
    password: string;
}