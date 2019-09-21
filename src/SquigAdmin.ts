import { Squig } from "./Squig";

export class SquigAdmin extends Squig {
    tableTime: HTMLTableElement;
    tableUser: HTMLTableElement;
    selected: string[];
    btnDeleteLines: HTMLButtonElement;
    btnClearBackground: HTMLButtonElement;
    constructor() {
        super();
        this.tableTime = document.getElementById("table-time") as HTMLTableElement;
        this.tableUser = document.getElementById("table-user") as HTMLTableElement;
        this.btnDeleteLines = document.getElementById("btn-delete-all") as HTMLButtonElement;
        this.btnClearBackground = document.getElementById("btn-clear-background") as HTMLButtonElement;
        this.btnDeleteLines.addEventListener("click", () => this.socket.emit("delete-all-lines"));
        this.btnClearBackground.addEventListener("click", () => {
            this.socket.emit("new-img", {});
            this.socket.emit("ratio", 720 / 1280);
        });
        this.selected = [];
        setInterval(this.fillTable, 60000);
    }
    drawSelectedLine(line: TLine) {
        const { ctx } = this;
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
    }
    initSocket() {
        const { socket } = this;
        socket.on("connect", () => {
            this.tempLine.user = this.socket.id;
            socket.emit("connect-admin");
            socket.on("imgs", (list: string[]) => {
                const imgsDiv = document.getElementById("options-img");
                imgsDiv.innerHTML = "";
                const handleClick = (e: MouseEvent | TouchEvent) => {
                    const img = (e.currentTarget as HTMLImageElement);
                    const path = img.src;
                    const ratio = img.width / img.height;
                    socket.emit("ratio", ratio);
                    socket.emit("new-img", { path });
                    socket.emit("delete-all-lines");
                };
                list.forEach((path) => {
                    const img = document.createElement("img");
                    img.src = `img/${path}`;
                    img.className = "option-img";
                    imgsDiv.appendChild(img);
                    img.addEventListener("click", handleClick);
                    img.addEventListener("touchstart", handleClick);
                });
            });
            socket.on("new-line", (e: { id: number; line: TLine }) => {
                this.lines[e.id] = e.line;
                this.redraw();
                this.fillTable();
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
                this.fillTable();
            });
            socket.on("delete-all-lines", () => {
                this.lines = {};
                this.redraw();
                this.fillTable();
            });
            socket.on("lines", (e: TLines) => {
                this.lines = e;
                this.redraw();
                this.fillTable();
            });
            socket.on("ratio", (ratio: number) => {
                this.ratio = ratio;
                this.adjustSize(ratio);
            });
        });
    }
    redraw() {
        const { ctx, lines, w, h } = this;
        ctx.clearRect(0, 0, w, h);
        for (const id in lines) {
            const line = lines[id];
            if (this.selected.indexOf(id) !== -1) this.drawSelectedLine(line);
            this.drawLine(line);
        }
        this.drawLine(this.tempLine);
    }
    fillTable = () => {
        const curTime = new Date();
        const tableTimeBody = this.tableTime.getElementsByTagName("tbody")[0];
        tableTimeBody.innerHTML = "";
        const tableUserBody = this.tableUser.getElementsByTagName("tbody")[0];
        tableUserBody.innerHTML = "";
        const users: { [id: string]: { last: number; lines: string[] } } = {};
        const handleSelect = (id: string) => {
            if (this.selected.indexOf(id) === -1) {
                this.selected.push(id);
                this.redraw();
            }
        };
        const handleDeselect = (id: string) => {
            const i = this.selected.indexOf(id);
            if (i !== -1) {
                this.selected.splice(i, 1);
                this.redraw();
            }
        };
        const handleSelects = (ids: string[]) => {
            ids.forEach((id) => {
                if (this.selected.indexOf(id) === -1) this.selected.push(id);
            });
            this.redraw();
        };
        const handleDeselects = (ids: string[]) => {
            ids.forEach((id) => {
                const i = this.selected.indexOf(id);
                if (i !== -1) this.selected.splice(i, 1);
            });
            this.redraw();
        };
        const ids = Object.keys(this.lines).sort((a, b) => +b - +a);
        for (let i = 0; i < ids.length; i++) {
            const id = ids[i];
            const line = this.lines[+id];
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
            btnDel.addEventListener("click", () => this.socket.emit("delete-line", { id }));
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
            btnDel.addEventListener("click", () => this.socket.emit("delete-line", { ids: users[id].lines }));
            tr.addEventListener("focusin", () => handleSelects(users[id].lines));
            tr.addEventListener("focusout", () => handleDeselects(users[id].lines));
            tr.addEventListener("mouseenter", () => handleSelects(users[id].lines));
            tr.addEventListener("mouseleave", () => handleDeselects(users[id].lines));
        }
    };
}
