import {
	Inject,
	Injectable,
	ConflictException,
	BadRequestException,
} from '@nestjs/common';
import { pick } from 'lodash';
import * as bcrypt from 'bcryptjs';
import { Cache } from 'cache-manager';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { SignUpDto } from '../dto/sign-up.dto';
import User from '@modules/user/models/user.model';
import { UserService } from '@modules/user/services/user.service';
import { BLACK_LIST_TOKEN } from '@constants/black-list-token.enum';
import { ERRORS_DICTIONARY } from '@constants/error-dictionary.enum';
import { ITokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class AuthService {
	private readonly SALT_ROUND = 11;

	constructor(
		@Inject(CACHE_MANAGER)
		private readonly cacheManager: Cache,
		private readonly jwtService: JwtService,
		private readonly userService: UserService,
		private readonly configService: ConfigService,
	) {}

	async signUp(signUpDto: SignUpDto): Promise<User> {
		const { email, password } = signUpDto;

		const existedEmail = await this.userService.findOneByCondition({ email });
		if (existedEmail) throw new ConflictException('Email already in use!');

		const hashedPassword = await bcrypt.hash(password, this.SALT_ROUND);
		const user = await this.userService.create(
			{ ...signUpDto, password: hashedPassword },
			{ excludeFields: ['password', 'refresh_token'] },
		);

		return user;
	}

	async signIn(
		userId: string,
	): Promise<{ access_token: string; refresh_token: string }> {
		const accessToken = this.generateAccessToken({ user_id: userId });
		const refreshToken = this.generateRefreshToken({ user_id: userId });

		await this.userService.update(userId, { refresh_token: refreshToken });

		return { access_token: accessToken, refresh_token: refreshToken };
	}

	async signOut(userId: string): Promise<void> {
		const user = await this.userService.findOneByCondition({ id: userId });
		if (!user) {
			throw new BadRequestException({
				detail: "User doesn't exist",
				message: ERRORS_DICTIONARY.USER_NOT_FOUND,
			});
		}

		const currentTime = Math.floor(Date.now() / 1000);
		const decodedRefreshToken = this.jwtService.decode(user.refresh_token);

		const ttl = decodedRefreshToken.exp - currentTime;
		if (ttl > 0) {
			await this.cacheManager.set(
				`${BLACK_LIST_TOKEN.REFRESH_TOKEN}: ${user.refresh_token}`,
				userId,
				decodedRefreshToken.exp - currentTime,
			);
		}

		await this.userService.update(userId, { refresh_token: null });
	}

	async getUserForLocalAuthen({
		email,
		password,
	}: {
		email: string;
		password: string;
	}): Promise<User> {
		const user = await this.userService.findOneByCondition({ email });
		if (!user) {
			throw new BadRequestException({
				detail: "User doesn't exist",
				message: ERRORS_DICTIONARY.USER_NOT_FOUND,
			});
		}

		const isMatching = await bcrypt.compare(password, user.password);
		if (!isMatching) throw new BadRequestException();

		const data = pick(user, [
			'id',
			'email',
			'username',
			'created_at',
			'updated_at',
		]) as User;

		return data;
	}

	async getUserForAccessToken(userId: string): Promise<User> {
		const user = await this.userService.findOneByCondition(
			{ id: userId },
			{ excludeFields: ['password', 'refresh_token'] },
		);
		if (!user) {
			throw new BadRequestException({
				detail: "User doesn't exist",
				message: ERRORS_DICTIONARY.USER_NOT_FOUND,
			});
		}

		return user;
	}

	async getUserForRefreshToken({
		userId,
		refreshToken,
	}: {
		userId: string;
		refreshToken: string;
	}): Promise<User> {
		const user = await this.userService.findOneByCondition(
			{ id: userId, refresh_token: refreshToken },
			{ excludeFields: ['password', 'refresh_token'] },
		);
		if (!user) {
			throw new BadRequestException({
				detail: "User doesn't exist",
				message: ERRORS_DICTIONARY.USER_NOT_FOUND,
			});
		}

		return user;
	}

	generateAccessToken(payload: ITokenPayload): string {
		return this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET_KEY'),
			expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME'),
		});
	}

	generateRefreshToken(payload: ITokenPayload): string {
		return this.jwtService.sign(payload, {
			secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET_KEY'),
			expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRATION_TIME'),
		});
	}
}
