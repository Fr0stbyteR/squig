"use strict";
exports.__esModule = true;
var path = require("path");
var SocketIO = require("socket.io");
var express = require("express");
console.log("It works");
var PORT = 2112;
var server = express();
var io = SocketIO(1080);
server.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "/index.html"));
});
server.use("/", express.static(path.join(__dirname, "/")));
server.listen(PORT, function () { return console.log("Server is running on http://localhost:" + PORT); });
