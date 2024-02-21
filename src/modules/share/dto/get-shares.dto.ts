import { IsEnum, IsArray, IsOptional, ArrayMinSize } from 'class-validator';

import { PERMISSIONS } from '@constants/permissions.enum';

export class QuerySharesDto {
	@IsArray()
	@IsOptional()
	@ArrayMinSize(1)
	@IsEnum(PERMISSIONS, { each: true })
	permissions: PERMISSIONS[];
}
