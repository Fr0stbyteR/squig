type TPoint = { x: number; y: number };

type TLine = { user: string; color: string; points: TPoint[] };

type TLines = { [id: number]: TLine };
