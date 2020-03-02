function errorHandler(err, req, res, next) {
    // console.log(err)
    // console.log(Object.keys(err.errors));

    let errorCode = err.errorCode || 500;
    let message = err.message || "Internal server error";

    if (err.name == "CastError") {
        errorCode = 400;
        message = `Invalid ${err.kind}`;
    }
    if (err.errors) {
        errorCode = 400;
        message = [];
        for (field in err.errors) {
            message.push(err.errors[field].message);
        }
    }
    res.status(errorCode).json({ message });
}

module.exports = errorHandler;
