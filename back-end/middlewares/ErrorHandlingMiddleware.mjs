import ApiError from '../error/ApiError.mjs';

const handler = (err, req, res, next) => {
    if (err instanceof ApiError) {
        return res.status(err.statusCode).json({
            message: err.message,
        });
    }
    return res.status(500).json({
        message: 'Internal server error',
    });
}

export default handler;