import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Injectable, ExecutionContext } from '@nestjs/common';

import { IS_PUBLIC_API } from '@decorators/public-api.decorator';

@Injectable()
export class JwtAccessTokenGuard extends AuthGuard('jwt') {
	constructor(private readonly reflector: Reflector) {
		super();
	}

	canActivate(
		context: ExecutionContext,
	): boolean | Promise<boolean> | Observable<boolean> {
		const isPublicAPI = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_API,
			[context.getHandler(), context.getClass()],
		);

		if (isPublicAPI) return true;

		return super.canActivate(context);
	}
}
