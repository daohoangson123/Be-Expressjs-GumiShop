import { Router } from 'express';
import AuthController from '../app/controllers/authController.js';
import authentication from '../app/middlewares/authentication.js';
import authorization from '../app/middlewares/authorization.js';
const userRoute = Router();

// Rest api

userRoute.get(
    '/users',
    authentication,
    authorization('admin'),
    AuthController.getUsers,
);

userRoute.post(
    '/users/:id',
    authentication,
    authorization('customer'),
    AuthController.getUserById,
);

userRoute.put(
    '/users/:id',
    authentication,
    authorization('admin'),
    AuthController.updateUser,
);

userRoute.delete(
    '/users/:id',
    authentication,
    authorization('admin'),
    AuthController.deleteUser,
);

export default userRoute;
