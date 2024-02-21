import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MulterModule } from '@nestjs/platform-express';

import File from './models/file.model';
import { S3Service } from '@services/s3.service';
import { FileService } from './services/file.service';
import { FolderModule } from '@modules/folder/folder.module';
import { FileController } from './controllers/file.controller';
import { UPLOAD_FOLDER_NAME } from '@constants/upload-folder.constant';
import { FolderService } from '@modules/folder/services/folder.service';

@Module({
	imports: [
		forwardRef(() => FolderModule),
		SequelizeModule.forFeature([File]),
		MulterModule.register({ dest: `./${UPLOAD_FOLDER_NAME}` }),
	],
	controllers: [FileController],
	providers: [S3Service, FileService, FolderService],
	exports: [FileService, SequelizeModule],
})
export class FileModule {}
