import { OmitType, PartialType } from '@nestjs/swagger';

import { CreateShareDto } from './create-share.dto';

export class UpdateShareDto extends PartialType(
	OmitType(CreateShareDto, ['file_id', 'folder_id', 'consumer_id']),
) {}
