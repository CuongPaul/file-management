import {
	Get,
	Req,
	Res,
	Post,
	Body,
	Patch,
	Param,
	Query,
	Delete,
	UseGuards,
	Controller,
	UploadedFiles,
	ValidationPipe,
	UseInterceptors,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';

import { QueryFilesDto } from '../dto/get-files.dto';
import { CreateFileDto } from '../dto/create-file.dto';
import { FileService } from '../services/file.service';
import { UpdateFileDto } from '../dto/update-file.dto';
import { QueryPreviewFileDto } from '../dto/preview-file.dto';
import { JwtAccessTokenGuard } from '@guards/jwt-access-token.guard';
import { FileUploadInterceptor } from '@interceptors/file-upload.interceptor';
import { IRequestWithUser } from '@modules/auth/interfaces/request-with-user.interface';

@ApiTags('File')
@Controller('file')
@UseGuards(JwtAccessTokenGuard)
export class FileController {
	constructor(private readonly fileService: FileService) {}

	@Post()
	@UseInterceptors(new FileUploadInterceptor(FileController.name))
	@UseInterceptors(FilesInterceptor('files_upload'))
	create(
		@Req() req: IRequestWithUser,
		@Body() createFileDto: CreateFileDto,
		@UploadedFiles() filesUpload: Array<Express.Multer.File>,
	) {
		const { id: userId } = req.user;

		return this.fileService.create({
			userId,
			filesUpload,
			createFileDto,
		});
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
		queryFilesDto: QueryFilesDto,
	) {
		const { id: userId } = req.user;

		return this.fileService.findAll({ userId, queryFilesDto });
	}

	@Get('/root')
	getRootFiles(@Req() req: IRequestWithUser) {
		const { id: userId } = req.user;

		return this.fileService.getRootFiles(userId);
	}

	@Get('/preview')
	previewFile(
		@Res() res: Response,
		@Req() req: IRequestWithUser,
		@Query(
			new ValidationPipe({
				transform: true,
				forbidNonWhitelisted: true,
				transformOptions: { enableImplicitConversion: true },
			}),
		)
		queryPreviewFileDto: QueryPreviewFileDto,
	) {
		const { id: userId } = req.user;
		const { name: filename } = queryPreviewFileDto;

		return this.fileService.previewFile({ res, userId, filename });
	}

	@Get(':id')
	findOne(@Param('id') id: string, @Req() req: IRequestWithUser) {
		const { id: userId } = req.user;

		return this.fileService.findOne({ id, userId });
	}

	@Patch(':id')
	update(
		@Param('id') id: string,
		@Req() req: IRequestWithUser,
		@Body() updateFileDto: UpdateFileDto,
	) {
		const { id: userId } = req.user;

		return this.fileService.update({ id, userId, updateFileDto });
	}

	@Delete(':id')
	remove(@Param('id') id: string, @Req() req: IRequestWithUser) {
		const { id: userId } = req.user;

		return this.fileService.remove({ id, userId });
	}
}
