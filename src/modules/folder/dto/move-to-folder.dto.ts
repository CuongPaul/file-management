import { IsUUID, IsNotEmpty } from 'class-validator';

export class MoveToFolderDto {
	@IsNotEmpty()
	@IsUUID(4, { each: true })
	id: string;

	@IsNotEmpty()
	@IsUUID(4, { each: true })
	parent_folder_id: string;
}
