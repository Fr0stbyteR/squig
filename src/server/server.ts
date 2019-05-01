/* eslint-disable no-console */
/// <reference types="../types" />

import * as path from "path";
import * as SocketIO from "socket.io";
import * as express from "express";

console.log("It works");

const PORT = 2112;
const server = express();
const io = SocketIO(1080);
const clients: { [id: string]: SocketIO.Socket } = {};
const admins: { [id: string]: SocketIO.Socket } = {};
const lines: TLines = {};

server.use("/", express.static(path.join(__dirname, "/")));
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

io.on("connection", (socket) => {
    console.log(socket.id);
    socket.on("connect-client", () => {
        clients[socket.id] = socket;
        socket.emit("lines", lines);
        console.log("New client: " + socket.id);
    });
    socket.on("connect-admin", () => {
        admins[socket.id] = socket;
        socket.emit("lines", lines);
        console.log("New admin: " + socket.id);
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
});
