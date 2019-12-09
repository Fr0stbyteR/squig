"use strict";
/* eslint-disable no-console */
/// <reference types="../types" />
exports.__esModule = true;
var path = require("path");
var SocketIO = require("socket.io");
var express = require("express");
var fs = require("fs");
console.log("It works");
var PORT = 1080;
var server = express();
var io = SocketIO(2112);
var clients = {};
var admins = {};
var lines = {};
var texts = {};
var background;
var dim = [720, 1280];
server.use("/", express.static(path.join(__dirname, "/")));
server.listen(PORT, function () { return console.log("Server is running on http://localhost:" + PORT); });
var imgs = fs.readdirSync("./img");
io.on("connection", function (socket) {
    console.log(socket.id);
    socket.on("connect-client", function () {
        clients[socket.id] = socket;
        socket.emit("imgs", imgs);
        socket.emit("dim", dim);
        socket.emit("all", { lines: lines, texts: texts });
        socket.emit("new-img", { path: background });
        console.log("New client: " + socket.id);
    });
    socket.on("connect-admin", function () {
        admins[socket.id] = socket;
        socket.emit("imgs", imgs);
        socket.emit("dim", dim);
        socket.emit("all", { lines: lines, texts: texts });
        socket.emit("new-img", { path: background });
        console.log("New admin: " + socket.id);
        socket.on("new-img", function (e) {
            background = e.path;
            for (var id in clients) {
                clients[id].emit("new-img", e);
            }
            for (var id in admins) {
                admins[id].emit("new-img", e);
            }
            console.log("New Img: " + e.path);
        });
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
    socket.on("new-text", function (e) {
        texts[e.id] = e.text;
        for (var id in clients) {
            clients[id].emit("new-text", e);
        }
        for (var id in admins) {
            admins[id].emit("new-text", e);
        }
        console.log("New text: " + e.id + " " + e.text.text);
    });
    socket.on("delete-all-lines", function () {
        if (!(socket.id in admins))
            return;
        lines = {};
        texts = {};
        for (var id in clients) {
            clients[id].emit("delete-all-lines");
        }
        for (var id in admins) {
            admins[id].emit("delete-all-lines");
        }
        console.log("Delete all lines");
    });
    socket.on("delete-line", function (e) {
        if (!(socket.id in admins))
            return;
        if (e.id) {
            delete lines[e.id];
            delete texts[e.id];
        }
        if (e.ids) {
            e.ids.forEach(function (id) {
                delete lines[id];
                delete texts[id];
            });
        }
        for (var id in clients) {
            clients[id].emit("delete-line", e);
        }
        for (var id in admins) {
            admins[id].emit("delete-line", e);
        }
        console.log("Delete line: " + (e.id || e.ids.length + "lines"));
    });
    socket.on("dim", function (dimIn) {
        dim = dimIn;
        for (var id in clients) {
            clients[id].emit("dim", dim);
        }
        for (var id in admins) {
            admins[id].emit("ratio", dim);
        }
        console.log("Dim: " + dim[0] + ", " + dim[1]);
    });
});
