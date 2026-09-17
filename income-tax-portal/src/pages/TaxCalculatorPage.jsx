
import Breadcrumb from "../components/Breadcrumb";
import SectionHeader from "../components/SectionHeader";
import CalculatorCard from "../components/CalculatorCard";
import { useNavigate } from "react-router-dom";

export default function TaxCalculatorPage() {
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
      title: "Advance Tax Calculator",
      description:
        "Calculate total tax liability and installment-wise advance tax payable.",
      badge: "Calculator",
      onClick: () => navigate("/AdvanceTaxCalculator"),
    },
    {
      title: "HRA Calculator",
      description:
        "Calculate House Rent Allowance exemption and taxable HRA amount.",
      badge: "Calculator",
      onClick: () => navigate("/HRA_Calculator"),
    },
    {
      title: "Leave Encashment Calculator",
      description:
        "Calculate leave encashment exemption and taxable amount.",
      badge: "Calculator",
      onClick: () => navigate("/LeaveEncashmentCalculator"),
    },
    {
      title: "TDS Calculator",
      description:
        "Calculate TDS liability section-wise with applicable rate.",
      badge: "Calculator",
      onClick: () => navigate("/tds-calculator"),
    },
    {
      title: "TCS Calculator",
      description:
        "Calculate tax collected at source on applicable transactions.",
      badge: "Calculator",
      onClick: () => navigate("/tcs-calculator"),
    },
    {
      title: "Partner Remuneration Calculator",
      description:
        "Calculate allowable partner salary and remuneration.",
      badge: "Calculator",
      onClick: () => navigate("/Partner-Remuneration-calculator"),
    },
    {
      title: "AMT and MAT Calculator",
      description:
        "Calculate Alternate Minimum Tax and Minimum Alternate Tax.",
      badge: "Calculator",
      onClick: () => navigate("/AMT_MAT_Calculator"),
    },
    {
      title: "Capital Gain Exemption Calculator",
      description:
        "Calculate exemption available under capital gain provisions.",
      badge: "Calculator",
      onClick: () => navigate("/CapitalGainExemptionCalculator"),
    },
    {
      title: "Period Of Holding Calculator",
      description:
        "Check asset holding period for short term or long term capital gain.",
      badge: "Calculator",
      onClick: () => navigate("/PeriodOfHoldingCalculator"),
    },
    {
      title: "NSC Calculator",
      description:
        "Interest on NSC is taxable on annual accrual basis. The same will be treated as an investment during the year of accrual and will qualify for deduction under section 80C.",
      badge: "Calculator",
      onClick: () => navigate("/NSC_calculator"),
    },
    {
      title: "Section 80G/Section 80GGC",
      description:
        "Deduction under section 80G/80GGC Calculator.",
      badge: "Calculator",
      onClick: () =>
        navigate("/Section80G80GGC80GGBCalculator"),
    },
    {
      title: "Surcharge & Marginal Relief Calculator",
      description:
        "Calculate applicable surcharge and marginal relief based on Assessment Year, status, income range, and tax payable.",
      badge: "Calculator",
      onClick: () =>
        navigate("/SurchargeMarginalReliefCalculatorStatusWise"),
    },
    {
      title: "Section 234C Calculator",
      description:
        "Calculate Section 234C interest for AY 2026-27 with quarter-wise income, tax liability, advance tax paid, TDS/credit adjustment and installment-wise shortfall working.",
      badge: "Calculator",
      onClick: () =>
        navigate("/Section234CCalculatorAY2026_27"),
    },
    {
      title: "Gratuity Calculator",
      description:
        "Calculate gratuity exemption under Section 10(10) for Government, Statutory Corporation, Local Authority, and Other Employees.",
      badge: "Calculator",
      onClick: () =>
        navigate("/taxable-gratuity-calculator"),
    },
    {
      title: "Relief under Section 89 Calculator",
      description:
        "This relief is allowed when an employee receives past dues in the current year. As the amount is taxable in the current year, Section 89 aims to provide relief from additional tax paid in the current year on past years' income.",
      badge: "Calculator",
      onClick: () =>
        navigate("/Section89ReliefCalculator"),
    },
    {
      title: "Advance Tax Calculator for 2027-28",
      description:
        "Calculate your advance tax accurately based on your estimated annual income. Track due dates, schedule your quarterly installments, and avoid interest or penalties under Sections 234B and 234C.",
      badge: "Calculator",
      onClick: () =>
        navigate("/AdvanceTaxCalculatorAY2027_28"),
    },
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

