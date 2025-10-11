import { errorResponse } from "../utils/response.util.js";

export const errorHandler = (err, req, res, next) => {
    console.error("Error:", err);
    return errorResponse(res, err, err.statusCode || 500);
};
