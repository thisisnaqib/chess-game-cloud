import { Chess, Move } from 'chess.js';
import { Difficulty } from '../types/chess';
import { evaluateBoard, PIECE_VALUES } from './evaluation';

/**
 * Orders moves to improve alpha-beta pruning efficiency:
 * Captures, checks, and promotions first.
 */
function orderMoves(moves: Move[]): Move[] {
  return [...moves].sort((a, b) => {
    let scoreA = 0;
    let scoreB = 0;

    if (a.captured) {
      scoreA += (PIECE_VALUES[a.captured] || 100) * 10 - (PIECE_VALUES[a.piece] || 100);
    }
    if (a.promotion) scoreA += 800;
    if (a.san.includes('+')) scoreA += 150;

    if (b.captured) {
      scoreB += (PIECE_VALUES[b.captured] || 100) * 10 - (PIECE_VALUES[b.piece] || 100);
    }
    if (b.promotion) scoreB += 800;
    if (b.san.includes('+')) scoreB += 150;

    return scoreB - scoreA;
  });
}

/**
 * Minimax algorithm with Alpha-Beta pruning
 */
function minimax(
  game: Chess,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number {
  if (depth === 0 || game.isGameOver()) {
    return evaluateBoard(game);
  }

  const legalMoves = orderMoves(game.moves({ verbose: true }));

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of legalMoves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, false);
      game.undo();

      maxEval = Math.max(maxEval, evaluation);
      alpha = Math.max(alpha, evaluation);
      if (beta <= alpha) break; // Beta cut-off
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of legalMoves) {
      game.move(move);
      const evaluation = minimax(game, depth - 1, alpha, beta, true);
      game.undo();

      minEval = Math.min(minEval, evaluation);
      beta = Math.min(beta, evaluation);
      if (beta <= alpha) break; // Alpha cut-off
    }
    return minEval;
  }
}

/**
 * Calculate best move based on chosen difficulty
 */
export async function getAIMove(
  game: Chess,
  difficulty: Difficulty
): Promise<Move | null> {
  const legalMoves = game.moves({ verbose: true });
  if (legalMoves.length === 0) return null;

  // Add realistic thinking delay for better UX
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 400));

  // --- EASY DIFFICULTY ---
  // Beginner-friendly: 60% random choice, 40% immediate capture/check if available
  if (difficulty === 'easy') {
    const captures = legalMoves.filter((m) => m.captured || m.san.includes('+'));
    if (captures.length > 0 && Math.random() < 0.4) {
      return captures[Math.floor(Math.random() * captures.length)];
    }
    return legalMoves[Math.floor(Math.random() * legalMoves.length)];
  }

  // --- MEDIUM & HARD DIFFICULTY ---
  const isWhite = game.turn() === 'w';
  const depth = difficulty === 'medium' ? 2 : 3;

  let bestMove: Move = legalMoves[0];
  let bestValue = isWhite ? -Infinity : Infinity;

  const ordered = orderMoves(legalMoves);

  for (const move of ordered) {
    game.move(move);
    const moveValue = minimax(
      game,
      depth - 1,
      -Infinity,
      Infinity,
      !isWhite
    );
    game.undo();

    if (isWhite) {
      if (moveValue > bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    } else {
      if (moveValue < bestValue) {
        bestValue = moveValue;
        bestMove = move;
      }
    }
  }

  return bestMove;
}
