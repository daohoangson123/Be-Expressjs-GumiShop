import { Forbidden } from '../apiResponses/apiResponse.js';
import HttpStatusCode from '../constants/httpStatusCode.js';

const authorization = (role) => {
    return (req, res, next) => {
        const getRole = res.locals.role;

        if (getRole === role) {
            return next();
        }
        return res.status(HttpStatusCode.Forbidden).send(new Forbidden());
    };
};

export default authorization;
