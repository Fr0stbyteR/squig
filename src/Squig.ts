import * as SocketIO from "socket.io-client";

export class Squig {
    w: number;
    h: number;
    ratio: number;
    socket: SocketIOClient.Socket;
    canvasContainer: HTMLDivElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    lines: TLines;
    tempLine: TLine;
    raf: number;
    img: HTMLImageElement;
    constructor() {
        this.w = 720;
        this.h = 1280;
        this.ratio = 720 / 1280;
        this.canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
        this.canvasContainer = document.getElementById("main-canvas-container") as HTMLDivElement;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.ctx = this.canvas.getContext("2d");
        this.img = document.getElementById("background") as HTMLImageElement;
        this.lines = {};
        this.tempLine = { user: "", color: "rgb(100, 0, 0)", points: [] };
        this.raf = 0;
        this.socket = SocketIO(window.location.hostname + ":2112");
        // bind
        const colorSelects = document.getElementsByClassName("color-select") as HTMLCollectionOf<HTMLDivElement>;
        for (let i = 0; i < colorSelects.length; i++) {
            const e = colorSelects[i];
            e.addEventListener("click", this.handleClickColor);
            e.addEventListener("touchstart", this.handleClickColor);
        }
        this.canvas.addEventListener("mousedown", this.handleStart);
        this.canvas.addEventListener("touchstart", this.handleStart);
        this.initSocket();
        this.redraw();
        window.addEventListener("resize", e => this.adjustSize(this.ratio));
    }
    initSocket() {
        const { socket } = this;
        socket.on("connect", () => {
            this.tempLine.user = this.socket.id;
            socket.emit("connect-client");
            socket.on("new-line", (e: { id: number; line: TLine }) => {
                this.lines[e.id] = e.line;
                this.redraw();
            });
            socket.on("new-img", (e: { path: string }) => {
                if (e.path) {
                    this.img.src = e.path;
                    this.img.style.visibility = "visible";
                } else this.img.style.visibility = "hidden";
            });
            socket.on("delete-line", (e: { id: number; ids: number[] }) => {
                if (e.id) delete this.lines[e.id];
                if (e.ids) e.ids.forEach(id => delete this.lines[id]);
                this.redraw();
            });
            socket.on("delete-all-lines", () => {
                this.lines = {};
                this.redraw();
            });
            socket.on("lines", (e: TLines) => {
                this.lines = e;
                this.redraw();
            });
            socket.on("ratio", (ratio: number) => {
                this.ratio = ratio;
                this.adjustSize(ratio);
            });
        });
    }
    adjustSize = (ratio: number) => {
        const windowRatio = window.innerWidth / window.innerHeight;
        if (ratio > windowRatio) {
            this.canvasContainer.style.width = `${window.innerWidth - 10}px`;
            this.canvasContainer.style.height = `${(window.innerWidth - 10) / ratio}px`;
        } else {
            this.canvasContainer.style.width = `${(window.innerHeight - 10) * ratio}px`;
            this.canvasContainer.style.height = `${window.innerHeight - 10}px`;
        }
    }
    drawLine(line: TLine) {
        const { ctx } = this;
        if (!line.points.length) return;
        ctx.save();
        ctx.strokeStyle = line.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        const firstPoint = line.points[0];
        ctx.moveTo(firstPoint.x, firstPoint.y);
        for (let i = 1; i < line.points.length; i++) {
            const point = line.points[i];
            ctx.lineTo(point.x, point.y);
        }
        ctx.stroke();
        ctx.restore();
    }
    redraw() {
        const { ctx, lines, w, h } = this;
        ctx.clearRect(0, 0, w, h);
        for (const id in lines) {
            const line = lines[id];
            this.drawLine(line);
        }
        this.drawLine(this.tempLine);
    }
    handleClickColor = (e: MouseEvent | TouchEvent) => {
        const color = window.getComputedStyle(e.currentTarget as HTMLDivElement).getPropertyValue("background-color");
        this.tempLine.color = color;
    };
    handleMove = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const { canvas, w, h } = this;
        const rect = canvas.getBoundingClientRect();
        const x = (e instanceof MouseEvent ? e.pageX : e.touches[0].pageX) - rect.left;
        const y = (e instanceof MouseEvent ? e.pageY : e.touches[0].pageY) - rect.top;
        this.tempLine.points.push({ x: x / rect.width * w, y: y / rect.height * h });
        this.redraw();
    };
    handleEnd = () => {
        const id = new Date().getTime();
        this.lines[id] = this.tempLine;
        if (!this.socket.disconnected) this.socket.emit("new-line", { id, line: this.tempLine });
        this.tempLine = { user: this.socket.id, color: this.tempLine.color, points: [] };
        this.redraw();
        document.removeEventListener("mousemove", this.handleMove);
        document.removeEventListener("touchmove", this.handleMove);
        document.removeEventListener("mouseup", this.handleEnd);
        document.removeEventListener("touchend", this.handleEnd);
    };
    handleStart = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const { canvas, w, h } = this;
        const rect = canvas.getBoundingClientRect();
        const x = (e instanceof MouseEvent ? e.pageX : e.touches[0].pageX) - rect.left;
        const y = (e instanceof MouseEvent ? e.pageY : e.touches[0].pageY) - rect.top;
        this.tempLine.points = [{ x: x / rect.width * w, y: y / rect.height * h }];
        this.redraw();
        document.addEventListener("mousemove", this.handleMove);
        document.addEventListener("touchmove", this.handleMove);
        document.addEventListener("mouseup", this.handleEnd);
        document.addEventListener("touchend", this.handleEnd);
    };
}
