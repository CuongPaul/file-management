import {
	IsEnum,
	IsUUID,
	IsArray,
	IsNotEmpty,
	IsOptional,
	ArrayMinSize,
} from 'class-validator';

import { PERMISSIONS } from '@constants/permissions.enum';

export class CreateShareDto {
	@IsOptional()
	@IsUUID(4, { each: true })
	file_id: string;

	@IsOptional()
	@IsUUID(4, { each: true })
	folder_id: string;

	@IsNotEmpty()
	@IsUUID(4, { each: true })
	consumer_id: string;

	@IsArray()
	@ArrayMinSize(1)
	@IsEnum(PERMISSIONS, { each: true })
	permissions: PERMISSIONS[];
}
