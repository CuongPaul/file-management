import { Op } from 'sequelize';
import { InjectModel } from '@nestjs/sequelize';
import { Injectable, BadRequestException } from '@nestjs/common';

import User from '../models/user.model';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { ERRORS_DICTIONARY } from '@constants/error-dictionary.enum';

@Injectable()
export class UserService {
	constructor(
		@InjectModel(User)
		private readonly userModel: typeof User,
	) {}

	async create(
		createUserDto: CreateUserDto,
		optionsReturning?: { excludeFields?: string[] },
	): Promise<User> {
		const user = await this.userModel.create({ ...createUserDto });

		const { dataValues } = user;
		if (optionsReturning?.excludeFields) {
			optionsReturning.excludeFields.forEach((item) => delete dataValues[item]);
		}

		return user;
	}

	findAll(
		{
			userId,
			condition,
		}: { userId: string; condition: { email?: string; username?: string } },
		optionsReturning?: { excludeFields?: string[] },
	): Promise<User[]> {
		const { email, username } = condition;

		if (!email && !username) {
			throw new BadRequestException('Email or username is required');
		}

		const newCondition = {
			...condition,
			id: { [Op.ne]: userId },
			...(email ? { email: { [Op.iLike]: `%${email}%` } } : {}),
			...(username ? { username: { [Op.iLike]: `%${username}%` } } : {}),
		};

		return this.userModel.findAll({
			where: newCondition,
			...(optionsReturning?.excludeFields
				? { attributes: { exclude: optionsReturning.excludeFields } }
				: {}),
		});
	}

	findOneByCondition(
		condition: { id?: string; email?: string; refresh_token?: string },
		optionsReturning?: { excludeFields?: string[] },
	): Promise<null | User> {
		return this.userModel.findOne({
			raw: true,
			where: condition,
			...(optionsReturning?.excludeFields
				? { attributes: { exclude: optionsReturning.excludeFields } }
				: {}),
		});
	}

	async update(
		id: string,
		updateUserDto: UpdateUserDto & { refresh_token?: string },
		optionsReturning?: { excludeFields?: string[] },
	): Promise<User> {
		const user = await this.userModel.findOne({ where: { id } });
		if (!user) {
			throw new BadRequestException({
				detail: "User doesn't exist",
				message: ERRORS_DICTIONARY.USER_NOT_FOUND,
			});
		}

		await user.update(updateUserDto);

		const { dataValues } = user;
		if (optionsReturning?.excludeFields) {
			optionsReturning.excludeFields.forEach((item) => delete dataValues[item]);
		}

		return user;
	}
}
