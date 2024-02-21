import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';
// import { configSwagger } from './swagger/api-docs.config';

async function bootstrap() {
	const logger = new Logger(bootstrap.name);

	const app = await NestFactory.create(AppModule);

	const configService = app.get(ConfigService);

	const port = configService.get('API_PORT');

	// configSwagger(app);

	app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

	await app.listen(port, () => logger.log(`Listening on port ${port}`));
}

bootstrap();
