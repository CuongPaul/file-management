import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateFolderDto } from './create-folder.dto';

export class UpdateFolderDto extends PartialType(
	OmitType(CreateFolderDto, ['parent_folder_id']),
) {}
