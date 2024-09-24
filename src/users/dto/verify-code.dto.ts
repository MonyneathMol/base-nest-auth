import { IsEmail, IsString, Length } from "class-validator";

export class VerifyCodeDto {
    @IsEmail({}, { message: 'Invalid email address' })
    email: string;

    @IsString()
    @Length(6, 6)
    code: string;


}