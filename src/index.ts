import * as SocketIO from "socket.io-client";

document.addEventListener("DOMContentLoaded", () => {
    // UI init
    const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
    const colorSelects = document.getElementsByClassName("color-select") as HTMLCollectionOf<HTMLDivElement>;
    // Data init
    let color: string;
    const lines: TLines = {};
    const tempLine: TLine = { color, points: [] };
    let raf: number;
    const w = 1280;
    const h = 720;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    const drawLine = (ctx: CanvasRenderingContext2D, line: TLine) => {
        if (!line.points.length) return;
        ctx.save();
        ctx.strokeStyle = line.color;
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
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        for (const id in lines) {
            const line = lines[id];
            drawLine(ctx, line);
        }
        drawLine(ctx, tempLine);
        raf = requestAnimationFrame(draw);
    };
    draw();

    const handleClickColor = (e: MouseEvent | TouchEvent) => {
        color = window.getComputedStyle(e.currentTarget as HTMLDivElement).getPropertyValue("background-color");
        tempLine.color = color;
    };
    for (let i = 0; i < colorSelects.length; i++) {
        const e = colorSelects[i];
        e.addEventListener("click", handleClickColor);
        e.addEventListener("touchstart", handleClickColor);
    }
    colorSelects[0].click();

    const handleMove = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
        const y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
        tempLine.points.push({ x: x / rect.width * w, y: y / rect.height * h });
    };
    const handleEnd = () => {
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("touchmove", handleMove);
        canvas.removeEventListener("mouseup", handleEnd);
        canvas.removeEventListener("touchend", handleEnd);
    };
    const handleStart = (e: MouseEvent | TouchEvent) => {
        const rect = canvas.getBoundingClientRect();
        const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
        const y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
        tempLine.points = [{ x: x / rect.width * w, y: y / rect.height * h }];
        canvas.addEventListener("mousemove", handleMove);
        canvas.addEventListener("touchmove", handleMove);
        canvas.addEventListener("mouseup", handleEnd);
        canvas.addEventListener("touchend", handleEnd);
    };
    canvas.addEventListener("mousedown", handleStart);
    canvas.addEventListener("touchstart", handleStart);
});
