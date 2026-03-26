const errorMiddleware = (err, req, res, next) => {
    console.error(err);

    if (err.name === "ValidationError") {
        return res.status(400).json({
            message: err.message,
            success: false
        });
    }

    if (err.name === "FIELDS_REQUIRED") {
        return res.status(400).json({
            message: "All fields are required, please fill in all fields!",
            success: false
        });
    }

    if (err.name === "USER_ALREADY_EXISTS") {
        return res.status(400).json({
            message: "User already exists",
            success: false
        });
    }

    if (err.name === "MongoError" && err.code === 11000) {
        return res.status(400).json({
            message: 'Duplicate field value entered',
            success: false
        });
    }

    res.status(500).json({
        message: err.message || 'Internal Server Error',
        success: false
    });
};

module.exports = errorMiddleware;