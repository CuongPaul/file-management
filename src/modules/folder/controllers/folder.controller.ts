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

import { QueryFoldersDto } from '../dto/get-folders.dto';
import { FolderService } from '../services/folder.service';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { UpdateFolderDto } from '../dto/update-folder.dto';
import { MoveToFolderDto } from '../dto/move-to-folder.dto';
import { JwtAccessTokenGuard } from '@guards/jwt-access-token.guard';
import { IRequestWithUser } from '@modules/auth/interfaces/request-with-user.interface';

@ApiTags('Folder')
@Controller('folder')
@UseGuards(JwtAccessTokenGuard)
export class FolderController {
	constructor(private readonly folderService: FolderService) {}

	@Post()
	create(
		@Req() req: IRequestWithUser,
		@Body() createFolderDto: CreateFolderDto,
	) {
		const { id: userId } = req.user;

		return this.folderService.create({ userId, createFolderDto });
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
		queryFoldersDto: QueryFoldersDto,
	) {
		const { id: userId } = req.user;

		return this.folderService.findAll({ userId, queryFoldersDto });
	}

	@Get('/root')
	getRootFolders(@Req() req: IRequestWithUser) {
		const { id: userId } = req.user;

		return this.folderService.getRootFolders(userId);
	}

	@Get('/tree')
	async getFolderTree(@Req() req: IRequestWithUser) {
		const { id: userId } = req.user;

		return this.folderService.getFolderTree(userId);
	}

	@Get(':id')
	findOne(@Param('id') id: string, @Req() req: IRequestWithUser) {
		const { id: userId } = req.user;

		return this.folderService.findOne({ id, userId });
	}

	@Get('/inside/:id')
	getInsideFolder(@Param('id') id: string, @Req() req: IRequestWithUser) {
		const { id: userId } = req.user;

		return this.folderService.getInsideFolder({ id, userId });
	}

	@Patch('/move-to-folder')
	moveToFolder(
		@Req() req: IRequestWithUser,
		@Body() moveToFolderDto: MoveToFolderDto,
	) {
		const { id: userId } = req.user;

		return this.folderService.moveToFolder({ userId, moveToFolderDto });
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Req() req: IRequestWithUser,
		@Body() updateFolderDto: UpdateFolderDto,
	) {
		const { id: userId } = req.user;

		return this.folderService.update({ id, userId, updateFolderDto });
	}

	@Delete(':id')
	remove(@Param('id') id: string, @Req() req: IRequestWithUser) {
		const { id: userId } = req.user;

		return this.folderService.remove({ id, userId });
	}

	// @Get('/ancestors/:descendantId')
	// async getAncestors(
	// 	@Req() req: IRequestWithUser,
	// 	@Param('descendantId') descendantId: string,
	// ) {
	// 	const { id: userId } = req.user;

	// 	const data = await this.folderService.getAncestors({
	// 		userId,
	// 		descendantId,
	// 		isGetDescendant: true,
	// 	});

	// 	return convertToNestedObject(descendantId, data);
	// }
}
