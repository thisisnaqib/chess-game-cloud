import React, { useEffect, useRef } from 'react';
import { MoveRecord } from '../../types/chess';
import { ScrollText } from 'lucide-react';

interface MoveHistoryProps {
  moves: MoveRecord[];
}

export const MoveHistory: React.FC<MoveHistoryProps> = ({ moves }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Group moves into turns (White move + Black move)
  const turns: { number: number; white?: MoveRecord; black?: MoveRecord }[] = [];
  for (let i = 0; i < moves.length; i += 2) {
    turns.push({
      number: Math.floor(i / 2) + 1,
      white: moves[i],
      black: moves[i + 1],
    });
  }

  // Scroll to bottom on new move
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [moves.length]);

  return (
    <div className="bg-white rounded-xl border border-nomad-sand/30 shadow-sm flex flex-col h-48 md:h-64 overflow-hidden">
      <div className="flex items-center gap-2 px-3.5 py-2.5 bg-nomad-sand-50/70 border-b border-nomad-sand/20">
        <ScrollText className="w-4 h-4 text-nomad-sand-700" />
        <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
          Move Log
        </h4>
        <span className="text-[11px] text-stone-400 ml-auto">
          {moves.length} {moves.length === 1 ? 'half-move' : 'moves'}
        </span>
      </div>

      <div
        ref={scrollRef}
        className="flex-1 p-2 overflow-y-auto font-mono text-xs space-y-0.5"
      >
        {turns.length === 0 ? (
          <div className="h-full flex items-center justify-center text-stone-400 text-xs italic">
            No moves yet. Make your opening move!
          </div>
        ) : (
          turns.map((turn) => {
            const isLatestWhite =
              turn.white &&
              moves[moves.length - 1] === turn.white;
            const isLatestBlack =
              turn.black &&
              moves[moves.length - 1] === turn.black;

            return (
              <div
                key={turn.number}
                className="grid grid-cols-12 py-1 px-2 rounded hover:bg-nomad-sand-50/50 transition-colors"
              >
                <span className="col-span-2 text-stone-400 select-none">
                  {turn.number}.
                </span>
                <span
                  className={`col-span-5 px-1.5 py-0.5 rounded ${
                    isLatestWhite
                      ? 'bg-nomad-ocean/20 text-nomad-ocean font-bold'
                      : 'text-stone-800'
                  }`}
                >
                  {turn.white?.san}
                </span>
                <span
                  className={`col-span-5 px-1.5 py-0.5 rounded ${
                    isLatestBlack
                      ? 'bg-nomad-ocean/20 text-nomad-ocean font-bold'
                      : 'text-stone-800'
                  }`}
                >
                  {turn.black ? turn.black.san : ''}
                </span>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
