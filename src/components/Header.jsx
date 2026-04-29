export default function Header({ score, bestScore }) {
  return (
    <header className="topbar">
      <div>
        <p className="brand-kicker">The Odin Project</p>
        <h2 className="brand-title">Memory Card</h2>
      </div>

      <div className="scoreboard" aria-label="Scoreboard">
        <article className="score-card">
          <span className="score-label">Current Score</span>
          <strong className="score-value">{score}</strong>
        </article>
        <article className="score-card">
          <span className="score-label">Best Score</span>
          <strong className="score-value">{bestScore}</strong>
        </article>
      </div>
    </header>
  );
}
