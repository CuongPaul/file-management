import { IsOptional } from 'class-validator';

export class QueryFilesDto {
	@IsOptional()
	name?: string;

	@IsOptional()
	type?: string;
}
