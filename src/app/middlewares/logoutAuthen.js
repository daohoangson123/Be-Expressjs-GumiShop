import jwt from 'jsonwebtoken';
import config from '../../config.js';
import HttpStatusCode from '../constants/httpStatusCode.js';
import {
    Unauthorized,
    InternalServerError,
} from '../apiResponses/apiResponse.js';
import blackList from '../../blackList.js';
const { TokenExpiredError, JsonWebTokenError } = jwt;

const logoutAuthen = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        const decode = jwt.verify(token, config.jwt.secretKey);

        blackList.push(token);
        next();
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

export default logoutAuthen;
