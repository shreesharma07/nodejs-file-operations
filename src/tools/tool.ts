// ! // Importing Files //
import fs from 'fs';
import path from 'path';

// ! // Import Logger //
import Logger from '../lib/logger';
import { fileParams } from '../interfaces/interfaces';

// % Function to Retrieve Files Name in a Folder //
export const getFiles = async (params: fileParams) => {
	try {
		const { filePath, getList, includeExt } = params;
		const extractParams: any = {};

		// ! // Check Param to Include File Extensions //
		if (includeExt) {
			extractParams['withFileTypes'] = includeExt;
		}
		if (filePath !== '' && fs.existsSync(filePath)) {
			// ! // Return Promise as Response //
			return new Promise((resolve, reject) => {
				const files = fs.readdirSync(filePath, extractParams);
				const returnData: any = { totalFiles: files.length };

				// ! // Check Param to Return FileNames
				if (getList) {
					returnData['files'] = files;
				}
				resolve(returnData);
			});
		} else {
			throw new Error('Enter Valid File Path');
		}
	} catch (error: any) {
		Logger.error(error?.message);
		return error?.message || '';
	}
};
