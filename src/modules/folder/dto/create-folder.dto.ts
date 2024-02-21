import { IsUUID, IsNotEmpty, IsOptional } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';

export class CreateFolderDto {
	@IsOptional()
	@IsUUID(4, { each: true })
	parent_folder_id: string;

	@IsNotEmpty()
	@Transform(({ value }: TransformFnParams) => value?.trim())
	name: string;
}
