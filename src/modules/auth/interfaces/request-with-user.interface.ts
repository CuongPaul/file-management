import { Request } from 'express';

import User from '@modules/user/models/user.model';

export interface IRequestWithUser extends Request {
	user: User;
}
