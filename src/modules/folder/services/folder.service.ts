import {
	Inject,
	forwardRef,
	Injectable,
	BadRequestException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import Folder from '../models/folder.model';

import File from '@modules/file/models/file.model';
import { QueryFoldersDto } from '../dto/get-folders.dto';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { UpdateFolderDto } from '../dto/update-folder.dto';
import { MoveToFolderDto } from '../dto/move-to-folder.dto';
import { FileService } from '@modules/file/services/file.service';
import { ERRORS_DICTIONARY } from '@constants/error-dictionary.enum';
import { IParentFolder } from '../interfaces/parent-folder.interface';
import { convertToNestedArray } from '@utils/convert-to-nested-structure.function';

@Injectable()
export class FolderService {
	constructor(
		private readonly sequelize: Sequelize,
		@Inject(forwardRef(() => FileService))
		private readonly fileService: FileService,
		@InjectModel(Folder)
		private readonly folderModel: typeof Folder,
	) {}

	async create({
		userId,
		createFolderDto,
	}: {
		userId: string;
		createFolderDto: CreateFolderDto;
	}): Promise<Folder> {
		const { parent_folder_id } = createFolderDto;

		if (parent_folder_id) {
			const parentFolder = await this.folderModel.findOne({
				where: { user_id: userId, id: parent_folder_id },
			});
			if (!parentFolder) {
				throw new BadRequestException({
					detail: "Folder doesn't exist",
					message: ERRORS_DICTIONARY.FOLDER_NOT_FOUND,
				});
			}
		}

		return this.folderModel.create({ ...createFolderDto, user_id: userId });
	}

	findAll({
		userId,
		queryFoldersDto,
	}: {
		userId: string;
		queryFoldersDto: QueryFoldersDto;
	}): Promise<Folder[]> {
		const newQuery = {
			...queryFoldersDto,
			...(queryFoldersDto?.name
				? { name: { [Op.iLike]: `%${queryFoldersDto.name}%` } }
				: {}),
		};

		return this.folderModel.findAll({
			where: { user_id: userId, ...newQuery },
		});
	}

	getRootFolders(userId: string): Promise<Folder[]> {
		return this.folderModel.findAll({
			where: { user_id: userId, parent_folder_id: null },
		});
	}

	async getFolderTree(userId: string): Promise<any> {
		const rootFolders = await this.getRootFolders(userId);

		const result = [];
		for (let i = 0; i < rootFolders.length; i++) {
			const descendants = await this.getDescendants({
				userId,
				isGetAncestor: true,
				ancestorId: rootFolders[i].id,
			});

			result.push(convertToNestedArray(descendants));
		}

		return result;
	}

	async findOne({
		id,
		userId,
	}: {
		id: string;
		userId: string;
	}): Promise<null | Folder> {
		const folder = await this.folderModel.findOne({
			where: { id, user_id: userId },
		});
		if (!folder) {
			throw new BadRequestException({
				detail: "Folder doesn't exist",
				message: ERRORS_DICTIONARY.FOLDER_NOT_FOUND,
			});
		}

		return folder;
	}

	async getInsideFolder({
		id,
		userId,
	}: {
		id: string;
		userId: string;
	}): Promise<{ files: File[]; folders: Folder[] }> {
		const folder = await this.folderModel.findOne({
			where: { id, user_id: userId },
		});
		if (!folder) {
			throw new BadRequestException({
				detail: "Folder doesn't exist",
				message: ERRORS_DICTIONARY.FOLDER_NOT_FOUND,
			});
		}

		const files = await this.fileService.findAll({
			userId,
			queryFilesDto: { folder_id: id },
		});

		const folders = await this.folderModel.findAll({
			where: { user_id: userId, parent_folder_id: id },
		});

		return { files, folders };
	}

	async moveToFolder({
		userId,
		moveToFolderDto,
	}: {
		userId: string;
		moveToFolderDto: MoveToFolderDto;
	}): Promise<Folder> {
		const { id, parent_folder_id } = moveToFolderDto;

		const folder = await this.folderModel.findOne({
			where: { id, user_id: userId },
		});
		if (!folder) {
			throw new BadRequestException({
				detail: "Folder doesn't exist",
				message: ERRORS_DICTIONARY.FOLDER_NOT_FOUND,
			});
		}

		const parentFolder = await this.folderModel.findOne({
			where: { user_id: userId, id: parent_folder_id },
		});
		if (!parentFolder) {
			throw new BadRequestException({
				detail: "Folder doesn't exist",
				message: ERRORS_DICTIONARY.FOLDER_NOT_FOUND,
			});
		}

		const descendantFolders = await this.getDescendants({
			userId,
			ancestorId: id,
		});
		if (descendantFolders.some((item) => item.id === parent_folder_id)) {
			throw new BadRequestException("Don't move to descendant folder");
		}

		return folder.update({ parent_folder_id });
	}

	async update({
		id,
		userId,
		updateFolderDto,
	}: {
		id: string;
		userId: string;
		updateFolderDto: UpdateFolderDto;
	}): Promise<Folder> {
		const folder = await this.folderModel.findOne({
			where: { id, user_id: userId },
		});
		if (!folder) {
			throw new BadRequestException({
				detail: "Folder doesn't exist",
				message: ERRORS_DICTIONARY.FOLDER_NOT_FOUND,
			});
		}

		return folder.update(updateFolderDto);
	}

	async remove({ id, userId }: { id: string; userId: string }): Promise<void> {
		const folder = await this.folderModel.findOne({
			where: { id, user_id: userId },
		});
		if (!folder) {
			throw new BadRequestException({
				detail: "Folder doesn't exist",
				message: ERRORS_DICTIONARY.FOLDER_NOT_FOUND,
			});
		}

		const descendantFolders = await this.getDescendants({
			userId,
			ancestorId: id,
			isGetAncestor: true,
		});
		for (let i = 0; i < descendantFolders.length; i++) {
			const files = await this.fileService.findAll({
				userId,
				queryFilesDto: { folder_id: descendantFolders[i].id },
			});

			for (let j = 0; j < files.length; j++) {
				this.fileService.deleteFileStored({ userId, filename: files[j].name });
			}
		}

		await this.folderModel.destroy({
			where: { id: descendantFolders.map((item) => item.id) },
		});
	}

	async getDescendants({
		userId,
		ancestorId,
		isGetAncestor = false,
	}: {
		userId: string;
		ancestorId: string;
		isGetAncestor?: boolean;
	}): Promise<IParentFolder[]> {
		const [results] = await this.sequelize.query(`WITH RECURSIVE cte AS (
			SELECT id, name, parent_folder_id FROM folder WHERE id = '${ancestorId}' AND user_id = '${userId}'
			UNION ALL
			SELECT m.id, m.name, m.parent_folder_id FROM folder m JOIN cte ON m.parent_folder_id = cte.id
		) SELECT id, name, parent_folder_id FROM cte ${
			isGetAncestor ? '' : `WHERE id != '${ancestorId}'`
		};`);

		return results as IParentFolder[];
	}

	// async getAncestors({
	// 	userId,
	// 	descendantId,
	// 	isGetDescendant = false,
	// }: {
	// 	userId: string;
	// 	isGetDescendant?: boolean;
	// 	descendantId: string;
	// }): Promise<IParentFolder[]> {
	// 	const [results] = await this.sequelize.query(`WITH RECURSIVE cte AS (
	// 		SELECT id, name, parent_folder_id FROM folder WHERE id = '${descendantId}' AND user_id = '${userId}'
	// 		UNION ALL
	// 		SELECT m.id, m.name, m.parent_folder_id FROM folder m JOIN cte ON m.id = cte.parent_folder_id
	// 	) SELECT id, name, parent_folder_id FROM cte ${
	// 		isGetDescendant ? '' : `WHERE id != '${descendantId}'`
	// 	};`);

	// 	return results as IParentFolder[];
	// }
}
