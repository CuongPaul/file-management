import { IsOptional } from 'class-validator';

export class QueryUsersDto {
	@IsOptional()
	email: string;

	@IsOptional()
	username: string;
}
