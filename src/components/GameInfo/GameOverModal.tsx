import React from 'react';
import { Color } from 'chess.js';
import { GameResult } from '../../types/chess';
import { Trophy, Frown, Handshake, RotateCcw, Eye } from 'lucide-react';

interface GameOverModalProps {
  result: GameResult;
  playerColor: Color;
  isOpen: boolean;
  onRematch: () => void;
  onClose: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  result,
  playerColor,
  isOpen,
  onRematch,
  onClose,
}) => {
  if (!isOpen || !result.isOver) return null;

  const isPlayerWin = result.winner === playerColor;
  const isDraw = result.winner === 'draw' || result.status === 'stalemate' || result.status === 'draw';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-6 sm:p-8 max-w-sm w-full text-center border border-nomad-sand/30">
        <div className="flex justify-center mb-4">
          {isDraw ? (
            <div className="w-16 h-16 rounded-full bg-nomad-ocean/10 text-nomad-ocean flex items-center justify-center">
              <Handshake className="w-8 h-8" />
            </div>
          ) : isPlayerWin ? (
            <div className="w-16 h-16 rounded-full bg-nomad-forest/10 text-nomad-forest flex items-center justify-center ring-4 ring-nomad-forest/20">
              <Trophy className="w-8 h-8 animate-bounce" />
            </div>
          ) : (
            <div className="w-16 h-16 rounded-full bg-stone-100 text-stone-500 flex items-center justify-center">
              <Frown className="w-8 h-8" />
            </div>
          )}
        </div>

        <h3 className="text-2xl font-extrabold text-stone-900 mb-1">
          {isDraw ? 'Game Drawn' : isPlayerWin ? 'Victory!' : 'Game Over'}
        </h3>
        <p className="text-sm text-stone-600 mb-6 font-medium">
          {result.reason || (isPlayerWin ? 'Well played!' : 'The AI won this match.')}
        </p>

        <div className="space-y-2.5">
          <button
            onClick={onRematch}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-bold bg-nomad-sand hover:bg-nomad-sand-500 text-white shadow-md transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <RotateCcw className="w-4 h-4" />
            Play Again
          </button>

          <button
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          >
            <Eye className="w-4 h-4" />
            Review Board
          </button>
        </div>
      </div>
    </div>
  );
};
