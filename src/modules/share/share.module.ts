import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

import Share from './models/share.model';
import { FileModule } from '@modules/file/file.module';
import { UserModule } from '@modules/user/user.module';
import { ShareService } from './services/share.service';
import { FolderModule } from '@modules/folder/folder.module';
import { ShareController } from './controllers/share.controller';
import { FileService } from '@modules/file/services/file.service';
import { UserService } from '@modules/user/services/user.service';
import { FolderService } from '@modules/folder/services/folder.service';

@Module({
	imports: [
		UserModule,
		FileModule,
		FolderModule,
		SequelizeModule.forFeature([Share]),
	],
	controllers: [ShareController],
	providers: [UserService, FileService, FolderService, ShareService],
	exports: [SequelizeModule],
})
export class ShareModule {}
