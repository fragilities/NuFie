const app = require("../app.js");
const http = require("http");
const port = process.env.PORT || 3000;

http.createServer(app).listen(port, () =>
    console.log(`Express server is listening on port ${port}`)
);
