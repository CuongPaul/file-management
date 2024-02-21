import {
	IsEmail,
	MaxLength,
	IsNotEmpty,
	IsStrongPassword,
} from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class SignUpDto {
	@IsEmail()
	@IsNotEmpty()
	email: string;

	@IsNotEmpty()
	@MaxLength(50)
	@Transform(({ value }: TransformFnParams) => value?.trim())
	username: string;

	@IsNotEmpty()
	@IsStrongPassword()
	password: string;
}
