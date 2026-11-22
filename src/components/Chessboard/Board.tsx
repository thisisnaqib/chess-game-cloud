import React, { useState } from 'react';
import { Square as SquareType, PieceSymbol, Color } from 'chess.js';
import { Square } from './Square';
import { PromotionModal } from './PromotionModal';

interface BoardProps {
  board: ({ square: SquareType; type: PieceSymbol; color: Color } | null)[][];
  turn: Color;
  playerColor: Color;
  selectedSquare: SquareType | null;
  legalMoves: SquareType[];
  lastMove: { from: SquareType; to: SquareType } | null;
  isInCheck: boolean;
  onSquareClick: (square: SquareType) => void;
  onMakeMove: (from: SquareType, to: SquareType, promotion?: PieceSymbol) => boolean;
  isFlipped?: boolean;
}

export const Board: React.FC<BoardProps> = ({
  board,
  turn,
  selectedSquare,
  legalMoves,
  lastMove,
  isInCheck,
  onSquareClick,
  onMakeMove,
  isFlipped = false,
}) => {
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: SquareType;
    to: SquareType;
    color: Color;
  } | null>(null);

  // Drag-and-drop source tracking
  const handleDragStart = (square: SquareType, pieceColor: Color, e: React.DragEvent) => {
    // Only allow dragging current turn's pieces
    if (pieceColor !== turn) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData('text/plain', square);
    onSquareClick(square);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (targetSquare: SquareType, e: React.DragEvent) => {
    e.preventDefault();
    const sourceSquare = e.dataTransfer.getData('text/plain') as SquareType;
    if (!sourceSquare || sourceSquare === targetSquare) return;

    // Check if move is a pawn promotion
    const isPawnPromotion = checkIsPromotion(sourceSquare, targetSquare);
    if (isPawnPromotion) {
      setPendingPromotion({
        from: sourceSquare,
        to: targetSquare,
        color: turn,
      });
      return;
    }

    onMakeMove(sourceSquare, targetSquare);
  };

  const checkIsPromotion = (from: SquareType, to: SquareType): boolean => {
    const fromRank = from[1];
    const toRank = to[1];
    // Find piece on from square
    let pieceType: PieceSymbol | null = null;
    let pieceColor: Color | null = null;
    for (const row of board) {
      for (const sq of row) {
        if (sq && sq.square === from) {
          pieceType = sq.type;
          pieceColor = sq.color;
          break;
        }
      }
    }

    if (pieceType === 'p') {
      if (pieceColor === 'w' && fromRank === '7' && toRank === '8') return true;
      if (pieceColor === 'b' && fromRank === '2' && toRank === '1') return true;
    }
    return false;
  };

  const handleSquareClick = (square: SquareType) => {
    if (selectedSquare) {
      const isPawnPromotion = checkIsPromotion(selectedSquare, square);
      if (isPawnPromotion && legalMoves.includes(square)) {
        setPendingPromotion({
          from: selectedSquare,
          to: square,
          color: turn,
        });
        return;
      }
    }
    onSquareClick(square);
  };

  const handlePromotionSelect = (piece: PieceSymbol) => {
    if (pendingPromotion) {
      onMakeMove(pendingPromotion.from, pendingPromotion.to, piece);
      setPendingPromotion(null);
    }
  };

  // Convert board rows according to orientation
  // standard board[0] is rank 8 (black side), board[7] is rank 1 (white side)
  const displayRows = isFlipped ? [...board].reverse().map(row => [...row].reverse()) : board;

  const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
  const displayFiles = isFlipped ? [...files].reverse() : files;

  return (
    <div className="relative w-full max-w-[560px] aspect-square rounded-2xl p-2.5 sm:p-3.5 bg-gradient-to-br from-[#E9D5A1] to-[#D4A373] shadow-xl border-4 border-[#C28956]/40 select-none">
      <div className="w-full h-full grid grid-cols-8 grid-rows-8 rounded-lg overflow-hidden border border-stone-800/10 shadow-inner">
        {displayRows.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            const actualRank = isFlipped ? rowIndex + 1 : 8 - rowIndex;
            const actualFile = displayFiles[colIndex];
            const squareCoord = `${actualFile}${actualRank}` as SquareType;

            const isLight = (colIndex + rowIndex) % 2 === (isFlipped ? 1 : 0);
            const isSelected = selectedSquare === squareCoord;
            const isLegal = legalMoves.includes(squareCoord);
            const isLast =
              (lastMove?.from === squareCoord || lastMove?.to === squareCoord) ?? false;
            const isKingInCheck =
              isInCheck && cell?.type === 'k' && cell?.color === turn;

            return (
              <Square
                key={squareCoord}
                square={squareCoord}
                isLight={isLight}
                piece={cell ? { type: cell.type, color: cell.color } : null}
                isSelected={isSelected}
                isLegalMove={isLegal}
                isCaptureMove={isLegal && !!cell}
                isLastMove={isLast}
                isInCheck={isKingInCheck}
                showRankLabel={colIndex === 0 ? String(actualRank) : undefined}
                showFileLabel={rowIndex === 7 ? actualFile : undefined}
                onClick={() => handleSquareClick(squareCoord)}
                onDragStart={(e) => cell && handleDragStart(squareCoord, cell.color, e)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(squareCoord, e)}
              />
            );
          })
        )}
      </div>

      {/* Pawn Promotion Modal */}
      <PromotionModal
        isOpen={!!pendingPromotion}
        color={pendingPromotion?.color || turn}
        onSelect={handlePromotionSelect}
        onCancel={() => setPendingPromotion(null)}
      />
    </div>
  );
};
