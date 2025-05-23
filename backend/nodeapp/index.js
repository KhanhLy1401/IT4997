import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import router from './routes/indexRoutes.js'
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
// import https from 'https';
// import fs from 'fs'


dotenv.config();
connectDB();

const port = process.env.PORT;

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use('/', router);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});