import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';

import { AuthService } from '../services/auth.service';
import { ITokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtAccessTokenStrategy extends PassportStrategy(Strategy, 'jwt') {
	constructor(
		private readonly authService: AuthService,
		private readonly configService: ConfigService,
	) {
		super({
			ignoreExpiration: false,
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
		});
	}

	async validate(payload: ITokenPayload) {
		const user = await this.authService.getUserForAccessToken(payload.user_id);

		return { ...user };
	}
}
