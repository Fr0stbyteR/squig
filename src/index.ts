import * as SocketIO from "socket.io-client";

document.addEventListener("DOMContentLoaded", () => {
    // UI init
    const canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
    const colorSelects = document.getElementsByClassName("color-select") as HTMLCollectionOf<HTMLDivElement>;
    let color: string;
    const handleClickColor = (e: MouseEvent | TouchEvent) => {
        color = window.getComputedStyle(e.currentTarget as HTMLDivElement).getPropertyValue("background-color");
    };
    for (let i = 0; i < colorSelects.length; i++) {
        const e = colorSelects[i];
        e.addEventListener("click", handleClickColor);
        e.addEventListener("touchstart", handleClickColor);
    }
    colorSelects[0].click();

    // Data init
    const lines: TLines = {};

    let raf: number;
    const w = 1280;
    const h = 720;
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext("2d");
    const draw = () => {
        const rect = canvas.getBoundingClientRect();
        ctx.fillStyle = "white";
        ctx.fillRect(0, 0, w, h);
        for (const id in lines) {
            const line = lines[id];
            ctx.strokeStyle = line.color;
            const firstPoint = line.points[0];
            ctx.moveTo(firstPoint.x / rect.width, firstPoint.y / rect.height);
            for (let i = 1; i < line.points.length; i++) {
                const point = line.points[i];
                ctx.lineTo(point.x / rect.width, point.y / rect.height);
            }
            ctx.stroke();
        }
        raf = requestAnimationFrame(draw);
    };
    draw();
});
