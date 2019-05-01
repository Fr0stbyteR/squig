type TPoint = { x: number; y: number };

type TLine = { color: string; points: TPoint[] };

type TLines = { [id: number]: TLine };
