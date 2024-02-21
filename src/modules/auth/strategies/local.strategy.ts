import { Strategy } from 'passport-local';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';

import { AuthService } from '../services/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy, 'local') {
	constructor(private readonly authService: AuthService) {
		super({ usernameField: 'email' });
	}

	validate(email: string, password: string) {
		return this.authService.getUserForLocalAuthen({ email, password });
	}
}
