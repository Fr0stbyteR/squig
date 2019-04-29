export type WhiteBoardOptions = { w?: number; h?: number };
export type Line = Point[];
export type Point = { x: number; y: number };
export class WhiteBoard {
    ctx: CanvasRenderingContext2D;
    color: string;

    static compressLine(lineIn: Line) {
        const lineOut = new Uint32Array(lineIn.length);
        lineIn.forEach((p, i) => lineOut[i] = p.x << 16 + p.y);
        return lineOut;
    }
    constructor(ctx: CanvasRenderingContext2D, options?: WhiteBoardOptions) {
        this.ctx = ctx;
        this.init(options);
    }
    init(options: WhiteBoardOptions) {
        this.canvas.width = options.w || 1280;
        this.canvas.height = options.h || 720;
    }
    bind() {
        this.canvas.addEventListener("mousedown", (e) => {
            const pos = this.toPos(e);
            const line = [pos] as Line;

            this.canvas.addEventListener("mousemove", (e) => {
                const pos = this.toPos(e);
                line.push(pos);
            });
        });
    }
    toPos(e: MouseEvent) {
        const rect = this.canvas.getBoundingClientRect();
        return {
            x: (e.pageX - rect.left) / rect.width * this.w,
            y: (e.pageY - rect.top) / rect.height * this.h
        };
    }
    get canvas() {
        return this.ctx.canvas;
    }
    get w() {
        return this.canvas.width;
    }
    get h() {
        return this.canvas.height;
    }
}
