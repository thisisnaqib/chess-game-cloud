import React from 'react';
import { Square as SquareType, PieceSymbol, Color } from 'chess.js';
import { Piece } from './Piece';

interface SquareProps {
  square: SquareType;
  isLight: boolean;
  piece?: { type: PieceSymbol; color: Color } | null;
  isSelected: boolean;
  isLegalMove: boolean;
  isCaptureMove: boolean;
  isLastMove: boolean;
  isInCheck: boolean;
  showFileLabel?: string;
  showRankLabel?: string;
  onClick: () => void;
  onDragStart?: (e: React.DragEvent) => void;
  onDragOver?: (e: React.DragEvent) => void;
  onDrop?: (e: React.DragEvent) => void;
}

export const Square: React.FC<SquareProps> = ({
  square,
  isLight,
  piece,
  isSelected,
  isLegalMove,
  isCaptureMove,
  isLastMove,
  isInCheck,
  showFileLabel,
  showRankLabel,
  onClick,
  onDragStart,
  onDragOver,
  onDrop,
}) => {
  // Base board colors matching NomadKit
  const bgColor = isLight ? 'bg-[#FAEDCD]' : 'bg-[#D4A373]';
  const labelColor = isLight ? 'text-[#A46E3F]' : 'text-[#FAEDCD]';

  return (
    <div
      onClick={onClick}
      onDragOver={onDragOver}
      onDrop={onDrop}
      data-square={square}
      className={`relative aspect-square flex items-center justify-center select-none cursor-pointer transition-colors duration-150 ${bgColor} ${
        isSelected ? 'ring-4 ring-inset ring-nomad-ocean z-10' : ''
      } ${
        isLastMove && !isSelected ? 'after:absolute after:inset-0 after:bg-nomad-ocean/15' : ''
      } ${
        isInCheck ? 'animate-pulse bg-red-400/80 ring-2 ring-red-600' : ''
      }`}
    >
      {/* File & Rank Coordinates for edge squares */}
      {showRankLabel && (
        <span
          className={`absolute top-0.5 left-1 text-[10px] md:text-xs font-semibold leading-none pointer-events-none ${labelColor}`}
        >
          {showRankLabel}
        </span>
      )}
      {showFileLabel && (
        <span
          className={`absolute bottom-0.5 right-1 text-[10px] md:text-xs font-semibold leading-none pointer-events-none ${labelColor}`}
        >
          {showFileLabel}
        </span>
      )}

      {/* Chess Piece with Drag & Drop */}
      {piece && (
        <div
          draggable={true}
          onDragStart={onDragStart}
          className="w-4/5 h-4/5 flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-grab active:cursor-grabbing z-10"
        >
          <Piece type={piece.type} color={piece.color} />
        </div>
      )}

      {/* Legal Move Indicators */}
      {isLegalMove && !isCaptureMove && (
        <div className="absolute w-3 h-3 md:w-3.5 md:h-3.5 rounded-full bg-nomad-ocean/70 shadow-sm pointer-events-none z-20 transition-all transform hover:scale-125" />
      )}

      {/* Capture Move Highlight Ring */}
      {isLegalMove && isCaptureMove && (
        <div className="absolute inset-1 rounded-full border-4 border-nomad-forest/80 pointer-events-none z-20 animate-pulse" />
      )}
    </div>
  );
};
