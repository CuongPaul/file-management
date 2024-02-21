import { IsNotEmpty } from 'class-validator';

export class QueryPreviewFileDto {
	@IsNotEmpty()
	name: string;
}
