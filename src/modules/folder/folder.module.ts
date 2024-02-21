import { Module, forwardRef } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import Folder from './models/folder.model';
import { FileModule } from '@modules/file/file.module';
import { FolderService } from './services/folder.service';
import { FileService } from '@modules/file/services/file.service';
import { FolderController } from './controllers/folder.controller';

@Module({
	imports: [forwardRef(() => FileModule), SequelizeModule.forFeature([Folder])],
	controllers: [FolderController],
	providers: [FileService, FolderService],
	exports: [FolderService, SequelizeModule],
})
export class FolderModule {}
