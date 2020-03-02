/* istanbul ignore next */
if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == "test") require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const routes = require("./routes");
const errorHandler = require("./middlewares/errorHandler.js");

// const mongodbConnectionStr = `mongodb+srv://zoezachary:zoe123123@hikari03-cu2nb.mongodb.net/nufie_development?retryWrites=true&w=majority`;
const mongodbConnectionStr = `mongodb://localhost:27017/nufie-${process.env.NODE_ENV}`;

mongoose.connect(mongodbConnectionStr, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routes);
app.use(errorHandler);

module.exports = app;
