import express from 'express';
import path from 'path';

const router = express.Router();

['1', '2', '3'].forEach((page) => {
    router.get(`/${page}.html`, (req, res) => {
        res.sendFile(path.join(__dirname, `../../static/${page}.html`));
    });
});

export { router as staticRoutes };
