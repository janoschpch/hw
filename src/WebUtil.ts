import { Response } from "express";

enum ErrorStatus {
    NOT_FOUND = 404,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    INTERNAL_SERVER_ERROR = 500
}

enum ErrorType {
    MISSING_PARAMETERS = "MISSING_PARAMETERS",
    EXISTS_ALREADY = "EXISTS_ALREADY",
    WRONG_CREDENTIALS = "WRONG_CREDENTIALS",
    INVALID_SESSION = "INVALID_SESSION",
    NOT_FOUND = "NOT_FOUND",
    NO_PERMISSION = "NO_PERMISSION"
}

enum SuccessStatus {
    OK = 200,
    CREATED = 201,
    ACCEPTED = 202,
    NO_CONTENT = 204
}

enum SuccessType {
    CREATED = "CREATED",
    LOGGED_IN = "LOGGED_IN",
    LOGGED_OUT = "LOGGED_OUT",
    OK = "OK",
    DELETED = "DELETED",
    UPDATED = "UPDATED"
}

const error = (response: Response, status: ErrorStatus, type: ErrorType) => {
    response.status(status).send({
        status: "error",
        message: type
    });
}

const success = (response: Response, status: SuccessStatus, type: SuccessType) => {
    response.status(status).send({
        status: "success",
        message: type
    });
}

const successData = (response: Response, status: SuccessStatus, type: SuccessType, data: any) => {
    response.status(status).send({
        status: "success",
        message: type,
        data: data
    });
}

export default {
    error,
    success,
    successData,
    ErrorStatus,
    ErrorType,
    SuccessStatus,
    SuccessType
}