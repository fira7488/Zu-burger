export default function Card({ card, onClick }) {
  return (
    <button className="memory-card" type="button" onClick={() => onClick(card.id)}>
      <div className="card-spotlight" aria-hidden="true" />
      <img className="card-image" src={card.imageUrl} alt={card.name} />
      <div className="card-copy">
        <p className="card-name">{card.name}</p>
        <span className="card-hint">Click me once</span>
      </div>
    </button>
  );
}
