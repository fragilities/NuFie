const Activity = require("../models/Activity");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

module.exports = {
    createUser: async function(userObject) {
        const user = await User.create(userObject);
        const payload = {
            userId: user._id
        };
        const token = jwt.sign(payload, process.env.JWT_SECRET);
        return { user, token };
    },
    createActivity: async function(activityObject) {
        const newActivity = await Activity.create(activityObject);
        return newActivity;
    },
    removeAllUser: async function() {
        if (process.env.NODE_ENV === "test") await User.deleteMany({});
    },
    removeAllActivity: async function() {
        if (process.env.NODE_ENV === "test") await Activity.deleteMany({});
    }
};
