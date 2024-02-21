import {
	Inject,
	forwardRef,
	Injectable,
	BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Op } from 'sequelize';
import { Response } from 'express';
import { InjectModel } from '@nestjs/sequelize';

import File from '../models/file.model';
// import { S3Service } from '@services/s3.service';
import { QueryFilesDto } from '../dto/get-files.dto';
import { CreateFileDto } from '../dto/create-file.dto';
import { UpdateFileDto } from '../dto/update-file.dto';
import { ERRORS_DICTIONARY } from '@constants/error-dictionary.enum';
import { UPLOAD_FOLDER_NAME } from '@constants/upload-folder.constant';
import { FolderService } from '@modules/folder/services/folder.service';

@Injectable()
export class FileService {
	constructor(
		// private readonly s3Service: S3Service,
		@InjectModel(File)
		private readonly fileModel: typeof File,
		@Inject(forwardRef(() => FolderService))
		private readonly folderService: FolderService,
	) {}

	async create({
		userId,
		filesUpload,
		createFileDto,
	}: {
		userId: string;
		createFileDto: CreateFileDto;
		filesUpload: Array<Express.Multer.File>;
	}): Promise<File[]> {
		const { folder_id } = createFileDto;

		if (folder_id) {
			const folder = await this.folderService.findOne({
				userId,
				id: folder_id,
			});
			if (!folder) {
				throw new BadRequestException({
					detail: "Folder doesn't exist",
					message: ERRORS_DICTIONARY.FOLDER_NOT_FOUND,
				});
			}
		}

		// const files = [];
		// for (let i = 0; i < filesUpload.length; i++) {
		// 	const url = await this.s3Service.uploadFile(
		// 		`common/${filesUpload[i].filename}`,
		// 		filesUpload[i],
		// 	);

		// 	files.push({
		// 		url,
		// 		user_id: userId,
		// 		...createFileDto,
		// 		size: filesUpload[i].size,
		// 		name: filesUpload[i].filename,
		// 		type: filesUpload[i].mimetype,
		// 	});
		// }

		// return this.fileModel.bulkCreate(files);

		const userFolderPath = path.resolve(UPLOAD_FOLDER_NAME, userId);
		if (!fs.existsSync(userFolderPath)) {
			fs.mkdirSync(userFolderPath, { recursive: true });
		}

		const files = filesUpload.map((item) => {
			let { originalname } = item;
			let filePath = path.resolve(userFolderPath, originalname);

			if (fs.existsSync(filePath)) {
				const suffix = `-${Date.now()}`;

				filePath = filePath.replace(/\.[^/.]+$/, suffix + '$&');
				originalname = originalname.replace(/\.[^/.]+$/, suffix + '$&');
			}
			fs.renameSync(item.path, filePath);

			return {
				url: filePath,
				size: item.size,
				user_id: userId,
				...createFileDto,
				name: originalname,
				type: item.mimetype,
			};
		});

		return this.fileModel.bulkCreate(files);
	}

	findAll({
		userId,
		queryFilesDto,
	}: {
		userId: string;
		queryFilesDto: QueryFilesDto & { folder_id?: string };
	}): Promise<File[]> {
		const newQuery = {
			...queryFilesDto,
			...(queryFilesDto?.name
				? { name: { [Op.iLike]: `%${queryFilesDto.name}%` } }
				: {}),
		};

		return this.fileModel.findAll({
			where: { user_id: userId, ...newQuery },
		});
	}

	getRootFiles(userId: string): Promise<File[]> {
		return this.fileModel.findAll({
			where: { user_id: userId, folder_id: null },
		});
	}

	async previewFile({
		res,
		userId,
		filename,
	}: {
		res: Response;
		userId: string;
		filename: string;
	}): Promise<any> {
		const file = await this.fileModel.findOne({
			where: { name: filename, user_id: userId },
		});
		if (!file) {
			throw new BadRequestException({
				detail: "File doesn't exist",
				message: ERRORS_DICTIONARY.FILE_NOT_FOUND,
			});
		}

		const filePath = path.resolve(UPLOAD_FOLDER_NAME, `${userId}/${filename}`);
		if (!fs.existsSync(filePath)) {
			throw new BadRequestException({
				detail: "File isn't stored",
				message: ERRORS_DICTIONARY.FILE_NOT_STORED,
			});
		}

		return res.sendFile(filePath);
	}

	async findOne({
		id,
		userId,
	}: {
		id: string;
		userId: string;
	}): Promise<null | File> {
		const file = await this.fileModel.findOne({
			where: { id, user_id: userId },
		});
		if (!file) {
			throw new BadRequestException({
				detail: "File doesn't exist",
				message: ERRORS_DICTIONARY.FILE_NOT_FOUND,
			});
		}

		return file;
	}

	async update({
		id,
		userId,
		updateFileDto,
	}: {
		id: string;
		userId: string;
		updateFileDto: UpdateFileDto;
	}): Promise<File> {
		const file = await this.fileModel.findOne({
			where: { id, user_id: userId },
		});
		if (!file) {
			throw new BadRequestException({
				detail: "File doesn't exist",
				message: ERRORS_DICTIONARY.FILE_NOT_FOUND,
			});
		}

		const { folder_id } = updateFileDto;
		if (folder_id) {
			const folder = await this.folderService.findOne({
				userId,
				id: folder_id,
			});
			if (!folder) {
				throw new BadRequestException({
					detail: "Folder doesn't exist",
					message: ERRORS_DICTIONARY.FOLDER_NOT_FOUND,
				});
			}
		}

		return file.update(updateFileDto);
	}

	async remove({ id, userId }: { id: string; userId: string }): Promise<void> {
		const file = await this.fileModel.findOne({
			where: { id, user_id: userId },
		});
		if (!file) {
			throw new BadRequestException({
				detail: "File doesn't exist",
				message: ERRORS_DICTIONARY.FILE_NOT_FOUND,
			});
		}

		this.deleteFileStored({ userId, filename: file.name });

		await file.destroy();
	}

	deleteFileStored({
		userId,
		filename,
	}: {
		userId: string;
		filename: string;
	}): void {
		const filePath = path.resolve(UPLOAD_FOLDER_NAME, `${userId}/${filename}`);

		if (fs.existsSync(filePath)) {
			fs.unlinkSync(filePath);
		}
	}
}
