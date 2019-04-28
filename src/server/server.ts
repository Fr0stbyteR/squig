/* eslint-disable no-console */
import * as path from "path";
import * as SocketIO from "socket.io";
import * as express from "express";

console.log("It works");

const PORT = 2112;
const server = express();
const io = SocketIO(1080);
const clients = [] as SocketIO.Socket[];
let admin: SocketIO.Socket;

server.use("/", express.static(path.join(__dirname, "/")));
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));

io.on("connection", (socket) => {
    socket.on("connect-client", () => {
        console.log("New client: " + socket.id);
    });
    socket.on("connect-admin", () => {
        console.log("New admin: " + socket.id);
    });
    socket.on("disconnect", () => {
        console.log("Disconnected: " + socket.id);
    });
});
