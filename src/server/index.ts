import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import connectDB from './models/db';

import { staticRoutes } from './routes/staticRoutes';
import { trackerRoutes } from './routes/trackerRoutes';

dotenv.config();

connectDB();

// Tracker
const trackerApp = express();

trackerApp.use(express.json());
trackerApp.use(express.text());
trackerApp.use(cors());
trackerApp.use('/', trackerRoutes);

const trackerPort = process.env.PORT || 8888;

trackerApp.listen(trackerPort, () =>
    console.log(`Listening at http://localhost:${trackerPort}`)
);

// Front
const staticApp = express();

staticApp.use(express.json());
staticApp.use(express.static(path.join(__dirname, '../static')));
staticApp.use('/', staticRoutes);

const staticPort = process.env.FRONT_PORT || 50000;

staticApp.listen(staticPort, () => {
    console.log(`Listening at http://localhost:${staticPort}`);
});
