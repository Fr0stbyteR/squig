declare interface Window {
    squig: Squig;
}
declare interface Squig {
    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D;
    lines?: TLines;
    tempLine?: TLine;
    raf?: number;
}

type TPoint = { x: number; y: number };

type TLine = { color: string; points: TPoint[] };

type TLines = { [id: number]: TLine };
