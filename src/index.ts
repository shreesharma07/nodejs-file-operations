// ! // Importing Modules //
import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';

// ! // Import Logger //
import Logger from './lib/logger';
import { MORGAN_LOGGER, PORT, HOST } from './config/index';

// * // Import Root Route //
import rootRouter from './routes/root';

// * // Config Env. Values //
dotenv.config();

const app: Express = express();

// @ //Middlewares
app.use(MORGAN_LOGGER);
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// * // Assigning Routers //
app.use('/', rootRouter);

app.listen(PORT, () => {
	Logger.debug(`⚡️[server]: Server is running at ${HOST}:${PORT}`);
});
