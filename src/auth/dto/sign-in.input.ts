import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, MinLength } from "class-validator";


@InputType()
export class SignInInput {

    @IsEmail()
    @Field()
    email: string;

    @Field()
    password: string;
}