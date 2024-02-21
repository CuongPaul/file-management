import {
	Injectable,
	CallHandler,
	NestInterceptor,
	ExecutionContext,
} from '@nestjs/common';
import { map } from 'rxjs/operators';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
	intercept(_context: ExecutionContext, next: CallHandler) {
		return next
			.handle()
			.pipe(map((data) => ({ data, statusCode: 0, message: 'success' })));
	}
}
