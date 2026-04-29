import Card from "./Card";

export default function CardGrid({ cards, onCardClick }) {
  return (
    <section className="card-grid" aria-label="Memory cards">
      {cards.map((card) => (
        <Card key={card.id} card={card} onClick={onCardClick} />
      ))}
    </section>
  );
}
