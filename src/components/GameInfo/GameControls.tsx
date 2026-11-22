import React from 'react';
import { Color } from 'chess.js';
import { Difficulty } from '../../types/chess';
import { Undo2, RotateCcw, ArrowUpDown, Volume2, VolumeX, Shield, Zap, Sparkles } from 'lucide-react';

interface GameControlsProps {
  difficulty: Difficulty;
  playerColor: Color;
  soundEnabled: boolean;
  canUndo: boolean;
  isThinking: boolean;
  onSetDifficulty: (diff: Difficulty) => void;
  onSetPlayerColor: (col: Color) => void;
  onUndo: () => void;
  onReset: () => void;
  onFlipBoard: () => void;
  onToggleSound: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  difficulty,
  playerColor,
  soundEnabled,
  canUndo,
  isThinking,
  onSetDifficulty,
  onSetPlayerColor,
  onUndo,
  onReset,
  onFlipBoard,
  onToggleSound,
}) => {
  const difficulties: { id: Difficulty; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: 'easy', label: 'Easy', icon: <Sparkles className="w-3.5 h-3.5" />, desc: 'Casual play' },
    { id: 'medium', label: 'Medium', icon: <Zap className="w-3.5 h-3.5" />, desc: 'Balanced tactician' },
    { id: 'hard', label: 'Hard', icon: <Shield className="w-3.5 h-3.5" />, desc: 'Deep Minimax AI' },
  ];

  return (
    <div className="bg-white rounded-xl border border-nomad-sand/30 shadow-sm p-4 space-y-4">
      {/* Difficulty Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
          AI Difficulty
        </label>
        <div className="grid grid-cols-3 gap-1.5 p-1 bg-nomad-sand-50/80 rounded-lg border border-nomad-sand/20">
          {difficulties.map((diff) => {
            const isSelected = difficulty === diff.id;
            return (
              <button
                key={diff.id}
                onClick={() => onSetDifficulty(diff.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-md text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-nomad-sand text-white shadow-sm'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
                }`}
                title={diff.desc}
              >
                <div className="flex items-center gap-1">
                  {diff.icon}
                  <span>{diff.label}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Side / Color Selection */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
          Play As
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => onSetPlayerColor('w')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
              playerColor === 'w'
                ? 'bg-nomad-sand-100 border-nomad-sand text-stone-900 shadow-xs'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-white border border-stone-400 inline-block shadow-xs" />
            White (First)
          </button>
          <button
            onClick={() => onSetPlayerColor('b')}
            className={`py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
              playerColor === 'b'
                ? 'bg-nomad-sand-100 border-nomad-sand text-stone-900 shadow-xs'
                : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-stone-900 inline-block shadow-xs" />
            Black (Second)
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-2 border-t border-nomad-sand/20 grid grid-cols-2 gap-2">
        <button
          onClick={onUndo}
          disabled={!canUndo || isThinking}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          title="Undo last move"
        >
          <Undo2 className="w-3.5 h-3.5" />
          Undo Move
        </button>

        <button
          onClick={onFlipBoard}
          className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors"
          title="Flip board orientation"
        >
          <ArrowUpDown className="w-3.5 h-3.5" />
          Flip Board
        </button>

        <button
          onClick={onReset}
          className="col-span-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-nomad-sand text-white hover:bg-nomad-sand-500 shadow-sm transition-colors"
          title="Start a fresh match"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          New Game
        </button>

        <button
          onClick={onToggleSound}
          className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold transition-colors ${
            soundEnabled
              ? 'bg-stone-100 text-stone-700 hover:bg-stone-200'
              : 'bg-stone-100 text-stone-400 hover:bg-stone-200'
          }`}
          title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5 text-nomad-forest" />
              Sound On
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              Muted
            </>
          )}
        </button>
      </div>
    </div>
  );
};
