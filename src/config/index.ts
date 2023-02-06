import dotenv from 'dotenv';
import morgan from '../middlewares/morgan';

dotenv.config();

export const PORT = process.env.PORT || 9090;
export const HOST = process.env.HOST || 'http://localhost';
export const MORGAN_LOGGER = morgan;
