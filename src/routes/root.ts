/* eslint-disable prettier/prettier */
// ! // Importing Modules //
import express, { Router, Request, Response } from 'express';
import Logger from '../lib/logger';
// import verify from "../middlewares/auth";
import { getDirectoryContents } from '../controller/controller';
import { getFilesAttributes } from '../tools/file';
import { joiSchema } from '../schema/schema';
import * as fs from 'fs';
import * as _ from 'lodash';
import { createSmallerChunks } from '../common/common';
import * as path from 'path';

// * // Initialize Router //
const router: Router = express.Router();

// * // Root Route //
router.get('/', (req: Request, res: Response) => {
	res.status(200).json({
		success: true,
		message: 'Welcome to Nodejs Ts File-Ops 🐼'
	});
});

// * // Get File Names //
router.post('/getFiles', async (req: Request, res: Response) => {
	try {
		// * // Extract Params //
		let { filePath, getList, includeExt } = req.body;

		// * // Decode File Path //
		filePath = decodeURIComponent(filePath.toString());

		// ! // Check for Valid File Path //
		if (filePath && typeof filePath === 'string') {
			const fileNames = await getDirectoryContents({ filePath: filePath, includeExt: includeExt || false, getList: getList || false });
			res.status(200).send(fileNames);
		} else {
			throw new Error('Required Mandatory Params');
		}
	} catch (error: any) {
		Logger.error(error?.message);
		return res.status(500).send({ status: false, message: error?.message || '' });
	}
});

// * // Get File Attributes //
router.post('/getFileAttrib', async (req: Request, res: Response) => {
	try {
		// * // Extract Params //
		let { filepath, filename } = req.body;
		// * // Decode File Path //
		filepath = decodeURIComponent(filepath.toString());
		filename = decodeURIComponent(filename.toString());
		const getFileStats = await getFilesAttributes({ filepath, filename });
		return res.status(200).send(getFileStats);
	} catch (error: any) {
		Logger.error(error?.message);
		return res.status(500).send({ status: false, message: error || error?.message });
	}
});

// * // Move Files And Create Batch //
router.post('/moveFiles', async (req: Request, res: Response) => {
	try {
		// * // Validating Params //
		const validateParams: any = joiSchema.validate(req.body);

		// ! // Check Valid Params //
		if (!validateParams.error) {
			// * // Extract Parameters //
			let { folderPath, maxBatchQuantity, maxFileSize, folderPrexfix } = req.body;

			// * // Decode Folder Path //
			folderPath = decodeURIComponent(folderPath);

			// ! // Check Folder Exists //
			if (fs.existsSync(folderPath)) {
				// * // Get Files Name //
				let { totalFiles = 1, files }: any = await getDirectoryContents({ filePath: folderPath, includeExt: false, getList: true });

				// * // No. of Folder //
				const totalFolders = Math.ceil(totalFiles / maxBatchQuantity);

				// * // Create Files Chunks with Max File Size //
				const fileChunks: Array<any> = await createSmallerChunks(files, maxBatchQuantity);

				// ! // Check Length //
				if (fileChunks.length > 0) {
					// @ // Iterate loop on chunks //
					let returnResponse: any = fileChunks.map((el: any, index: number) => {
						// * // Folder Name //
						let folderName: any = `${folderPrexfix}${index}`;
						let completePath: any = path.join(folderPath, folderName);

						// * // Create Folder If Doesn't Exists //
						if (!fs.existsSync(completePath)) {
							// * // Create Folder Otherwise //
							fs.mkdir(completePath, { recursive: true }, (err) => {
								// ! // Check for Errors //
								if (err) Logger.error(err?.message);
								Logger.info(`Folder Created | ${folderName}`);
							});
						}

						// @ // Iterate loop on files //
						fileChunks[index].forEach((els: any, indx: number) => {
							let fileName: any = decodeURIComponent(fileChunks[index][indx] as string);
							let previousPath: any = path.join(folderPath, fileName);
							let newFilePath: any = path.join(completePath, fileName);

							// * // Move Files //
							fs.renameSync(previousPath, newFilePath);

							fileName = undefined;
							previousPath = undefined;
							newFilePath = undefined;
						});

						return {
							folderName,
							path: completePath,
							files: fileChunks[index]
						};
					});

					// * // Return Response //
					return res.send({ returnResponse });
				} else {
					throw new Error('Error Creating Batches with Required Parameters');
				}
			} else {
				throw new Error("Folder Path Doesn't Exists");
			}
		} else {
			throw new Error(validateParams?.error as string);
		}
	} catch (error: any) {
		Logger.error(error?.message);
		return res.status(500).send({ status: false, message: error || error?.message });
	}
});

// * // Health Check Route //
router.get('/ping', (req: Request, res: Response) => res.status(200).json({ message: 'pong' }));

// ! // Error Routes //
router.get('*', (req: Request, res: Response) => {
	return res.status(404).send({ status: false, message: '[ ❌ ] Route Not Found!', data: [] });
});

// ! // Error Routes //
router.post('*', (req: Request, res: Response) => {
	return res.status(404).send({ status: false, message: '[ ❌ ] Route Not Found!', data: [] });
});

// @ // Export SMS Router //
export default router;
