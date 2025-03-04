import express from 'express';
import connectToDatabase from './configDatabase.js';
import routes from './routes/index.js';
import cookieParser from 'cookie-parser';
import errorHandler from './app/middlewares/errorHandler.js';
import cors from 'cors';

const app = express();

await connectToDatabase();

app.use(
    cors({
        origin: '*',
    }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

routes(app);

app.use(errorHandler);

app.listen(4000, () => {
    console.log('App listening at http://localhost:4000');
});

export default app;
