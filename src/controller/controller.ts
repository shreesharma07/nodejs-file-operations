// ! // Importing Modules //
import { fileParams } from '../interfaces/interfaces';
import { getFiles } from '../tools/tool';

// % // Function to retrieve directory contents //
export const getDirectoryContents = async (params: fileParams) => {
	// ! // Return Promise as Response //
	return new Promise(async (resolve, reject) => {
		// * // Extract Params //
		let { filePath, getList, includeExt } = params;

		// * // Decode File Path //
		filePath = decodeURIComponent(filePath.toString());

		// ! // Check for Valid File Path //
		if (filePath && typeof filePath === 'string') {
			const fileNames = await getFiles({
				filePath: filePath,
				includeExt: includeExt || false,
				getList: getList || false
			});
			resolve(fileNames);
		} else {
			reject('Required Mandatory Params');
		}
	});
};
