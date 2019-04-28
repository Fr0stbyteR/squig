import * as fs from "fs";
import * as path from "path";
import * as http from "http";
import * as Max from "max-api";
import * as SocketIO from "socket.io";
import * as express from "express";

Max.post("It works").then(() => console.log("It works"));

const PORT = 2112;
const server = express();
const io = SocketIO(1080);

server.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "/index.html"));
});
server.use("/", express.static(path.join(__dirname, "/")))
server.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
