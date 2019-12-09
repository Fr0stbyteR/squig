import * as SocketIO from "socket.io-client";

export class Squig {
    w: number;
    h: number;
    zoom: number;
    socket: SocketIOClient.Socket;
    canvasContainer: HTMLDivElement;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    lines: TLines;
    tempLine: TLine;
    texts: TTexts;
    tempText: TText;
    mode: "line" | "text";
    raf: number;
    img: HTMLImageElement;
    constructor() {
        this.w = 720;
        this.h = 1280;
        this.zoom = 1;
        this.canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
        this.canvasContainer = document.getElementById("main-canvas-container") as HTMLDivElement;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.ctx = this.canvas.getContext("2d");
        this.mode = "line";
        this.img = document.getElementById("background") as HTMLImageElement;
        this.lines = {};
        this.tempLine = { user: "", color: "#ee2a7b", points: [] };
        this.texts = {};
        this.tempText = { user: "", color: "#ee2a7b", text: "", position: { x: 0, y: 0 } };
        this.raf = 0;
        this.socket = SocketIO(window.location.hostname + ":2112");
        // bind
        const colorSelects = document.getElementsByClassName("color-select") as HTMLCollectionOf<HTMLDivElement>;
        for (let i = 0; i < colorSelects.length; i++) {
            const e = colorSelects[i];
            e.addEventListener("click", this.handleClickColor);
            e.addEventListener("touchstart", this.handleClickColor);
        }
        const modeSelect = document.getElementById("text-select");
        modeSelect.addEventListener("mousedown", this.handleClickMode);
        modeSelect.addEventListener("touchstart", this.handleClickMode);
        this.canvas.addEventListener("mousedown", this.handleStart);
        this.canvas.addEventListener("touchstart", this.handleStart);
        this.initSocket();
        this.redraw();
        window.addEventListener("resize", () => this.adjustSize(this.w, this.h));
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
            socket.on("new-text", (e: { id: number; text: TText }) => {
                this.texts[e.id] = e.text;
                this.redraw();
            });
            socket.on("new-img", (e: { path: string }) => {
                if (e.path) {
                    this.img.src = e.path;
                    this.img.style.visibility = "visible";
                } else this.img.style.visibility = "hidden";
            });
            socket.on("delete-line", (e: { id: number; ids: number[] }) => {
                if (e.id) {
                    delete this.lines[e.id];
                    delete this.texts[e.id];
                }
                if (e.ids) {
                    e.ids.forEach((id) => {
                        delete this.lines[id];
                        delete this.texts[id];
                    });
                }
                this.redraw();
            });
            socket.on("delete-all-lines", () => {
                this.lines = {};
                this.texts = {};
                this.redraw();
            });
            socket.on("all", (e: { lines: TLines; texts: TTexts }) => {
                this.lines = e.lines;
                this.texts = e.texts;
                this.redraw();
            });
            socket.on("dim", (dim: [number, number]) => {
                this.adjustSize(...dim);
            });
        });
    }
    adjustSize = (wIn: number, hIn: number) => {
        const windowRatio = window.innerWidth / window.innerHeight;
        this.w = wIn;
        this.h = hIn;
        const ratio = this.w / this.h;
        let w = 0;
        let h = 0;
        if (ratio > windowRatio) {
            w = window.innerWidth - 10;
            h = (window.innerWidth - 10) / ratio;
        } else {
            w = (window.innerHeight - 10) * ratio;
            h = window.innerHeight - 10;
        }
        this.canvasContainer.style.width = `${w}px`;
        this.canvasContainer.style.height = `${h}px`;
        this.canvas.width = this.w;
        this.canvas.height = this.h;
        this.zoom = w / wIn;
        this.redraw();
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
    drawText(text: TText) {
        const { ctx } = this;
        ctx.save();
        ctx.font = "50px Calibri, sans-serif";
        ctx.textBaseline = "top";
        ctx.fillStyle = text.color;
        ctx.fillText(text.text, text.position.x, text.position.y);
        ctx.restore();
    }
    redraw() {
        const { ctx, lines, texts, w, h } = this;
        ctx.clearRect(0, 0, w, h);
        for (const id in lines) {
            const line = lines[id];
            this.drawLine(line);
        }
        for (const id in texts) {
            const text = texts[id];
            this.drawText(text);
        }
        this.drawLine(this.tempLine);
        this.drawText(this.tempText);
    }
    handleClickColor = (e: MouseEvent | TouchEvent) => {
        const color = window.getComputedStyle(e.currentTarget as HTMLDivElement).getPropertyValue("background-color");
        this.tempLine.color = color;
        this.tempText.color = color;
    };
    handleClickMode = (e: MouseEvent | TouchEvent) => {
        this.mode = this.mode === "line" ? "text" : "line";
        (e.currentTarget as HTMLDivElement).className = this.mode === "text" ? "active" : "";
    }
    handleMove = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const { canvas } = this;
        const rect = canvas.getBoundingClientRect();
        const x = (e instanceof MouseEvent ? e.pageX : e.touches[0].pageX) - rect.left;
        const y = (e instanceof MouseEvent ? e.pageY : e.touches[0].pageY) - rect.top;
        this.tempLine.points.push({ x: x / this.zoom, y: y / this.zoom });
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
        const { canvas } = this;
        const rect = canvas.getBoundingClientRect();
        const x = (e instanceof MouseEvent ? e.pageX : e.touches[0].pageX) - rect.left;
        const y = (e instanceof MouseEvent ? e.pageY : e.touches[0].pageY) - rect.top;
        const canvasX = x / this.zoom;
        const canvasY = y / this.zoom;
        if (this.mode === "text") {
            // eslint-disable-next-line no-alert
            const text = window.prompt("Write Something...");
            if (text) {
                this.tempText.text = text;
                this.tempText.position = { x: canvasX, y: canvasY };
                const id = new Date().getTime();
                this.texts[id] = this.tempText;
                if (!this.socket.disconnected) this.socket.emit("new-text", { id, text: this.tempText });
                this.tempText = { text: "", user: this.socket.id, color: this.tempText.color, position: { x: canvasX, y: canvasY } };
            }
        } else {
            this.tempLine.points = [{ x: canvasX, y: canvasY }];
            document.addEventListener("mousemove", this.handleMove);
            document.addEventListener("touchmove", this.handleMove);
            document.addEventListener("mouseup", this.handleEnd);
            document.addEventListener("touchend", this.handleEnd);
        }
        this.redraw();
    };
}
