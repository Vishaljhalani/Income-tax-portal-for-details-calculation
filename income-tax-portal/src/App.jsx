import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import ActsLawsPage from './pages/ActsLawsPage';
import TaxCalculatorPage from './pages/TaxCalculatorPage';
import BusinessCodeListPage from "./pages/BusinessCodeListPage";
import AdvanceTaxCalculator from "./pages/AdvanceTaxCalculator";
import HRA_Calculator from './pages/HRA_Calculator';
import LeaveEncashmentCalculator from './pages/LeaveEncashmentCalculator';
import TDSCalculatorPage from "./pages/TDSCalculatorPage";
import TCSCalculatorPage from "./pages/TCSCalculatorPage";
import PartnerRemunerationCalculator from "./pages/PartnerRemunerationCalculator";
import AMT_MAT_Calculator from "./pages/AMT_MAT_Calculator";
import CapitalGainExemptionCalculator from "./pages/CapitalGainExemptionCalculator";
import PeriodOfHoldingCalculator from "./pages/PeriodOfHoldingCalculator";
import NSC_Calculator from "./pages/NSC_Calculator";
import Section80G80GGC80GGBCalculator from "./pages/Section80G80GGC80GGBCalculator";
import SurchargeMarginalReliefCalculatorStatusWise from "./pages/SurchargeMarginalReliefCalculatorStatusWise";
import SurchargeMarginalReliefIndividual from "./pages/SurchargeMarginalReliefIndividual";
import SurchargeMarginalReliefAOPCompany from "./pages/SurchargeMarginalReliefAOPCompany";
import SurchargeMarginalReliefFirmLLPLocal from "./pages/SurchargeMarginalReliefFirmLLPLocal";
import SurchargeMarginalReliefCompany from "./pages/SurchargeMarginalReliefCompany";
import SurchargeMarginalReliefCooperative from "./pages/SurchargeMarginalReliefCooperative";
import Section234CCalculatorAY2026_27 from './pages/Section234CCalculatorAY2026_27';
import TaxableGratuityCalculator from "./pages/TaxableGratuityCalculator";
import Section89ReliefCalculator from "./pages/Section89ReliefCalculator";
import AdvanceTaxCalculatorAY2027_28 from "./pages/AdvanceTaxCalculatorAY2027_28";
import FormsPage from './pages/FormsPage';
import IncomeTaxReturnsPage from './pages/IncomeTaxReturnsPage';
import IncomeTaxForms2026Page from './pages/IncomeTaxForms2026Page';
import HelpPage from './pages/HelpPage';
import IncomeTaxAct2025Page from './pages/IncomeTaxAct2025Page';
import IncomeTaxAct1961Page from './pages/IncomeTaxAct1961Page';
import ComparisonPage from './pages/ComparisonPage';
import NotFoundPage from './pages/NotFoundPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="acts-laws" element={<ActsLawsPage />} />
        <Route path="/business-code-list" element={<BusinessCodeListPage />} />
        <Route path="/AdvanceTaxCalculator" element={<AdvanceTaxCalculator />} />
        <Route path="HRA_Calculator" element={<HRA_Calculator />} />
        <Route path="LeaveEncashmentCalculator" element={<LeaveEncashmentCalculator />} />
        <Route path="tax-calculator" element={<TaxCalculatorPage />} />
        <Route path="/tds-calculator" element={<TDSCalculatorPage />} />
        <Route path="/tcs-calculator" element={<TCSCalculatorPage />} />
        <Route path="/partner-remuneration-calculator" element={<PartnerRemunerationCalculator />} />
        <Route path="/AMT_MAT_Calculator" element={<AMT_MAT_Calculator />} />
        <Route path="/CapitalGainExemptionCalculator" element={<CapitalGainExemptionCalculator />} />
        <Route path="/PeriodOfHoldingCalculator" element={<PeriodOfHoldingCalculator />} />
        <Route path="/NSC_Calculator" element={<NSC_Calculator />} />
        <Route path="/Section80G80GGC80GGBCalculator" element={<Section80G80GGC80GGBCalculator />}/>
        <Route path="/SurchargeMarginalReliefCalculatorStatusWise"element={<SurchargeMarginalReliefCalculatorStatusWise />}/>
        <Route path="/SurchargeMarginalReliefCalculator/individual"element={<SurchargeMarginalReliefIndividual />}/>
        <Route path="/SurchargeMarginalReliefCalculator/aop-company"element={<SurchargeMarginalReliefAOPCompany />}/>
        <Route path="/SurchargeMarginalReliefCalculator/firm-llp-local"element={<SurchargeMarginalReliefFirmLLPLocal />}/>
        <Route path="/SurchargeMarginalReliefCalculator/company" element={<SurchargeMarginalReliefCompany />}/>
        <Route path="/SurchargeMarginalReliefCalculator/cooperative"element={<SurchargeMarginalReliefCooperative />}/>
        <Route path="/Section234CCalculatorAY2026_27" element={<Section234CCalculatorAY2026_27 />} />
        <Route path="/taxable-gratuity-calculator" element={<TaxableGratuityCalculator />}/>
        <Route path="/Section89ReliefCalculator" element={<Section89ReliefCalculator />}/>
        <Route path="/AdvanceTaxCalculatorAY2027_28" element={<AdvanceTaxCalculatorAY2027_28 />} />
        <Route path="forms" element={<FormsPage />} />
        <Route path="/forms/income-tax-returns" element={<IncomeTaxReturnsPage />} />
        <Route path="/forms/income-tax-forms-2026" element={<IncomeTaxForms2026Page />} />
        <Route path="help" element={<HelpPage />} />
        <Route path="acts-laws/income-tax-act-2025" element={<IncomeTaxAct2025Page />}/>
        <Route path="acts-laws/income-tax-act-1961" element={<IncomeTaxAct1961Page />}/>
        <Route path="acts-laws/comparison-2025-vs-1961" element={<ComparisonPage />}/>
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}