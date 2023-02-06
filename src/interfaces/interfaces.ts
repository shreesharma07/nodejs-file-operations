import { getFiles } from '../tools/tool';
// @ // Jwt Params //
export interface jwtParams {
	token: string;
	algo?: string;
	issuer?: string;
}

// @ // File Details Params //
export interface fileParams {
	filePath: string;
	getList?: boolean;
	includeExt?: boolean;
}
