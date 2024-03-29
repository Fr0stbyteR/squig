/* eslint-disable no-console */
/// <reference types="../types" />

import * as path from "path";
import * as SocketIO from "socket.io";
import * as express from "express";
import * as fs from "fs";

console.log("It works");

const PORT = 1080;
const server = express();
const io = SocketIO(2112);
const clients: { [id: string]: SocketIO.Socket } = {};
const admins: { [id: string]: SocketIO.Socket } = {};
let lines: TLines = {};
let texts: TTexts = {};
let background: string;
let dim = [720, 1280];

server.use("/", express.static(path.join(__dirname, "/")));
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

const imgs = fs.readdirSync("./img");
io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("connect-client", () => {
        clients[socket.id] = socket;
        socket.emit("imgs", imgs);
        socket.emit("dim", dim);
        socket.emit("all", { lines, texts });
        socket.emit("new-img", { path: background });
        console.log("New client: " + socket.id);
    });
    socket.on("connect-admin", () => {
        admins[socket.id] = socket;
        socket.emit("imgs", imgs);
        socket.emit("dim", dim);
        socket.emit("all", { lines, texts });
        socket.emit("new-img", { path: background });
        console.log("New admin: " + socket.id);
        socket.on("new-img", (e: { path?: string }) => {
            background = e.path;
            for (const id in clients) {
                clients[id].emit("new-img", e);
            }
            for (const id in admins) {
                admins[id].emit("new-img", e);
            }
            console.log("New Img: " + e.path);
        });
    });
    socket.on("disconnect", () => {
        console.log("Disconnected: " + socket.id);
        delete clients[socket.id];
        delete admins[socket.id];
    });
    socket.on("new-line", (e: { id: number; line: TLine }) => {
        lines[e.id] = e.line;
        for (const id in clients) {
            clients[id].emit("new-line", e);
        }
        for (const id in admins) {
            admins[id].emit("new-line", e);
        }
        console.log("New line: " + e.id);
    });
    socket.on("new-text", (e: { id: number; text: TText }) => {
        texts[e.id] = e.text;
        for (const id in clients) {
            clients[id].emit("new-text", e);
        }
        for (const id in admins) {
            admins[id].emit("new-text", e);
        }
        console.log("New text: " + e.id + " " + e.text.text);
    });
    socket.on("delete-all-lines", () => {
        if (!(socket.id in admins)) return;
        lines = {};
        texts = {};
        for (const id in clients) {
            clients[id].emit("delete-all-lines");
        }
        for (const id in admins) {
            admins[id].emit("delete-all-lines");
        }
        console.log("Delete all lines");
    });
    socket.on("delete-line", (e: { id?: number; ids?: number[] }) => {
        if (!(socket.id in admins)) return;
        if (e.id) {
            delete lines[e.id];
            delete texts[e.id];
        }
        if (e.ids) {
            e.ids.forEach((id) => {
                delete lines[id];
                delete texts[id];
            });
        }
        for (const id in clients) {
            clients[id].emit("delete-line", e);
        }
        for (const id in admins) {
            admins[id].emit("delete-line", e);
        }
        console.log("Delete line: " + (e.id || e.ids.length + "lines"));
    });
    socket.on("dim", (dimIn: [number, number]) => {
        dim = dimIn;
        for (const id in clients) {
            clients[id].emit("dim", dim);
        }
        for (const id in admins) {
            admins[id].emit("ratio", dim);
        }
        console.log("Dim: " + dim[0] + ", " + dim[1]);
    });
});
