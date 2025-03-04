import jwt from 'jsonwebtoken';
import config from '../../config.js';
import HttpStatusCode from '../constants/httpStatusCode.js';
import {
    Unauthorized,
    InternalServerError,
} from '../apiResponses/apiResponse.js';
import blackList from '../../blackList.js';
const { TokenExpiredError, JsonWebTokenError } = jwt;

const authentication = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (blackList.includes(token)) {
            return res
                .status(HttpStatusCode.Unauthorized)
                .send(new Unauthorized());
        }
        const decode = jwt.verify(token, config.jwt.secretKey);

        if (token) {
            res.locals.id = decode.id;
            res.locals.role = decode.role;
            next();
        }
    } catch (error) {
        if (
            error instanceof JsonWebTokenError ||
            error instanceof TokenExpiredError
        ) {
            return res
                .status(HttpStatusCode.Unauthorized)
                .send(new Unauthorized());
        }
        return res
            .status(HttpStatusCode.InternalServerError)
            .send(new InternalServerError());
    }
};

export default authentication;

// authorization => định danh người dùng
// Authorization => dùng để check xem người dùng có quyền access hay k
