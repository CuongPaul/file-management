import { SequelizeModule } from '@nestjs/sequelize';
import { Module, DynamicModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import File from '../file/models/file.model';
import User from '../user/models/user.model';
import Share from '../share/models/share.model';
import Folder from '../folder/models/folder.model';

@Module({})
export class DatabaseModule {
	static register(): DynamicModule {
		return {
			module: DatabaseModule,
			exports: [ConfigService],
			providers: [ConfigService],
			imports: [
				SequelizeModule.forRootAsync({
					imports: [ConfigModule],
					inject: [ConfigService],
					useFactory: (configService: ConfigService) => ({
						synchronize: true,
						autoLoadModels: true,
						models: [File, User, Share, Folder],
						host: configService.get('DATABASE_HOST'),
						port: configService.get('DATABASE_PORT'),
						database: configService.get('DATABASE_NAME'),
						dialect: configService.get('DATABASE_DIALECT'),
						password: configService.get('DATABASE_PASSWORD'),
						username: configService.get('DATABASE_USERNAME'),
					}),
				}),
			],
		};
	}
}
