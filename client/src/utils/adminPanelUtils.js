export const formatLicensePlateJSX = (plate = '') => {
  const match = plate.match(/^([A-Za-z]{2})(\d{4})([A-Za-z]{2})$/);
  if (!match) return plate;

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span>{match[1]}</span>
      <span
        style={{
          margin: '0 4px',
          letterSpacing: '2px',
          fontWeight: 'bold',
        }}>
        {match[2]}
      </span>
      <span>{match[3]}</span>
    </span>
  );
};

export const getUsedMovingCards = (fuelTanks) =>
  fuelTanks
    .flatMap((mainTank) => mainTank.connectedTanks || [])
    .map((tank) => tank.movingCard)
    .filter(Boolean);

export const buildCardsCollection = (
  selectionCards,
  usedMovingCards,
  createListCollection
) =>
  createListCollection({
    items: (Array.isArray(selectionCards) ? selectionCards : [])
      .filter((card) => !usedMovingCards.includes(card.cardName))
      .map(({ id, cardName }) => ({
        value: id,
        label: cardName,
      })),
  });
