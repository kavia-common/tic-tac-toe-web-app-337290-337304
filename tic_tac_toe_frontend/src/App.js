import React, { useEffect, useMemo, useState } from "react";
import "./App.css";

const LINES = [
  // Rows
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  // Cols
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  // Diagonals
  [0, 4, 8],
  [2, 4, 6],
];

function getWinner(board) {
  for (const [a, b, c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a, b, c] };
    }
  }
  return null;
}

function getIsDraw(board, winner) {
  return !winner && board.every((cell) => cell !== null);
}

// PUBLIC_INTERFACE
function App() {
  /** App state for local two-player Tic Tac Toe. */
  const [theme] = useState("light"); // Keep a stable light theme per style guide
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [status, setStatus] = useState("X goes first");

  const winner = useMemo(() => getWinner(board), [board]);
  const isDraw = useMemo(() => getIsDraw(board, winner), [board, winner]);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    if (winner) {
      setStatus(`Winner: ${winner.player}`);
      return;
    }
    if (isDraw) {
      setStatus("Draw — no more moves");
      return;
    }
    setStatus(`Turn: ${isXNext ? "X" : "O"}`);
  }, [winner, isDraw, isXNext]);

  // PUBLIC_INTERFACE
  const handleCellClick = (index) => {
    /** Handle a user move on the specified cell index. */
    if (winner || board[index] !== null) return;

    setBoard((prev) => {
      const next = [...prev];
      next[index] = isXNext ? "X" : "O";
      return next;
    });
    setIsXNext((prev) => !prev);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /** Reset the current game back to the initial empty board. */
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setStatus("X goes first");
  };

  const winningSquares = winner?.line ?? [];
  const nextPlayer = isXNext ? "X" : "O";

  return (
    <div className="App">
      <main className="ttt-page">
        <header className="ttt-header">
          <div className="ttt-titleBlock">
            <h1 className="ttt-title">Tic Tac Toe</h1>
            <p className="ttt-subtitle">Local 2‑player game — take turns and get 3 in a row.</p>
          </div>
        </header>

        <section className="ttt-card" aria-label="Game panel">
          <div className="ttt-statusRow" aria-live="polite" aria-atomic="true">
            <div className="ttt-status">
              <span className="ttt-statusLabel">Status</span>
              <span className="ttt-statusValue">{status}</span>
            </div>

            <div className="ttt-badges" aria-label="Players">
              <span className={`ttt-badge ${winner?.player === "X" ? "is-winner" : ""}`}>
                X{!winner && !isDraw && nextPlayer === "X" ? " •" : ""}
              </span>
              <span className={`ttt-badge ${winner?.player === "O" ? "is-winner" : ""}`}>
                O{!winner && !isDraw && nextPlayer === "O" ? " •" : ""}
              </span>
            </div>
          </div>

          <div className="ttt-boardWrap">
            <div className="ttt-board" role="grid" aria-label="Tic Tac Toe board">
              {board.map((value, idx) => {
                const isWinning = winningSquares.includes(idx);
                const isDisabled = Boolean(winner) || value !== null;

                return (
                  <button
                    key={idx}
                    type="button"
                    className={`ttt-cell ${value ? "is-filled" : ""} ${
                      isWinning ? "is-winning" : ""
                    }`}
                    role="gridcell"
                    aria-label={`Cell ${idx + 1}${value ? `, ${value}` : ""}`}
                    onClick={() => handleCellClick(idx)}
                    disabled={isDisabled}
                  >
                    <span className={`ttt-mark ${value === "X" ? "is-x" : value === "O" ? "is-o" : ""}`}>
                      {value ?? ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="ttt-controls" aria-label="Game controls">
            <button type="button" className="ttt-btn ttt-btnPrimary" onClick={resetGame}>
              New game
            </button>
            <button
              type="button"
              className="ttt-btn ttt-btnGhost"
              onClick={resetGame}
              aria-label="Reset board"
            >
              Reset
            </button>
          </div>

          <div className="ttt-help" aria-label="Help text">
            Tip: You can’t play in a filled square. Start a new game anytime.
          </div>
        </section>

        <footer className="ttt-footer">
          <span className="ttt-footerText">Built with React — no backend required.</span>
        </footer>
      </main>
    </div>
  );
}

export default App;
