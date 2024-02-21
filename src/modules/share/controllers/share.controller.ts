import {
	Get,
	Req,
	Post,
	Body,
	Patch,
	Param,
	Query,
	Delete,
	UseGuards,
	Controller,
	ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { QuerySharesDto } from '../dto/get-shares.dto';
import { ShareService } from '../services/share.service';
import { CreateShareDto } from '../dto/create-share.dto';
import { UpdateShareDto } from '../dto/update-share.dto';
import { JwtAccessTokenGuard } from '@guards/jwt-access-token.guard';
import { IRequestWithUser } from '@modules/auth/interfaces/request-with-user.interface';

@ApiTags('Share')
@Controller('share')
@UseGuards(JwtAccessTokenGuard)
export class ShareController {
	constructor(private readonly shareService: ShareService) {}

	@Post()
	create(@Req() req: IRequestWithUser, @Body() createShareDto: CreateShareDto) {
		const { id: userId } = req.user;

		return this.shareService.create({ userId, createShareDto });
	}

	@Get()
	findAll(
		@Req() req: IRequestWithUser,
		@Query(
			new ValidationPipe({
				transform: true,
				forbidNonWhitelisted: true,
				transformOptions: { enableImplicitConversion: true },
			}),
		)
		querySharesDto: QuerySharesDto,
	) {
		const { id: userId } = req.user;

		return this.shareService.findAll({ userId, querySharesDto });
	}

	@Get(':id')
	findOne(@Param('id') id: string, @Req() req: IRequestWithUser) {
		const { id: userId } = req.user;

		return this.shareService.findOne({ id, userId });
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Req() req: IRequestWithUser,
		@Body() updateShareDto: UpdateShareDto,
	) {
		const { id: userId } = req.user;

		return this.shareService.update({ id, userId, updateShareDto });
	}

	@Delete(':id')
	remove(@Param('id') id: string, @Req() req: IRequestWithUser) {
		const { id: userId } = req.user;

		return this.shareService.remove({ id, userId });
	}
}
