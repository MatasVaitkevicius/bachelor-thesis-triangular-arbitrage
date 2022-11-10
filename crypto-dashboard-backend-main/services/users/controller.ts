import { NextFunction, Request, Response } from 'express';

let User = require('../../models/User');

export const find = (req: Request, res: Response, next: NextFunction) => {
      if(typeof req.query.publicAddress != 'undefined') {
        return User.find({ publicAddress: { $eq: req.query.publicAddress ?? null } })
		    .then((users: typeof User[]) => res.json(users))
		    .catch(next);
      } else {
        return User.find()
		    .then((users: typeof User[]) => res.json(users))
		    .catch(next);
      }
};

export const get = (req: Request, res: Response, next: NextFunction) => {
	if ((req as any).user.payload.id !== +req.params.userId) {
		return res
			.status(401)
			.send({ error: 'You can can only access yourself' });
	}
	return User.findByPk(req.params.userId)
		.then((user: typeof User | null) => res.json(user))
		.catch(next);
};

export const create = (req: Request, res: Response, next: NextFunction) =>
	User.create(req.body)
		.then((user: typeof User) => res.json(user))
		.catch(next);

export const patch = (req: Request, res: Response, next: NextFunction) => {
	if ((req as any).user.payload.id !== +req.params.userId) {
		return res
			.status(401)
			.send({ error: 'You can can only access yourself' });
	}
	return User.findByPk(req.params.userId)
		.then((user: typeof User | null) => {
			if (!user) {
				return user;
			}

			Object.assign(user, req.body);
			return user.save();
		})
		.then((user: typeof User | null) => {
			return user
				? res.json(user)
				: res.status(401).send({
						error: `User with publicAddress ${req.params.userId} is not found in database`,
				  });
		})
		.catch(next);
};