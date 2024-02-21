import { IsNotEmpty } from 'class-validator';

export class QueryFoldersDto {
	@IsNotEmpty()
	name: string;
}
