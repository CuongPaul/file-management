import { CacheModule } from '@nestjs/cache-manager';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { Module, RequestMethod, MiddlewareConsumer } from '@nestjs/common';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { EnvModule } from './modules/env/env.module';
import { AuthModule } from '@modules/auth/auth.module';
import { FileModule } from '@modules/file/file.module';
import { UserModule } from '@modules/user/user.module';
import { ShareModule } from '@modules/share/share.module';
import { FolderModule } from '@modules/folder/folder.module';
import { DatabaseModule } from './modules/database/database.module';
import { TransformInterceptor } from '@interceptors/transform.interceptor';
import { GlobalExceptionFilter } from '@exception-filters/global-exception.filter';
import { BlackListRefreshTokenMiddleware } from '@middleware/black-list-refresh-token.middleware';

@Module({
	imports: [
		AuthModule,
		FileModule,
		UserModule,
		ShareModule,
		FolderModule,
		EnvModule.register(),
		DatabaseModule.register(),
		CacheModule.register({ isGlobal: true }),
	],
	controllers: [AppController],
	providers: [
		AppService,
		{ provide: APP_FILTER, useClass: GlobalExceptionFilter },
		{ provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
	],
})
export class AppModule {
	configure(consumer: MiddlewareConsumer) {
		consumer.apply(BlackListRefreshTokenMiddleware).forRoutes({
			method: RequestMethod.GET,
			path: 'auth/refresh-access-token',
		});
	}
}
