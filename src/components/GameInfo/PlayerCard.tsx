import React from 'react';
import { Color, PieceSymbol } from 'chess.js';
import { Piece } from '../Chessboard/Piece';
import { PIECE_VALUES } from '../../engine/evaluation';

interface PlayerCardProps {
  name: string;
  color: Color;
  isAI?: boolean;
  isThinking?: boolean;
  isTurn: boolean;
  capturedPieces: PieceSymbol[];
  opponentCapturedPieces: PieceSymbol[];
}

export const PlayerCard: React.FC<PlayerCardProps> = ({
  name,
  color,
  isAI,
  isThinking,
  isTurn,
  capturedPieces,
  opponentCapturedPieces,
}) => {
  const isWhite = color === 'w';

  // Calculate material difference
  const myMaterial = capturedPieces.reduce(
    (sum, p) => sum + (PIECE_VALUES[p] || 0),
    0
  );
  const oppMaterial = opponentCapturedPieces.reduce(
    (sum, p) => sum + (PIECE_VALUES[p] || 0),
    0
  );
  const diffInCentipawns = myMaterial - oppMaterial;
  const materialAdvantage = Math.floor(diffInCentipawns / 100);

  // Group captured pieces for tidy rendering
  const pieceOrder: PieceSymbol[] = ['q', 'r', 'b', 'n', 'p'];
  const sortedCaptured = [...capturedPieces].sort(
    (a, b) => pieceOrder.indexOf(a) - pieceOrder.indexOf(b)
  );

  return (
    <div
      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border transition-all ${
        isTurn
          ? 'bg-white border-nomad-sand shadow-md ring-1 ring-nomad-sand/50'
          : 'bg-white/70 border-nomad-sand/20'
      }`}
    >
      <div className="flex items-center gap-2.5">
        {/* Color Badge / Avatar */}
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shadow-sm border ${
            isWhite
              ? 'bg-[#FFFDF7] text-stone-800 border-nomad-sand'
              : 'bg-[#2D2824] text-white border-stone-700'
          }`}
        >
          {isWhite ? 'W' : 'B'}
        </div>

        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-sm text-stone-800">{name}</span>
            {isAI && (
              <span className="text-[10px] font-medium uppercase tracking-wider px-1.5 py-0.5 rounded-md bg-nomad-sand-100 text-stone-700">
                Bot
              </span>
            )}
            {isThinking && (
              <span className="flex items-center gap-1 text-[11px] text-nomad-ocean font-medium animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-nomad-ocean animate-ping" />
                Thinking...
              </span>
            )}
          </div>

          {/* Captured Pieces by this player */}
          <div className="flex items-center gap-1 mt-0.5 min-h-[18px]">
            {sortedCaptured.length > 0 ? (
              <div className="flex items-center -space-x-1">
                {sortedCaptured.map((p, idx) => (
                  <div key={idx} className="w-4 h-4">
                    <Piece type={p} color={isWhite ? 'b' : 'w'} />
                  </div>
                ))}
              </div>
            ) : (
              <span className="text-[11px] text-stone-400">No captures</span>
            )}
            {materialAdvantage > 0 && (
              <span className="text-[11px] font-bold text-nomad-forest ml-1">
                +{materialAdvantage}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Turn Indicator */}
      {isTurn && (
        <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-nomad-ocean/15 text-nomad-ocean flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-nomad-ocean" />
          Turn
        </span>
      )}
    </div>
  );
};
