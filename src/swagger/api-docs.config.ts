import { INestApplication } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

export function configSwagger(app: INestApplication) {
	const config = new DocumentBuilder()
		.setTitle('File management project')
		.setDescription('## The file management API description')
		.setVersion('1.0')
		.build();

	const document = SwaggerModule.createDocument(app, config);

	SwaggerModule.setup('api-docs', app, document, {
		swaggerOptions: { persistAuthorization: true },
	});
}
