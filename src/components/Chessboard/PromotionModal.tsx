import React from 'react';
import { Color, PieceSymbol } from 'chess.js';
import { Piece } from './Piece';

interface PromotionModalProps {
  color: Color;
  isOpen: boolean;
  onSelect: (piece: PieceSymbol) => void;
  onCancel: () => void;
}

export const PromotionModal: React.FC<PromotionModalProps> = ({
  color,
  isOpen,
  onSelect,
  onCancel,
}) => {
  if (!isOpen) return null;

  const promotionOptions: { symbol: PieceSymbol; label: string }[] = [
    { symbol: 'q', label: 'Queen' },
    { symbol: 'r', label: 'Rook' },
    { symbol: 'b', label: 'Bishop' },
    { symbol: 'n', label: 'Knight' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 backdrop-blur-sm p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl p-6 border border-nomad-sand/30 max-w-sm w-full text-center">
        <h3 className="text-xl font-bold text-stone-800 mb-1">Pawn Promotion</h3>
        <p className="text-sm text-stone-500 mb-6">Choose a piece to promote your pawn:</p>

        <div className="grid grid-cols-4 gap-3 mb-6">
          {promotionOptions.map((opt) => (
            <button
              key={opt.symbol}
              onClick={() => onSelect(opt.symbol)}
              className="flex flex-col items-center justify-center p-3 rounded-xl border border-nomad-sand/40 hover:border-nomad-ocean hover:bg-nomad-sand-50 transition-all transform hover:-translate-y-1 active:translate-y-0 group focus:outline-none focus:ring-2 focus:ring-nomad-ocean"
            >
              <div className="w-12 h-12 mb-1 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Piece type={opt.symbol} color={color} />
              </div>
              <span className="text-xs font-semibold text-stone-700">{opt.label}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onCancel}
          className="text-xs font-medium text-stone-400 hover:text-stone-600 transition-colors"
        >
          Cancel Move
        </button>
      </div>
    </div>
  );
};
