import { PieceSymbol, Color, Square } from 'chess.js';

export type Difficulty = 'easy' | 'medium' | 'hard';

export interface MoveRecord {
  from: Square;
  to: Square;
  san: string;
  piece: PieceSymbol;
  color: Color;
  captured?: PieceSymbol;
  promotion?: PieceSymbol;
}

export type GameStatus = 'in_progress' | 'check' | 'checkmate' | 'stalemate' | 'draw';

export interface GameResult {
  isOver: boolean;
  status: GameStatus;
  winner?: Color | 'draw';
  reason?: string;
}

export interface CapturedPieces {
  w: PieceSymbol[]; // Pieces captured by White (i.e. Black pieces lost)
  b: PieceSymbol[]; // Pieces captured by Black (i.e. White pieces lost)
}
