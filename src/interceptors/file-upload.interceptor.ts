import {
	Injectable,
	CallHandler,
	NestInterceptor,
	ExecutionContext,
	BadRequestException,
} from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { Observable } from 'rxjs';

import { ERRORS_DICTIONARY } from '@constants/error-dictionary.enum';
import { UPLOAD_FOLDER_NAME } from '@constants/upload-folder.constant';

@Injectable()
export class FileUploadInterceptor implements NestInterceptor {
	constructor(private readonly context: string) {}

	intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
		if (context.getClass().name === this.context) {
			const request = context.switchToHttp().getRequest();

			const filenames = request.files.map(
				(file: Express.Multer.File) => file.originalname,
			);

			const uniqueFilenames = [...new Set(filenames)];

			if (filenames.length !== uniqueFilenames.length) {
				request.files.forEach((file: Express.Multer.File) => {
					const filePath = path.resolve(UPLOAD_FOLDER_NAME, file.filename);

					if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
				});

				throw new BadRequestException({
					detail: 'Duplicate filename',
					message: ERRORS_DICTIONARY.DUPLICATE_FILENAME,
				});
			}
		}

		return next.handle();
	}
}
