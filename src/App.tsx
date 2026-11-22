import { useState } from 'react';
import { useChessGame } from './hooks/useChessGame';
import { Board } from './components/Chessboard/Board';
import { PlayerCard } from './components/GameInfo/PlayerCard';
import { MoveHistory } from './components/GameInfo/MoveHistory';
import { GameControls } from './components/GameInfo/GameControls';
import { GameOverModal } from './components/GameInfo/GameOverModal';
import { Compass, AlertTriangle } from 'lucide-react';

export function App() {
  const {
    board,
    turn,
    isInCheck,
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
  } = useChessGame();

  const [showGameOverModal, setShowGameOverModal] = useState<boolean>(true);

  const opponentColor = playerColor === 'w' ? 'b' : 'w';
  const isPlayerTurn = turn === playerColor;

  const handleRematch = () => {
    resetGame();
    setShowGameOverModal(true);
  };

  return (
    <div className="min-h-screen bg-nomad-background text-stone-800 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-nomad-sand/20 bg-white/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-nomad-sand text-white flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-stone-900 tracking-tight leading-none">
                Nomad Chess
              </h1>
              <p className="text-[10px] text-stone-500 font-medium">
                Pure 2D Chess • No Sign-In
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-nomad-sand-50 text-nomad-sand-700 border border-nomad-sand/30">
              <span className="w-2 h-2 rounded-full bg-nomad-sand" />
              {difficulty.toUpperCase()} AI
            </span>
          </div>
        </div>
      </header>

      {/* Main Chess Arena */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-3 sm:p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Board Column */}
          <div className="lg:col-span-7 flex flex-col items-center">
            {/* Opponent Card (AI) */}
            <div className="w-full max-w-[560px] mb-2.5">
              <PlayerCard
                name={`AI Opponent (${difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})`}
                color={opponentColor}
                isAI={true}
                isThinking={isThinking}
                isTurn={turn === opponentColor}
                capturedPieces={capturedPieces[opponentColor]}
                opponentCapturedPieces={capturedPieces[playerColor]}
              />
            </div>

            {/* Interactive 2D Chessboard */}
            <Board
              board={board}
              turn={turn}
              playerColor={playerColor}
              selectedSquare={selectedSquare}
              legalMoves={legalMoves}
              lastMove={lastMove}
              isInCheck={isInCheck}
              onSquareClick={selectSquare}
              onMakeMove={makeMove}
              isFlipped={isFlipped || playerColor === 'b'}
            />

            {/* Player Card (User) */}
            <div className="w-full max-w-[560px] mt-2.5">
              <PlayerCard
                name="You"
                color={playerColor}
                isTurn={isPlayerTurn}
                capturedPieces={capturedPieces[playerColor]}
                opponentCapturedPieces={capturedPieces[opponentColor]}
              />
            </div>
          </div>

          {/* Sidebar / Controls Column */}
          <div className="lg:col-span-5 space-y-4">
            {/* Status Banner */}
            <div
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                isInCheck
                  ? 'bg-amber-50 border-amber-300 text-amber-900'
                  : 'bg-white border-nomad-sand/30 text-stone-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {isInCheck && <AlertTriangle className="w-5 h-5 text-nomad-warning animate-bounce" />}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Match Status
                  </h4>
                  <p className="text-sm font-bold">
                    {gameResult.isOver
                      ? gameResult.reason
                      : isInCheck
                      ? `${turn === 'w' ? 'White' : 'Black'} is in Check!`
                      : isPlayerTurn
                      ? 'Your turn to move'
                      : 'AI is calculating move...'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <span
                  className={`w-3 h-3 rounded-full ${
                    turn === 'w' ? 'bg-white border-2 border-stone-800' : 'bg-stone-900'
                  }`}
                />
                <span className="text-xs font-semibold text-stone-600">
                  {turn === 'w' ? 'White' : 'Black'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <GameControls
              difficulty={difficulty}
              playerColor={playerColor}
              soundEnabled={soundEnabled}
              canUndo={moveHistory.length > 0}
              isThinking={isThinking}
              onSetDifficulty={setDifficulty}
              onSetPlayerColor={(col) => {
                setPlayerColor(col);
                resetGame();
              }}
              onUndo={undoMove}
              onReset={resetGame}
              onFlipBoard={flipBoard}
              onToggleSound={toggleSound}
            />

            {/* Move Log */}
            <MoveHistory moves={moveHistory} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-nomad-sand/20 py-3 text-center text-xs text-stone-500 bg-white/40">
        <p>Built with NomadKit Design • Play instantly offline • No login required</p>
      </footer>

      {/* Game Over Modal */}
      <GameOverModal
        result={gameResult}
        playerColor={playerColor}
        isOpen={gameResult.isOver && showGameOverModal}
        onRematch={handleRematch}
        onClose={() => setShowGameOverModal(false)}
      />
    </div>
  );
}

export default App;
