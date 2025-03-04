import authRoute from './authRoute.js';
import productRoute from './productRoute.js';
import userRoute from './userRoute.js';

function routes(app) {
    app.use('/api/v1', authRoute, userRoute, productRoute);

    app.get('/', (req, res) => {
        req.header;
        // res.cookie('userName', 'son', {
        //     maxAge: 60000,
        //     httpOnly: true,
        // });
        res.send('GumiShop Backend');
    });
}

export default routes;
