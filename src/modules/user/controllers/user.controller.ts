import {
	Get,
	Req,
	Body,
	Param,
	Patch,
	Query,
	UseGuards,
	Controller,
	ValidationPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { QueryUsersDto } from '../dto/get-users.dto';
import { UserService } from '../services/user.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { JwtAccessTokenGuard } from '@guards/jwt-access-token.guard';
import { IRequestWithUser } from '@modules/auth/interfaces/request-with-user.interface';

@ApiTags('User')
@Controller('user')
@UseGuards(JwtAccessTokenGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}

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
		queryUsersDto: QueryUsersDto,
	) {
		const { id: userId } = req.user;

		return this.userService.findAll(
			{ userId, condition: queryUsersDto },
			{ excludeFields: ['password', 'refresh_token'] },
		);
	}

	@Get(':id')
	async findOne(@Param('id') id: string) {
		const user = await this.userService.findOneByCondition(
			{ id },
			{ excludeFields: ['password', 'refresh_token'] },
		);

		return user;
	}

	@Patch()
	async update(
		@Req() req: IRequestWithUser,
		@Body() updateUserDto: UpdateUserDto,
	) {
		const { id: userId } = req.user;

		const user = await this.userService.update(userId, updateUserDto, {
			excludeFields: ['password', 'refresh_token'],
		});

		return user;
	}
}
