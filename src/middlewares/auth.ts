// ! // Import Module //
import { Request, Response, NextFunction } from 'express';
import { verifyJWT } from '../common/common';
import Logger from '../lib/logger';

// % // Middleware Function For Authenticating Request //
export default function verify(req: Request, res: Response, next: NextFunction) {
	try {
		// * // Extract Token From Headers //
		const token = req.headers['x-access-token'] || req.query['x-access-token'];

		// ! // Check for Valid Token //
		if (!token) {
			return res.status(401).send({ auth: false, message: 'No token provided.' });
		} else {
			// * // Compare Auth Token //
			const textVerified = token === process.env.AUTHTOKEN;
			const validatedToken: any = verifyJWT({ token: token.toString() });
			if (!textVerified && !validatedToken) {
				return res.status(401).send({ auth: false, message: 'Failed to authenticate token.' });
			} else {
				next();
			}
		}
	} catch (error: any) {
		Logger.error(error?.message);
	}
}
