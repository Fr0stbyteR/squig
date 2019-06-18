"use strict";
/* eslint-disable no-console */
/// <reference types="../types" />
exports.__esModule = true;
var path = require("path");
var SocketIO = require("socket.io");
var express = require("express");
console.log("It works");
var PORT = 1080;
var server = express();
var io = SocketIO(2112);
var clients = {};
var admins = {};
var lines = {};
server.use("/", express.static(path.join(__dirname, "/")));
server.listen(PORT, function () { return console.log("Server is running on http://localhost:" + PORT); });
io.on("connection", function (socket) {
    console.log(socket.id);
    socket.on("connect-client", function () {
        clients[socket.id] = socket;
        socket.emit("lines", lines);
        console.log("New client: " + socket.id);
    });
    socket.on("connect-admin", function () {
        admins[socket.id] = socket;
        socket.emit("lines", lines);
        console.log("New admin: " + socket.id);
    });
    socket.on("disconnect", function () {
        console.log("Disconnected: " + socket.id);
        delete clients[socket.id];
        delete admins[socket.id];
    });
    socket.on("new-line", function (e) {
        lines[e.id] = e.line;
        for (var id in clients) {
            clients[id].emit("new-line", e);
        }
        for (var id in admins) {
            admins[id].emit("new-line", e);
        }
        console.log("New line: " + e.id);
    });
    socket.on("delete-line", function (e) {
        if (!(socket.id in admins))
            return;
        if (e.id)
            delete lines[e.id];
        if (e.ids)
            e.ids.forEach(function (id) { return delete lines[id]; });
        for (var id in clients) {
            clients[id].emit("delete-line", e);
        }
        for (var id in admins) {
            admins[id].emit("delete-line", e);
        }
        console.log("Delete line: " + e.id || (e.ids.length + "lines"));
    });
});
