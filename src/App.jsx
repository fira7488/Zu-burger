import { useEffect, useState } from "react";
import Header from "./components/Header";
import CardGrid from "./components/CardGrid";

const CARD_COUNT = 12;

function shuffleCards(items) {
  const nextItems = [...items];

  for (let index = nextItems.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [nextItems[index], nextItems[swapIndex]] = [nextItems[swapIndex], nextItems[index]];
  }

  return nextItems;
}

async function fetchPokemonCards(signal) {
  const listResponse = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${CARD_COUNT}`,
    { signal },
  );

  if (!listResponse.ok) {
    throw new Error("Unable to load the card list right now.");
  }

  const listData = await listResponse.json();

  const details = await Promise.all(
    listData.results.map(async (pokemon) => {
      const detailResponse = await fetch(pokemon.url, { signal });

      if (!detailResponse.ok) {
        throw new Error("Unable to load one or more card details.");
      }

      const detailData = await detailResponse.json();

      return {
        id: detailData.id,
        name: detailData.name,
        imageUrl:
          detailData.sprites.other["official-artwork"].front_default ||
          detailData.sprites.front_default,
      };
    }),
  );

  return details.filter((card) => card.imageUrl);
}

export default function App() {
  const [cards, setCards] = useState([]);
  const [clickedCards, setClickedCards] = useState([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusMessage, setStatusMessage] = useState(
    "Pick every card once. Each click shuffles the board.",
  );

  useEffect(() => {
    const controller = new AbortController();

    async function loadCards() {
      try {
        setLoading(true);
        setError("");

        const loadedCards = await fetchPokemonCards(controller.signal);

        if (loadedCards.length === 0) {
          throw new Error("The API responded, but no playable card images were available.");
        }

        setCards(shuffleCards(loadedCards));
      } catch (loadError) {
        if (loadError.name !== "AbortError") {
          setError(loadError.message || "Something went wrong while loading the game.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadCards();

    return () => controller.abort();
  }, []);

  function restartRound(message) {
    setScore(0);
    setClickedCards([]);
    setStatusMessage(message);
    setCards((currentCards) => shuffleCards(currentCards));
  }

  function handleCardClick(cardId) {
    if (clickedCards.includes(cardId)) {
      restartRound("Game over. You picked a repeated card, so the streak reset.");
      return;
    }

    const nextClickedCards = [...clickedCards, cardId];
    const nextScore = score + 1;

    setClickedCards(nextClickedCards);
    setScore(nextScore);
    setBestScore((currentBestScore) => Math.max(currentBestScore, nextScore));

    if (nextScore === cards.length) {
      setBestScore(cards.length);
      setClickedCards([]);
      setScore(0);
      setStatusMessage("Perfect round. You found every card without repeating one.");
      setCards((currentCards) => shuffleCards(currentCards));
      return;
    }

    setStatusMessage("Nice pick. The cards shuffled again, so stay sharp.");
    setCards((currentCards) => shuffleCards(currentCards));
  }

  async function handleRetry() {
    const controller = new AbortController();

    try {
      setLoading(true);
      setError("");
      setStatusMessage("Refreshing the board with a new batch of cards.");

      const loadedCards = await fetchPokemonCards(controller.signal);
      setCards(shuffleCards(loadedCards));
      setClickedCards([]);
      setScore(0);
    } catch (loadError) {
      setError(loadError.message || "Something went wrong while loading the game.");
    } finally {
      setLoading(false);
      controller.abort();
    }
  }

  return (
    <div className="app-shell">
      <Header score={score} bestScore={bestScore} />

      <main className="game-layout">
        <section className="hero-panel">
          <p className="eyebrow">React Memory Card</p>
          <h1>Catch every Pokemon once before your memory breaks.</h1>
          <p className="hero-copy">
            Every valid click increases your score and reshuffles the board. Repeat a
            card and the streak goes back to zero.
          </p>

          <div className="hero-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => restartRound("Fresh round started. Build a new streak.")}
              disabled={loading || cards.length === 0}
            >
              Restart round
            </button>
            <button className="secondary-button" type="button" onClick={handleRetry}>
              Reload cards
            </button>
          </div>

          <p className="status-banner">{statusMessage}</p>
        </section>

        {loading ? (
          <section className="feedback-panel">
            <div className="spinner" aria-hidden="true" />
            <p>Loading cards from the Pokemon API...</p>
          </section>
        ) : null}

        {error ? (
          <section className="feedback-panel error-panel" role="alert">
            <p>{error}</p>
            <button className="secondary-button" type="button" onClick={handleRetry}>
              Try again
            </button>
          </section>
        ) : null}

        {!loading && !error ? <CardGrid cards={cards} onCardClick={handleCardClick} /> : null}
      </main>
    </div>
  );
}
