import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { AuthService } from '../services/auth.service';
import { ITokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtRefreshTokenStrategy extends PassportStrategy(
	Strategy,
	'refresh_token',
) {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {
		super({
			ignoreExpiration: false,
			passReqToCallback: true,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
		});
	}

	validate(request: Request, payload: ITokenPayload) {
		return this.authService.getUserForRefreshToken({
			userId: payload.user_id,
			refreshToken: request.headers.authorization.split('Bearer ')[1],
		});
	}
}
