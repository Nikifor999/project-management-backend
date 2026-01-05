import { Field, InputType } from "@nestjs/graphql";
import { IsEmail, IsString, MinLength } from "class-validator";


@InputType()
export class ChangePasswordInput {

    @Field()
    oldPassword: string;

    @Field()
    @MinLength(6)
    newPassword: string;
}