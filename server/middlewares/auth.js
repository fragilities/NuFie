const jwt = require("jsonwebtoken");
const Activity = require("../models/Activity");

async function userAuthentication(req, res, next) {
    try {
        if (!req.headers || !req.headers.token)
            throw {
                errorCode: 400,
                message: "User authentication error: requires token"
            };

        const decoded = jwt.verify(req.headers.token, process.env.JWT_SECRET);
        req.userId = decoded.userId;
        next();
    } catch (error) {
        next(error);
    }
}

async function activityAuthorization(req, res, next) {
    try {
        const activity = await Activity.findOne({
            _id: req.params.id,
            owner: req.userId
        });

        if (!activity)
            throw {
                errorCode: 401,
                message:
                    "Activity authorization failed / activity cannot be found"
            };

        next();
    } catch (error) {
        next(error);
    }
}

async function activityMemberAuthorization(req, res, next) {
    try {
        const activity = await Activity.findOne({
            _id: req.params.id,
            members: req.userId
        });

        if (!activity)
            throw {
                errorCode: 401,
                message: "Activity authorization failed"
            };

        next();
    } catch (error) {
        next(error);
    }
}

async function activityPendingAuthorization(req, res, next) {
    try {
        const activity = await Activity.findOne({
            _id: req.params.id,
            pendingInvites: req.userId
        });

        if (!activity)
            throw {
                errorCode: 401,
                message: "Activity authorization failed"
            };

        next();
    } catch (error) {
        next(error);
    }
}

module.exports = {
    userAuthentication,
    activityAuthorization,
    activityMemberAuthorization,
    activityPendingAuthorization
};
