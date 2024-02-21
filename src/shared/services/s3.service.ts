import * as AWS from 'aws-sdk';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3Service {
	private readonly s3: AWS.S3;

	constructor(private readonly configService: ConfigService) {
		this.s3 = new AWS.S3({
			accessKeyId: this.configService.get('AWS_S3_ACCESS_KEY_ID'),
			secretAccessKey: this.configService.get('AWS_S3_SECRET_ACCESS_KEY'),
		});
	}

	async uploadFile(key: string, file: Express.Multer.File): Promise<string> {
		const params = {
			Key: key,
			Body: file.buffer,
			ContentType: file.mimetype,
			Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
		};

		const result = await this.s3.upload(params).promise();

		return result.Location;
	}

	deleteFile(key: string): void {
		const params = {
			Key: key,
			Bucket: this.configService.get('AWS_S3_BUCKET_NAME'),
		};

		this.s3.deleteObject(params);
	}
}
