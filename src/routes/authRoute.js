import { Router } from 'express';
import AuthController from '../app/controllers/authController.js';
import logoutAuthen from '../app/middlewares/logoutAuthen.js';

const authRoute = Router();

authRoute.post('/auth/signup', AuthController.signup);
authRoute.post('/auth/login', AuthController.login);
authRoute.post('/auth/logout', logoutAuthen, AuthController.logout);

export default authRoute;
