import { useState, useCallback, useEffect, useRef } from 'react';
import { Chess, Square, PieceSymbol, Color, Move } from 'chess.js';
import { Difficulty, GameResult, MoveRecord, CapturedPieces } from '../types/chess';
import { getAIMove } from '../engine/ai';
import { sounds } from '../engine/sounds';

export function useChessGame() {
  const chessRef = useRef<Chess>(new Chess());
  const [, setTick] = useState(0); // Force re-render on board state mutation
  const forceUpdate = useCallback(() => setTick((t) => t + 1), []);

  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [legalMoves, setLegalMoves] = useState<Square[]>([]);
  const [lastMove, setLastMove] = useState<{ from: Square; to: Square } | null>(null);
  const [moveHistory, setMoveHistory] = useState<MoveRecord[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [playerColor, setPlayerColor] = useState<Color>('w');
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [isThinking, setIsThinking] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const [capturedPieces, setCapturedPieces] = useState<CapturedPieces>({
    w: [],
    b: [],
  });

  const [gameResult, setGameResult] = useState<GameResult>({
    isOver: false,
    status: 'in_progress',
  });

  // Calculate captured pieces by scanning move history
  const updateCapturedPieces = useCallback(() => {
    const caps: CapturedPieces = { w: [], b: [] };
    const history = chessRef.current.history({ verbose: true });
    history.forEach((m) => {
      if (m.captured) {
        if (m.color === 'w') {
          caps.w.push(m.captured);
        } else {
          caps.b.push(m.captured);
        }
      }
    });
    setCapturedPieces(caps);
  }, []);

  // Update game completion status
  const evaluateGameStatus = useCallback((): GameResult => {
    const game = chessRef.current;
    if (game.isCheckmate()) {
      const winner = game.turn() === 'w' ? 'b' : 'w';
      sounds.playGameOver();
      return {
        isOver: true,
        status: 'checkmate',
        winner,
        reason: `${winner === 'w' ? 'White' : 'Black'} wins by checkmate!`,
      };
    }
    if (game.isStalemate()) {
      return {
        isOver: true,
        status: 'stalemate',
        winner: 'draw',
        reason: 'Game drawn by stalemate.',
      };
    }
    if (game.isThreefoldRepetition()) {
      return {
        isOver: true,
        status: 'draw',
        winner: 'draw',
        reason: 'Game drawn by threefold repetition.',
      };
    }
    if (game.isInsufficientMaterial()) {
      return {
        isOver: true,
        status: 'draw',
        winner: 'draw',
        reason: 'Game drawn by insufficient material.',
      };
    }
    if (game.isDraw()) {
      return {
        isOver: true,
        status: 'draw',
        winner: 'draw',
        reason: 'Game drawn by 50-move rule.',
      };
    }
    if (game.inCheck()) {
      sounds.playCheck();
      return {
        isOver: false,
        status: 'check',
        reason: `${game.turn() === 'w' ? 'White' : 'Black'} is in check!`,
      };
    }
    return {
      isOver: false,
      status: 'in_progress',
    };
  }, []);

  // AI Move triggering
  const triggerAIMove = useCallback(async () => {
    const game = chessRef.current;
    if (game.isGameOver() || game.turn() === playerColor) return;

    setIsThinking(true);
    try {
      const aiMove = await getAIMove(game, difficulty);
      if (aiMove) {
        const result = game.move(aiMove);
        if (result) {
          if (result.captured) {
            sounds.playCapture();
          } else {
            sounds.playMove();
          }

          setLastMove({ from: result.from, to: result.to });
          setMoveHistory((prev) => [
            ...prev,
            {
              from: result.from,
              to: result.to,
              san: result.san,
              piece: result.piece,
              color: result.color,
              captured: result.captured,
              promotion: result.promotion,
            },
          ]);
          updateCapturedPieces();
          setGameResult(evaluateGameStatus());
        }
      }
    } finally {
      setIsThinking(false);
      forceUpdate();
    }
  }, [playerColor, difficulty, evaluateGameStatus, updateCapturedPieces, forceUpdate]);

  // If game starts with AI turn (e.g., player chose Black)
  useEffect(() => {
    const game = chessRef.current;
    if (game.turn() !== playerColor && !game.isGameOver()) {
      triggerAIMove();
    }
  }, [playerColor, triggerAIMove]);

  // Make a player move
  const makeMove = useCallback(
    (from: Square, to: Square, promotion: PieceSymbol = 'q'): boolean => {
      const game = chessRef.current;
      if (game.isGameOver() || isThinking || game.turn() !== playerColor) {
        return false;
      }

      try {
        const move = game.move({
          from,
          to,
          promotion,
        });

        if (move) {
          if (move.captured) {
            sounds.playCapture();
          } else {
            sounds.playMove();
          }

          setSelectedSquare(null);
          setLegalMoves([]);
          setLastMove({ from: move.from, to: move.to });
          setMoveHistory((prev) => [
            ...prev,
            {
              from: move.from,
              to: move.to,
              san: move.san,
              piece: move.piece,
              color: move.color,
              captured: move.captured,
              promotion: move.promotion,
            },
          ]);
          updateCapturedPieces();
          const newStatus = evaluateGameStatus();
          setGameResult(newStatus);
          forceUpdate();

          // Queue AI move if game not over
          if (!newStatus.isOver) {
            setTimeout(() => {
              triggerAIMove();
            }, 50);
          }
          return true;
        }
      } catch {
        return false;
      }
      return false;
    },
    [isThinking, playerColor, updateCapturedPieces, evaluateGameStatus, forceUpdate, triggerAIMove]
  );

  // Square selection and move targeting
  const selectSquare = useCallback(
    (square: Square) => {
      const game = chessRef.current;
      if (game.isGameOver() || isThinking || game.turn() !== playerColor) return;

      const pieceOnSquare = game.get(square);

      // If already selected and clicking another square that is a legal move
      if (selectedSquare && legalMoves.includes(square)) {
        makeMove(selectedSquare, square);
        return;
      }

      // If clicked on own piece, select it and compute legal destination squares
      if (pieceOnSquare && pieceOnSquare.color === playerColor) {
        setSelectedSquare(square);
        const moves = game.moves({ square, verbose: true }) as Move[];
        setLegalMoves(moves.map((m) => m.to));
      } else {
        setSelectedSquare(null);
        setLegalMoves([]);
      }
    },
    [isThinking, playerColor, selectedSquare, legalMoves, makeMove]
  );

  // Undo move: Revert AI move and player's move so player can retry
  const undoMove = useCallback(() => {
    const game = chessRef.current;
    if (isThinking) return;

    if (moveHistory.length === 0) return;

    // Undo AI move first if it was player's turn to move next
    if (game.turn() === playerColor && moveHistory.length >= 2) {
      game.undo();
      game.undo();
      setMoveHistory((prev) => prev.slice(0, -2));
    } else {
      game.undo();
      setMoveHistory((prev) => prev.slice(0, -1));
    }

    const history = game.history({ verbose: true });
    const last = history.length > 0 ? history[history.length - 1] : null;
    setLastMove(last ? { from: last.from, to: last.to } : null);
    setSelectedSquare(null);
    setLegalMoves([]);
    updateCapturedPieces();
    setGameResult(evaluateGameStatus());
    forceUpdate();
  }, [isThinking, playerColor, moveHistory.length, updateCapturedPieces, evaluateGameStatus, forceUpdate]);

  // Restart new game
  const resetGame = useCallback(() => {
    chessRef.current.reset();
    setSelectedSquare(null);
    setLegalMoves([]);
    setLastMove(null);
    setMoveHistory([]);
    setCapturedPieces({ w: [], b: [] });
    setGameResult({ isOver: false, status: 'in_progress' });
    setIsThinking(false);
    forceUpdate();

    if (playerColor === 'b') {
      setTimeout(() => {
        triggerAIMove();
      }, 300);
    }
  }, [playerColor, forceUpdate, triggerAIMove]);

  const toggleSound = useCallback(() => {
    setSoundEnabled((prev) => {
      const next = !prev;
      sounds.setEnabled(next);
      return next;
    });
  }, []);

  const flipBoard = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  return {
    board: chessRef.current.board(),
    turn: chessRef.current.turn(),
    isInCheck: chessRef.current.inCheck(),
    selectedSquare,
    legalMoves,
    lastMove,
    moveHistory,
    capturedPieces,
    difficulty,
    playerColor,
    isFlipped,
    isThinking,
    gameResult,
    soundEnabled,
    setDifficulty,
    setPlayerColor,
    selectSquare,
    makeMove,
    undoMove,
    resetGame,
    toggleSound,
    flipBoard,
  };
}
