import { BadRequest } from '../apiResponses/apiResponse.js';
import HttpStatusCode from '../constants/httpStatusCode.js';

const errorHandler = (err, req, res, next) => {
    console.log(err.name);
    const errors = {};
    let statusCode = HttpStatusCode.BadRequest;
    if (err.name === 'ValidationError') {
        for (const field in err.errors) {
            errors[field] = err.errors[field].message;
        }
        // Đây chính là error của ông mongoose ném ra cho mình
    } else {
        errors[err.name] = err.message;
        statusCode = HttpStatusCode.InternalServerError;
    }
    return res.status(statusCode).send(new BadRequest(errors));
};

export default errorHandler;
