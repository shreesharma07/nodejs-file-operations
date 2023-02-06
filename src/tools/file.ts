// ! // Import Filesystem //
import * as fs from 'fs';
import * as path from 'path';

// @ // Interface File Params //
export interface fileAttributes {
	filepath: string;
	filename: string;
}

// % // Get File Size //
export const getFilesAttributes = async (params: fileAttributes) => {
	// ! // Return Promise as Response //
	return new Promise(async (resolve, reject) => {
		// * // Extract File Params //
		const { filepath, filename } = params;
		// ! // Check Valid File Attributes //
		if (path && filename) {
			const fullpath = path.join(filepath, filename);
			// * // Open File //
			const file = fs.openSync(fullpath as string, 'r');
			// * // Extract Stats //
			const filedata = fs.fstatSync(file);
			// ! // Close File //
			fs.closeSync(file);
			resolve(filedata);
		} else {
			reject('Missing Required Parameters');
		}
	});
};
