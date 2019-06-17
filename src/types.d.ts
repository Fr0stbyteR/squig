declare interface Window {
    squig: Squig;
}
declare interface Squig {
    socket?: SocketIOClient.Socket;
    canvas?: HTMLCanvasElement;
    ctx?: CanvasRenderingContext2D;
    lines?: TLines;
    tempLine?: TLine;
    raf?: number;
}
declare interface SquigAdmin {
    tableTime?: HTMLTableElement;
    tableUser?: HTMLTableElement;
}

type TPoint = { x: number; y: number };

type TLine = { user: string; color: string; points: TPoint[] };

type TLines = { [id: number]: TLine };
