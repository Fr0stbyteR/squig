import * as SocketIO from "socket.io-client";

document.addEventListener("DOMContentLoaded", () => {
    // Data init
    const squig: Squig = {};
    const w = 720;
    const h = 1280;
    squig.canvas = document.getElementById("main-canvas") as HTMLCanvasElement;
    const colorSelects = document.getElementsByClassName("color-select") as HTMLCollectionOf<HTMLDivElement>;
    squig.lines = {};
    squig.tempLine = { user: "", color: "rgb(100, 0, 0)", points: [] };
    squig.canvas.width = w;
    squig.canvas.height = h;
    squig.ctx = squig.canvas.getContext("2d");
    squig.raf = 0;
    window.squig = squig;
    const squigAdmin: SquigAdmin = {};
    squigAdmin.tableTime = document.getElementById("table-time") as HTMLTableElement;
    squigAdmin.tableUser = document.getElementById("table-user") as HTMLTableElement;
    squigAdmin.selected = [];

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
    const drawSelectedLine = (ctx: CanvasRenderingContext2D, line: TLine) => {
        if (!line.points.length) return;
        ctx.save();
        ctx.strokeStyle = "rgba(255, 255, 100, 0.5)";
        ctx.lineWidth = 25;
        ctx.lineCap = "round";
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
            if (squigAdmin.selected.indexOf(id) !== -1) drawSelectedLine(ctx, line);
            drawLine(ctx, line);
        }
        drawLine(ctx, squig.tempLine);
    };
    draw();
    const fillTable = () => {
        const curTime = new Date();
        const tableTimeBody = squigAdmin.tableTime.getElementsByTagName("tbody")[0];
        tableTimeBody.innerHTML = "";
        const tableUserBody = squigAdmin.tableUser.getElementsByTagName("tbody")[0];
        tableUserBody.innerHTML = "";
        const users: { [id: string]: { last: number; lines: string[] } } = {};
        const handleSelect = (id: string) => {
            if (squigAdmin.selected.indexOf(id) === -1) {
                squigAdmin.selected.push(id);
                draw();
            }
        };
        const handleDeselect = (id: string) => {
            const i = squigAdmin.selected.indexOf(id);
            if (i !== -1) {
                squigAdmin.selected.splice(i, 1);
                draw();
            }
        };
        const handleSelects = (ids: string[]) => {
            ids.forEach((id) => {
                if (squigAdmin.selected.indexOf(id) === -1) squigAdmin.selected.push(id);
            });
            draw();
        };
        const handleDeselects = (ids: string[]) => {
            ids.forEach((id) => {
                const i = squigAdmin.selected.indexOf(id);
                if (i !== -1) squigAdmin.selected.splice(i, 1);
            });
            draw();
        };
        const ids = Object.keys(squig.lines).sort((a, b) => +b - +a);
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const line = squig.lines[+id];
            const time = new Date(+id);
            const dMin = (curTime.getTime() - time.getTime()) / 60000;
            const color = line.color;
            const user = line.user.substr(0, 6);
            if (!(user in users)) users[user] = { last: dMin, lines: [] };
            else if (dMin < users[user].last) users[user].last = dMin;
            users[user].lines.push(id);
            const tr = document.createElement("tr");
            const tdUser = document.createElement("td");
            const tdColor = document.createElement("td");
            const tdTime = document.createElement("td");
            const tdDel = document.createElement("td");
            const btnDel = document.createElement("button");
            btnDel.className = "btn-delete";
            tdDel.appendChild(btnDel);
            tdUser.innerText = user;
            tdColor.style.backgroundColor = color;
            tdTime.innerText = dMin.toFixed(0) + " min";
            tr.appendChild(tdUser);
            tr.appendChild(tdColor);
            tr.appendChild(tdTime);
            tr.appendChild(btnDel);
            tr.tabIndex = 1;
            tableTimeBody.appendChild(tr);
            btnDel.addEventListener("click", () => squig.socket.emit("delete-line", { id }));
            tr.addEventListener("focusin", () => handleSelect(id));
            tr.addEventListener("focusout", () => handleDeselect(id));
            tr.addEventListener("mouseenter", () => handleSelect(id));
            tr.addEventListener("mouseleave", () => handleDeselect(id));
        }
        const usersIDs = Object.keys(users).sort((a, b) => +users[a].last - +users[b].last);
        for (let i = 0; i < usersIDs.length; i++) {
            const id = usersIDs[i];
            const tr = document.createElement("tr");
            const tdUser = document.createElement("td");
            const tdTime = document.createElement("td");
            const tdDel = document.createElement("td");
            const btnDel = document.createElement("button");
            btnDel.className = "btn-delete";
            tdDel.appendChild(btnDel);
            tdUser.innerText = id;
            tdTime.innerText = users[id].last.toFixed(0) + " min";
            tr.appendChild(tdUser);
            tr.appendChild(tdTime);
            tr.appendChild(btnDel);
            tableUserBody.appendChild(tr);
            btnDel.addEventListener("click", () => squig.socket.emit("delete-line", { ids: users[id].lines }));
            tr.addEventListener("focusin", () => handleSelects(users[id].lines));
            tr.addEventListener("focusout", () => handleDeselects(users[id].lines));
            tr.addEventListener("mouseenter", () => handleSelects(users[id].lines));
            tr.addEventListener("mouseleave", () => handleDeselects(users[id].lines));
        }
    };
    setInterval(fillTable, 60000);

    // Socket init
    squig.socket = SocketIO("http://192.168.1.10:1080");
    squig.socket.on("connect", () => {
        squig.tempLine.user = squig.socket.id;
        squig.socket.emit("connect-admin");
        squig.socket.on("new-line", (e: { id: number; line: TLine }) => {
            squig.lines[e.id] = e.line;
            draw();
            fillTable();
        });
        squig.socket.on("delete-line", (e: { id: number; ids: number[] }) => {
            if (e.id) delete squig.lines[e.id];
            if (e.ids) e.ids.forEach(id => delete squig.lines[id]);
            draw();
            fillTable();
        });
        squig.socket.on("lines", (e: TLines) => {
            squig.lines = e;
            draw();
            fillTable();
        });
    });

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
        e.preventDefault();
        const rect = squig.canvas.getBoundingClientRect();
        const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
        const y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
        squig.tempLine.points.push({ x: x / rect.width * w, y: y / rect.height * h });
        draw();
    };
    const handleEnd = () => {
        const id = new Date().getTime();
        squig.lines[id] = squig.tempLine;
        if (!squig.socket.disconnected) squig.socket.emit("new-line", { id, line: squig.tempLine });
        squig.tempLine = { user: squig.socket.id, color: squig.tempLine.color, points: [] };
        draw();
        const canvas = squig.canvas;
        canvas.removeEventListener("mousemove", handleMove);
        canvas.removeEventListener("touchmove", handleMove);
        canvas.removeEventListener("mouseup", handleEnd);
        canvas.removeEventListener("touchend", handleEnd);
    };
    const handleStart = (e: MouseEvent | TouchEvent) => {
        e.preventDefault();
        const canvas = squig.canvas;
        const rect = canvas.getBoundingClientRect();
        const x = e instanceof MouseEvent ? e.pageX : e.touches[0].pageX;
        const y = e instanceof MouseEvent ? e.pageY : e.touches[0].pageY;
        squig.tempLine.points = [{ x: x / rect.width * w, y: y / rect.height * h }];
        draw();
        canvas.addEventListener("mousemove", handleMove);
        canvas.addEventListener("touchmove", handleMove);
        canvas.addEventListener("mouseup", handleEnd);
        canvas.addEventListener("touchend", handleEnd);
    };
    squig.canvas.addEventListener("mousedown", handleStart);
    squig.canvas.addEventListener("touchstart", handleStart);
});
