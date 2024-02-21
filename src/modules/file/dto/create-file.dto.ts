import { IsUUID, IsOptional } from 'class-validator';

export class CreateFileDto {
	@IsOptional()
	@IsUUID(4, { each: true })
	folder_id: string;
}
