import HttpStatusCode from '../constants/httpStatusCode.js';

class ApiResponse {
    constructor(statusCode, message) {
        this.statusCode = statusCode;
        this.message = message;
    }
}

class SuccessResponse extends ApiResponse {
    constructor(data) {
        super(HttpStatusCode.Success, 'Data retrieved successfully');
        this.data = data;
    }
}

class PaginationResponse extends ApiResponse {
    constructor(data, pageIndex, pageSize, total) {
        super(HttpStatusCode.Success, 'Data retrieved successfully');
        this.data = data;
        this.pageIndex = pageIndex;
        this.pageSize = pageSize;
        this.total = total;
    }
}

class ErrorResponse extends ApiResponse {
    constructor(statusCode, errors) {
        super(statusCode, 'An error has occur');
        this.errors = errors;
    }
}

class BadRequest extends ErrorResponse {
    constructor(message) {
        super(HttpStatusCode.BadRequest, [message]);
    }
}

class Unauthorized extends ErrorResponse {
    constructor() {
        super(HttpStatusCode.Unauthorized, ['Unauthorized']);
    }
}

class Forbidden extends ErrorResponse {
    constructor() {
        super(HttpStatusCode.Forbidden, ['Forbidden']);
    }
}

class InternalServerError extends ErrorResponse {
    constructor() {
        super(HttpStatusCode.InternalServerError, ['Internal Sever Error']);
    }
}

export {
    SuccessResponse,
    PaginationResponse,
    BadRequest,
    Unauthorized,
    Forbidden,
    InternalServerError,
};
