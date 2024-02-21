import {
	Catch,
	ArgumentsHost,
	HttpException,
	ExceptionFilter,
} from '@nestjs/common';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
	constructor(private readonly configService: ConfigService) {}

	catch(exception: any, host: ArgumentsHost) {
		const ctx = host.switchToHttp();
		const response = ctx.getResponse<Response>();

		const status =
			exception instanceof HttpException ? exception.getStatus() : 500;
		const message =
			exception instanceof HttpException
				? exception.message
				: 'Internal server error';

		response.status(status).json({
			message,
			statusCode: status,
			error:
				this.configService.get('NODE_ENV') === 'production'
					? null
					: { stack: exception.stack, response: exception.response },
		});
	}
}
