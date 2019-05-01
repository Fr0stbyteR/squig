import * as SocketIO from "socket.io-client";

document.addEventListener("DOMContentLoaded", () => {
    // Data init
    const squig: Squig = {};
    const w = 1280;
    const h = 720;
    squig.canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
    const colorSelects = document.getElementsByClassName("color-select") as HTMLCollectionOf<HTMLDivElement>;
    squig.lines = {};
    squig.tempLine = { color: "rgb(100, 0, 0)", points: [] };
    squig.canvas.width = w;
    squig.canvas.height = h;
    squig.ctx = squig.canvas.getContext("2d");
    squig.raf = 0;
    window.squig = squig;

    // Socket init
    squig.socket = SocketIO("192.168.1.10:1080");
    squig.socket.on("connect", () => {
        squig.socket.emit("connect-client");
    });

    const drawLine = (ctx: CanvasRenderingContext2D, line: TLine) => {
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
    };
    const draw = () => {
        const ctx = squig.ctx;
        const lines = squig.lines;
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        for (const id in lines) {
            const line = lines[id];
            drawLine(ctx, line);
        }
        drawLine(ctx, squig.tempLine);
        window.squig.raf = requestAnimationFrame(draw);
    };
    draw();

    const handleClickColor = (e: MouseEvent | TouchEvent) => {
        const color = window.getComputedStyle(e.currentTarget as HTMLDivElement).getPropertyValue("background-color");
        squig.tempLine.color = color;
    };
    for (let i = 0; i < colorSelects.length; i++) {
        const e = colorSelects[i];
        e.addEventListener("click", handleClickColor);
        e.addEventListener("touchstart", handleClickColor);
    }

    const handleMove = (e: MouseEvent | TouchEvent) => {
        const rect = squig.canvas.getBoundingClientRect();
        const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
        const y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
        squig.tempLine.points.push({ x: x / rect.width * w, y: y / rect.height * h });
    };
    const handleEnd = () => {
        const id = new Date().getTime();
        squig.lines[id] = squig.tempLine;
        if (!squig.socket.disconnected) squig.socket.emit("new-line", { id, line: squig.tempLine });
        squig.tempLine = { color: squig.tempLine.color, points: [] };
        const canvas = squig.canvas;
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("touchmove", handleMove);
        canvas.removeEventListener("mouseup", handleEnd);
        canvas.removeEventListener("touchend", handleEnd);
    };
    const handleStart = (e: MouseEvent | TouchEvent) => {
        const canvas = squig.canvas;
        const rect = canvas.getBoundingClientRect();
        const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
        const y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
        squig.tempLine.points = [{ x: x / rect.width * w, y: y / rect.height * h }];
        canvas.addEventListener("mousemove", handleMove);
        canvas.addEventListener("touchmove", handleMove);
        canvas.addEventListener("mouseup", handleEnd);
        canvas.addEventListener("touchend", handleEnd);
    };
    squig.canvas.addEventListener("mousedown", handleStart);
    squig.canvas.addEventListener("touchstart", handleStart);
});
