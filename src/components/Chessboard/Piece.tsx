import React from 'react';
import { PieceSymbol, Color } from 'chess.js';

interface PieceProps {
  type: PieceSymbol;
  color: Color;
  className?: string;
}

export const Piece: React.FC<PieceProps> = ({ type, color, className = 'w-full h-full' }) => {
  const isWhite = color === 'w';
  
  // High contrast, warm styling matching NomadKit:
  // White pieces: clean soft warm ivory with subtle outline
  // Black pieces: deep graphite/slate with fine warm highlight
  const fill = isWhite ? '#FFFFFF' : '#2D2824';
  const stroke = isWhite ? '#443A32' : '#1C1917';
  const detailStroke = isWhite ? '#6B5E52' : '#D4A373';

  switch (type) {
    case 'p': // Pawn
      return (
        <svg viewBox="0 0 45 45" className={className} aria-label={`${isWhite ? 'White' : 'Black'} Pawn`}>
          <path
            d="M22.5 9c-2.21 0-4 1.79-4 4 0 .89.29 1.71.78 2.38C17.33 16.5 16 18.59 16 21c0 2.03.94 3.84 2.41 5.03-3 1.06-7.41 5.55-7.41 13.47h23c0-7.92-4.41-12.41-7.41-13.47 1.47-1.19 2.41-3 2.41-5.03 0-2.41-1.33-4.5-3.28-5.62.49-.67.78-1.49.78-2.38 0-2.21-1.79-4-4-4z"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M12 36.5c1.5-1 4.5-1.5 10.5-1.5s9 0.5 10.5 1.5" stroke={detailStroke} strokeWidth="1" fill="none" />
        </svg>
      );

    case 'n': // Knight
      return (
        <svg viewBox="0 0 45 45" className={className} aria-label={`${isWhite ? 'White' : 'Black'} Knight`}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 10c10.5 1 16.5 8 16 29H15c0-9 10-6.5 8-21" />
            <path d="M24 18c.38 2.91-5.55 7.37-8 9-3 2-2.82 4.34-5 4-1.042-.94 1.41-4.04 3-6 2.1-2.6 4.38-4.25 5-7 .34-1.5-1.5-2.5-3-2.5-1.5 0-2.5 1-3.5 2.5-1 1.5-1.5 2-2 4.5-1.5-1-1.5-2.5-1.5-3.5 0-3 3-6 7.5-7.5C18 7.5 20.5 7.5 22 10z" />
            <circle cx="14" cy="15.5" r="1.5" fill={isWhite ? '#443A32' : '#FFFDF7'} stroke="none" />
          </g>
          <path d="M11 38.5c2-1 6-1.5 11.5-1.5s9.5 0.5 11.5 1.5" stroke={detailStroke} strokeWidth="1" fill="none" />
        </svg>
      );

    case 'b': // Bishop
      return (
        <svg viewBox="0 0 45 45" className={className} aria-label={`${isWhite ? 'White' : 'Black'} Bishop`}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 36c3.39-.97 10.11.43 13.5-2 3.39 2.43 10.11 1.03 13.5 2 0 0 1.65.54 3 2-.68.97-1.65.99-3 .5-3.39-.97-10.11.46-13.5-1-3.39 1.46-10.11.03-13.5 1-1.354.49-2.323.47-3-.5 1.354-1.94 3-2 3-2z" />
            <path d="M15 32c2.5 2.5 12.5 2.5 15 0 .5-1.5 0-2 0-2 0-2.5-2.5-4-2.5-4 5.5-1.5 6-11.5-5-15.5-11 4-10.5 14-5 15.5 0 0-2.5 1.5-2.5 4 0 0-.5.5 0 2z" />
            <path d="M25 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 1 1 5 0z" />
          </g>
          <path d="M17.5 26h10M22.5 21v10" stroke={detailStroke} strokeWidth="1.2" strokeLinecap="round" />
          <path d="M12 36.5c2-1 6-1.5 10.5-1.5s8.5 0.5 10.5 1.5" stroke={detailStroke} strokeWidth="1" fill="none" />
        </svg>
      );

    case 'r': // Rook
      return (
        <svg viewBox="0 0 45 45" className={className} aria-label={`${isWhite ? 'White' : 'Black'} Rook`}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 39h27v-3H9v3zM12 36v-4h21v4H12zM14 29.5v-13h17v13H14z" />
            <path d="M14 16.5L11 14v-5h4v3h4V9h4v3h4V9h4v5l-3 2.5H14z" />
          </g>
          <path d="M12 35.5h21M14 29.5h17" stroke={detailStroke} strokeWidth="1" />
        </svg>
      );

    case 'q': // Queen
      return (
        <svg viewBox="0 0 45 45" className={className} aria-label={`${isWhite ? 'White' : 'Black'} Queen`}>
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="6" cy="12" r="2.5" />
            <circle cx="14" cy="9" r="2.5" />
            <circle cx="22.5" cy="8" r="2.5" />
            <circle cx="31" cy="9" r="2.5" />
            <circle cx="39" cy="12" r="2.5" />
            <path d="M9 26c8.5-1.5 21-1.5 27 0l2-12-7 11-8.5-15-8.5 15-7-11 2 12z" />
            <path d="M9 26c0 2 1.5 2 2.5 4 1 1.5 1 1 .5 3.5-1.5 1-1.5 2.5-1.5 2.5-1.5 1.5.5 2.5.5 2.5 6.5 1 16.5 1 23 0 0 0 2-1 .5-2.5 0 0 0-1.5-1.5-2.5-.5-2.5-.5-2 .5-3.5 1-2 2.5-2 2.5-4-8.5-1.5-18.5-1.5-27 0z" />
            <path d="M11 38.5h23v2H11v-2z" />
          </g>
          <path d="M11 28.5c4-0.5 19-0.5 23 0" stroke={detailStroke} strokeWidth="1" />
        </svg>
      );

    case 'k': // King
      return (
        <svg viewBox="0 0 45 45" className={className} aria-label={`${isWhite ? 'White' : 'Black'} King`}>
          {/* Cross */}
          <path d="M22.5 6v7M19 9.5h7" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
          <g fill={fill} stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.5 13c-4.5 0-9 4.5-9 8.5 0 4 3 6.5 5 7.5l-2.5 7h13l-2.5-7c2-1 5-3.5 5-7.5 0-4-4.5-8.5-9-8.5z" />
            <path d="M11.5 37h22v3h-22v-3z" />
          </g>
          <path d="M16 29h13M14 36h17" stroke={detailStroke} strokeWidth="1" />
          <circle cx="22.5" cy="20" r="2.5" fill="none" stroke={detailStroke} strokeWidth="1" />
        </svg>
      );

    default:
      return null;
  }
};
