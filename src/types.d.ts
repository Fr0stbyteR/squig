type TPoint = { x: number; y: number };

type TLine = { user: string; color: string; points: TPoint[] };

type TLines = { [id: number]: TLine };

type TText = { user: string; color: string; text: string; position: TPoint };

type TTexts = { [id: number]: TText };
