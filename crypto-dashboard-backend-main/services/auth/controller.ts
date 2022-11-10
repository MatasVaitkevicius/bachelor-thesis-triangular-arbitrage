import { recoverPersonalSignature } from 'eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import { NextFunction, Request, Response } from 'express';

import jwt from 'jsonwebtoken';
import { config } from '../../config';

let User = require('../../models/User');

export const create = (req: Request, res: Response, next: NextFunction) => {
	const { signature, publicAddress } = req.body;
  console.log(signature)
	if (!signature || !publicAddress)
		return res
			.status(400)
			.send({ error: 'Request should have signature and publicAddress' });

	return (
		User.findOne({ publicAddress: publicAddress })
			.then((user: typeof User | null) => {
				if (!user) {
					res.status(401).send({
						error: `User with publicAddress ${publicAddress} is not found in database`,
					});

					return null;
				}

				return user;
			})
			.then((user: typeof User | null) => {
				if (!(user instanceof User)) {
					// Should not happen, we should have already sent the response
					throw new Error(
						'User is not defined in "Verify digital signature".'
					);
				}

				const msg = `I am signing my one-time nonce: ${user.nonce}`;

				const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
				const address = recoverPersonalSignature({
					data: msgBufferHex,
					sig: signature,
				});

				if (address.toLowerCase() === publicAddress.toLowerCase()) {
					return user;
				} else {
					res.status(401).send({
						error: 'Signature verification failed',
					});

					return null;
				}
			})
			.then((user: typeof User | null) => {
				if (!(user instanceof User)) {
					// Should not happen, we should have already sent the response
					throw new Error(
						'User is not defined in "Generate a new nonce for the user".'
					);
				}

				user.nonce = Math.floor(Math.random() * 10000);
				return user.save();
			})
			.then((user: typeof User) => {
				return new Promise<string>((resolve, reject) =>
					jwt.sign(
						{
							payload: {
								id: user.id,
								publicAddress,
							},
						},
						config.secret,
						{
							algorithm: config.algorithms[0],
						},
						(err: any, token: any) => {
							if (err) {
								return reject(err);
							}
							if (!token) {
								return new Error('Empty token');
							}
							return resolve(token);
						}
					)
				);
			})
			.then((accessToken: string) => res.json({ accessToken }))
			.catch(next)
	);
};