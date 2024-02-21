import { InjectModel } from '@nestjs/sequelize';
import { Injectable, BadRequestException } from '@nestjs/common';

import Share from '../models/share.model';
import { QuerySharesDto } from '../dto/get-shares.dto';
import { CreateShareDto } from '../dto/create-share.dto';
import { UpdateShareDto } from '../dto/update-share.dto';
import { FileService } from '@modules/file/services/file.service';
import { UserService } from '@modules/user/services/user.service';
import { ERRORS_DICTIONARY } from '@constants/error-dictionary.enum';
import { FolderService } from '@modules/folder/services/folder.service';

@Injectable()
export class ShareService {
	constructor(
		@InjectModel(Share)
		private readonly shareModel: typeof Share,
		private readonly fileService: FileService,
		private readonly userService: UserService,
		private readonly folderService: FolderService,
	) {}

	async create({
		userId,
		createShareDto,
	}: {
		userId: string;
		createShareDto: CreateShareDto;
	}) {
		const { file_id, folder_id, consumer_id } = createShareDto;

		if (!file_id && !folder_id) {
			throw new BadRequestException('File or folder is required');
		}

		if (file_id) {
			const file = await this.fileService.findOne({ userId, id: file_id });
			if (!file) {
				throw new BadRequestException({
					detail: "File doesn't exist",
					message: ERRORS_DICTIONARY.FILE_NOT_FOUND,
				});
			}
		} else {
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

		const consumer = await this.userService.findOneByCondition({
			id: consumer_id,
		});
		if (!consumer) {
			throw new BadRequestException({
				detail: "User doesn't exist",
				message: ERRORS_DICTIONARY.USER_NOT_FOUND,
			});
		}

		return this.shareModel.create({ ...createShareDto, user_id: userId });
	}

	findAll({
		userId,
		querySharesDto,
	}: {
		userId: string;
		querySharesDto: QuerySharesDto;
	}): Promise<Share[]> {
		return this.shareModel.findAll({
			where: { ...querySharesDto, user_id: userId },
		});
	}

	async findOne({
		id,
		userId,
	}: {
		id: string;
		userId: string;
	}): Promise<Share | null> {
		const share = await this.shareModel.findOne({
			where: { id, user_id: userId },
		});
		if (!share) {
			throw new BadRequestException({
				detail: "Share doesn't exist",
				message: ERRORS_DICTIONARY.SHARE_NOT_FOUND,
			});
		}

		return share;
	}

	async update({
		id,
		userId,
		updateShareDto,
	}: {
		id: string;
		userId: string;
		updateShareDto: UpdateShareDto;
	}): Promise<Share> {
		const share = await this.shareModel.findOne({
			where: { id, user_id: userId },
		});
		if (!share) {
			throw new BadRequestException({
				detail: "Share doesn't exist",
				message: ERRORS_DICTIONARY.SHARE_NOT_FOUND,
			});
		}

		return share.update(updateShareDto);
	}

	async remove({ id, userId }: { id: string; userId: string }): Promise<void> {
		const share = await this.shareModel.findOne({
			where: { id, user_id: userId },
		});
		if (!share) {
			throw new BadRequestException({
				detail: "Share doesn't exist",
				message: ERRORS_DICTIONARY.SHARE_NOT_FOUND,
			});
		}

		await share.destroy();
	}
}
