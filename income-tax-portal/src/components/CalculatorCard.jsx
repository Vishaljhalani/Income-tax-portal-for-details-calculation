
import InfoCard from "./InfoCard";

export default function CalculatorCard({
  title,
  description,
  badge,
  onClick,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <>
      <style>{`
        .calculator-card-wrapper {
          width: 100%;
          height: 100%;
          display: flex;
          align-self: stretch;
          min-width: 0;
        }

        .calculator-card-wrapper > .calculator-card-inner {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: stretch;
        }

        .calculator-card-wrapper .calculator-card-content {
          width: 100%;
          height: 100%;
          min-height: 100%;
          display: flex;
          flex-direction: column;
        }

        .calculator-card-wrapper .calculator-card-content > * {
          height: 100%;
          min-height: 100%;
        }

        /*
          Make the grid item stretch vertically.
          The tallest card in each row determines the row height.
        */
        .card-grid {
          align-items: stretch !important;
        }

        .card-grid > * {
          align-self: stretch !important;
          height: auto !important;
          min-height: 100%;
        }

        .calculator-card-link {
          height: 100% !important;
          align-self: stretch !important;
          display: flex !important;
        }
      `}</style>

      <div
        className="calculator-card-wrapper calculator-card-link"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={handleKeyDown}
      >
        <div className="calculator-card-inner">
          <div className="calculator-card-content">
            <InfoCard
              title={title}
              description={description}
              badge={badge}
            />
          </div>
        </div>
      </div>
    </>
  );
}

