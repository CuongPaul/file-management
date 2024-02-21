import {
	Get,
	Req,
	Body,
	Post,
	Patch,
	UseGuards,
	Controller,
} from '@nestjs/common';

import { SignUpDto } from '../dto/sign-up.dto';
import { AuthService } from '../services/auth.service';
import { LocalAuthGuard } from '@guards/local-auth.guard';
import { JwtAccessTokenGuard } from '@guards/jwt-access-token.guard';
import { JwtRefreshTokenGuard } from '@guards/jwt-refresh-token.guard';
import { IRequestWithUser } from '../interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post('sign-up')
	signUp(@Body() signUpDto: SignUpDto) {
		return this.authService.signUp(signUpDto);
	}

	@UseGuards(LocalAuthGuard)
	@Patch('sign-in')
	signIn(@Req() req: IRequestWithUser) {
		return this.authService.signIn(req.user.id);
	}

	@UseGuards(JwtAccessTokenGuard)
	@Patch('sign-out')
	signOut(@Req() req: IRequestWithUser) {
		return this.authService.signOut(req.user.id);
	}

	@UseGuards(JwtRefreshTokenGuard)
	@Get('refresh-access-token')
	refreshAccessToken(@Req() req: IRequestWithUser) {
		return this.authService.generateAccessToken({ user_id: req.user.id });
	}
}
