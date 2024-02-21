import {
	Inject,
	HttpStatus,
	Injectable,
	HttpException,
	NestMiddleware,
} from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Request, Response, NextFunction } from 'express';

import { BLACK_LIST_TOKEN } from '@constants/black-list-token.enum';

@Injectable()
export class BlackListRefreshTokenMiddleware implements NestMiddleware {
	constructor(
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
	) {}

	async use(req: Request, _res: Response, next: NextFunction) {
		const refreshToken = req.headers.authorization.split('Bearer ')[1];

		if (refreshToken) {
			const isBlackList = await this.cacheManager.get(
				`${BLACK_LIST_TOKEN.REFRESH_TOKEN}: ${refreshToken}`,
			);

			if (isBlackList) {
				throw new HttpException('Refresh token invalid', HttpStatus.FORBIDDEN);
			}
		}

		next();
	}
}
