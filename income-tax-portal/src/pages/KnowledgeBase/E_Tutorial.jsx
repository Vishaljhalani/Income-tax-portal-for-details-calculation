
import Breadcrumb from "../../components/Breadcrumb";
import SectionHeader from "../../components/SectionHeader";
import CalculatorCard from "../../components/CalculatorCard";
import { useNavigate } from "react-router-dom";

export default function E_Tutorial() {
  const navigate = useNavigate();

   const calculatorItems = [
    {
      title: "Business Code List",
      description:
        "View the complete list of business codes and their related details.",
      badge: "Reference",
      onClick: () => navigate("/business-code-list"),
    },
    {
      title: "Forms as per Income Tax Act 2025 ",
      description:
      "Old and new Income Tax Forms with their corresponding form names under the 1961 and 2025 Acts.",
      badge: "Reference",
      onClick: () => navigate("/formsMapping"),
    },
    {
      title: "TDS Rate Chart",
      description:
        "TDS rates, applicable sections, threshold limits, and special provisions for different types of payments and deductees.",
      badge: "Reference",
      onClick: () => navigate("/tds-rate-chart"),
    },
    {
      title: "TCS Rate Chart",
      description:
        "TCS rates, applicable sections, threshold limits, and special provisions for different types of payments and deductees.",
      badge: "Reference",
      onClick: () => navigate("/tcs-rate-chart"),
    }
   ];

   return (
    <>
      <style>{`
          #header {
          margin: 40px;
          }
        
        .tax-calculator-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          align-items: stretch;
          width: 100%;
        }

        .tax-calculator-grid > * {
          min-width: 0;
          height: 100%;
          align-self: stretch;
        }

        .tax-calculator-grid .calculator-card-link {
          width: 100%;
          height: 100%;
          display: flex;
          align-self: stretch;
        }

        @media (max-width: 1024px) {
          .tax-calculator-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 640px) {
          .tax-calculator-grid {
            grid-template-columns: 1fr;
            gap: 18px;
          }
        }
      `}</style>

      <Breadcrumb current="Tax Calculator" />

      <section className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 py-10">
        <div className="max-w-7xl mx-auto px-4">

          {/* Main Calculator Container */}
          <div id="header"
            className="
              bg-white
              rounded-[32px]
              shadow-xl
              border border-gray-100
              mx-2 sm:mx-4 lg:mx-8
              p-5 sm:p-7 lg:p-10
            "
          >
            <SectionHeader
              eyebrow="Tax Tool"
              title="Tax Calculator"
              subtitle="Choose calculator type"
            />

            <div className="tax-calculator-grid mt-8">
              {calculatorItems.map((item) => (
                <CalculatorCard
                  key={item.title}
                  title={item.title}
                  description={item.description}
                  badge={item.badge}
                  onClick={item.onClick}
                />
              ))}
            </div>
          </div>

        </div>
      </section>
    </>
  );
}