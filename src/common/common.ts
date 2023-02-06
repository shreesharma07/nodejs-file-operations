/* eslint-disable no-async-promise-executor */
// ! // Import Modules //
import _ from 'lodash';
import Logger from '../lib/logger';
import axios from 'axios';
import jsonwebtoken from 'jsonwebtoken';
import { jwtParams } from '../interfaces/interfaces';

// @ // Interface Filtered Json //
interface jsonParams {
	payload: any;
	data_type?: string;
}

// @ // Interface Http Request Data //
interface HttpFetchParams {
	url: string;
	method?: string;
	options?: object;
}

// % // Function to Filter Json Data // ( Replace Null & Undefined as Empty String ) //
export const getFilteredJson = async (params: jsonParams) => {
	try {
		// ! // Check for Data Type //
		if (params?.data_type === 'array') {
			return params.payload.map((element: object) => {
				return _.mapValues(element, (value: unknown) => (typeof value === 'boolean' || typeof value === 'number' ? value : value || ''));
			});
		} else {
			return _.mapValues(params.payload, (value: unknown) => (typeof value === 'boolean' || typeof value === 'number' ? value : value || ''));
		}
	} catch (error) {
		Logger.error(error);
		return params?.data_type === 'array' ? [] : {};
	}
};

// % // Function to Request Http Data //
export const requestHttpData = async (params: HttpFetchParams) => {
	try {
		// * // Extract Parameters //
		const url = params.url || '';
		const options = params.options || {};
		const method = params.method?.toUpperCase() || 'GET';

		// ! // Check for Valid Url //
		if (!(url === '')) {
			return await axios({ method: method, url: url, data: options });
		} else {
			throw new Error('Invalid Url');
		}
	} catch (error) {
		Logger.error(error);
		return {};
	}
};

// % // Function to Verify JWT //
export const verifyJWT = (params: jwtParams) => {
	const secret = process.env.JWTSECRET || '';
	// ! // Return Validated Token Response //
	return jsonwebtoken.verify(params.token || '', secret, (err: any, decoded: any) => {
		if (err) {
			Logger.error('Failed to authenticate token.');
			return false;
		}
		return true;
	});
};
