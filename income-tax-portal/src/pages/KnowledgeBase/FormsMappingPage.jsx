import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ---------- Galaxy theme tokens (same as TDS/TCS rate chart pages) ----------
const galaxy = {
  text: '#e2e8f0',
  muted: 'rgba(226, 232, 240, 0.7)',
  border: 'rgba(96, 165, 250, 0.35)',
  headGradient: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 60%, #0284c7 100%)',
  oldSection: '#93c5fd', // light blue
  newSection: '#cbd5e1', // slate
};

const StyledTableCell = styled(TableCell)({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: 'transparent',
    color: '#ffffff',
    fontWeight: 600,
    borderBottom: 'none',
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    color: galaxy.text,
    borderBottom: '1px solid rgba(148, 163, 184, 0.15)',
  },
});

const StyledTableRow = styled(TableRow)({
  '&:nth-of-type(odd)': {
    backgroundColor: 'rgba(59, 130, 246, 0.08)',
  },
  '&:hover': {
    backgroundColor: 'rgba(59, 130, 246, 0.22)',
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
});

// Source: "Forms as per Income Tax Act 2025" (Surendra Singh) — maps each new
// Income-tax Act, 2025 form number to its corresponding Income-tax Act, 1961
// form (where one exists) and its description.
const rows = [
  { newForm: "1", oldForm: "3BB", desc: "Monthly Statement to be furnished by a stock exchange in respect of transactions in which client codes have been modified after registering in the system" },
  { newForm: "2", oldForm: "5B", desc: "Application for notification of a zero coupon bond under section 2(112)" },
  { newForm: "3", oldForm: "5BA", desc: "Certificate of an accountant under rule 7 for entity issuing zero coupon bond" },
  { newForm: "4", oldForm: "3CT", desc: "Income attributable to assets located in India under section 9(10)(a)" },
  { newForm: "5", oldForm: "3AF", desc: "Statement regarding preliminary expenses incurred by the assessee to be furnished under Section 44(3)" },
  { newForm: "6", oldForm: "3AE", desc: "Audit Report for claiming deduction for certain preliminary expenses under section 44 or expenditure for prospecting certain minerals under section 51" },
  { newForm: "7", oldForm: "3CG", desc: "Application for approval of scientific research programme under section 45(3)(c)" },
  { newForm: "8", oldForm: "3CH", desc: "Order of approval of Scientific Research Programme under section 45(3)(c)" },
  { newForm: "9", oldForm: "3CI", desc: "Receipt of payment for carrying out scientific research under section 45(3)(c)" },
  { newForm: "10", oldForm: "3CJ", desc: "Report to be submitted by the prescribed authority to the Chief Commissioner of Income-tax having jurisdiction over the sponsor after approval of scientific research programme under section 45(3)(c)" },
  { newForm: "11", oldForm: "3CK", desc: "Application for entering into an agreement with the Department of Scientific and Industrial research for cooperation in In-house research development facility" },
  { newForm: "12", oldForm: "3CL", desc: "Report to be submitted by the prescribed authority to the Chief Commissioner of Income-tax having jurisdiction over the company" },
  { newForm: "13", oldForm: "3CLA", desc: "Report from an accountant to be furnished under Section 45(2) relating to in-house scientific research and development facility" },
  { newForm: "14", oldForm: "3CM", desc: "Order of approval of in-house research and development facility under section 45(2)" },
  { newForm: "15", oldForm: "New Form", desc: "Statement to be filed by research association, university, college or other institution or company (“donee”) under section 45(4)(a)" },
  { newForm: "16", oldForm: "New Form", desc: "Certificate of donation under section 45(4)(a) made to the research association, university, college or other institution or company" },
  { newForm: "17", oldForm: "3CF", desc: "Application for approval of a company under section 45(3)(b) and of a research association, university, college or other institution under section 45(4)(b)" },
  { newForm: "18", oldForm: "3CN", desc: "Application for notification of affordable housing project as specified business under section 46" },
  { newForm: "19", oldForm: "3CS", desc: "Application for notification of a semiconductor wafer fabrication manufacturing unit as specified business under section 46" },
  { newForm: "20", oldForm: "3C-O", desc: "Application for approval of agricultural extension project under section 47(1)(a)" },
  { newForm: "21", oldForm: "3CP", desc: "Form for notification of agricultural extension project under section 47(1)(a)" },
  { newForm: "22", oldForm: "3CQ", desc: "Application for approval of skill development project under section 47(1)(b)" },
  { newForm: "23", oldForm: "3CR", desc: "Form for notification of skill development project under section 47(1)(b)" },
  { newForm: "24", oldForm: "3CE", desc: "Audit Report under section 59 for computation of royalty and fee for technical services in the case of nonresident (not being a company) or a foreign company" },
  { newForm: "25", oldForm: "3C", desc: "Form of daily case register" },
  { newForm: "26", oldForm: "3CA, 3CB, 3CD", desc: "Audit report and Statement of particulars required to be furnished under section 63" },
  { newForm: "27", oldForm: "5C", desc: "Details of amount attributed to capital asset remaining with the specified entity" },
  { newForm: "28", oldForm: "3CEA", desc: "Report of an accountant to be furnished by an assessee under section 77(4) of the Act relating to the computation of capital gains in the case of slump sale" },
  { newForm: "29", oldForm: "62", desc: "Certificate from the principal officer of the amalgamated company and duly verified by an accountant regarding achievement of the prescribed level of production and continuance of such level of production in subsequent years" },
  { newForm: "30", oldForm: "10-IA", desc: "Certificate of the medical authority for certifying 'person with disability', 'severe disability', 'autism', 'cerebral palsy' and 'multiple disability' for purposes of section 127 and section 154 of the Act." },
  { newForm: "31", oldForm: "10BA", desc: "Declaration to be filed by the assessee for claiming deduction under section 134 of the Act for rents paid" },
  { newForm: "32", oldForm: "New Form", desc: "Audit report under section 46, 138, 139, 140(8), 141, 142, 143 and 144 of the Act" },
  { newForm: "33", oldForm: "56FF", desc: "Particulars to be furnished in respect of units established under Special Economic Zone for claiming deduction under section 144 of the Act" },
  { newForm: "34", oldForm: "10DA", desc: "Report for deduction in respect of additional employee cost under section 146 of the Act" },
  { newForm: "35", oldForm: "10CCF", desc: "Report for deduction in respect of income of Offshore Banking Units and Units of International Financial Services Centre under section 147(4)(a) of the Act" },
  { newForm: "36", oldForm: "10CCD", desc: "Certificate under section 151(5) of the Act for authors of certain books in receipt of royalty income" },
  { newForm: "37", oldForm: "10CCE", desc: "Certificate under section 152(5) of the Act for Patentees in receipt of royalty income" },
  { newForm: "38", oldForm: "10H", desc: "Certificate of foreign inward remittance" },
  { newForm: "39", oldForm: "10E", desc: "Form for claiming relief under section 157(1) of the Act in case of receipt of additional salary, or gratuity or Retrenchment Compensation or commutation of pension" },
  { newForm: "40", oldForm: "10-EE", desc: "Exercise of option for relief from taxation in income from retirement benefit account maintained in a notified country under section 158 of the Act" },
  { newForm: "41", oldForm: "10F", desc: "Information to be provided under section 159(8)" },
  { newForm: "42", oldForm: "10FA", desc: "Application for Certificate of residence for the purposes of an agreement under section 159(1) and 159(2)" },
  { newForm: "43", oldForm: "10FB", desc: "Certificate of residence for the purposes of section 159" },
  { newForm: "44", oldForm: "67", desc: "Statement of income from a country or region outside India and Foreign Tax Credit" },
  { newForm: "45", oldForm: "New Form", desc: "Intimation of settlement of dispute regarding foreign tax for which credit has not been claimed" },
  { newForm: "46", oldForm: "New Form", desc: "Exercise of option for determination of arm‘s length price (ALP) under section 166(9)" },
  { newForm: "47", oldForm: "New Form", desc: "Certificate of an accountant under section 166" },
  { newForm: "48", oldForm: "3CEB", desc: "Report from an accountant to be furnished under section 172 relating to international transaction(s) and/or specified domestic transaction(s)" },
  { newForm: "49", oldForm: "3CEFA, 3CEFB & 3CEFC", desc: "Application for opting for Safe Harbour" },
  { newForm: "50", oldForm: "3CEC", desc: "Application for a pre-filing consultation" },
  { newForm: "51", oldForm: "3CED & 3CEDA", desc: "Application for an Advance Pricing Agreement (APA)" },
  { newForm: "52", oldForm: "3CEF", desc: "Annual Compliance Report on Advance Pricing Agreement" },
  { newForm: "53", oldForm: "3CEEA", desc: "Form for filing particulars of past years for calculating relief in tax payable under section 206(1)" },
  { newForm: "54", oldForm: "New Form", desc: "Application for Renewal of an Advance Pricing Agreement (APA)" },
  { newForm: "55", oldForm: "34F", desc: "Form of application for an assessee, resident in India, seeking to invoke mutual agreement procedure provided for in agreements with other countries or specified territories" },
  { newForm: "56", oldForm: "3CEAA", desc: "Information and document to be furnished by the person who is a constituent entity under section 171(4)" },
  { newForm: "57", oldForm: "3CEAB", desc: "Intimation by a designated constituent entity, resident in India, of an international group, for the purposes of section 171(4)" },
  { newForm: "58", oldForm: "3CEAC", desc: "Intimation by a constituent entity, resident in India, of an international group, the parent entity of which is not resident in India, for the purposes of section 511(1)" },
  { newForm: "59", oldForm: "3CEAD", desc: "Report by a parent entity or an alternate reporting entity or any other constituent entity, resident in India, for the purposes of section 511(2) or section 511(4)" },
  { newForm: "60", oldForm: "3CEAE", desc: "Intimation on behalf of the international group for the purposes of section 511(5)" },
  { newForm: "61", oldForm: "10FC", desc: "Authorisation for claiming deduction in respect of any payment made to any financial institution located in a notified jurisdictional area" },
  { newForm: "62", oldForm: "3CEG", desc: "Form for making the reference to the Commissioner of Income tax by the Assessing Officer under section 274(1)" },
  { newForm: "63", oldForm: "3CEH", desc: "Form for returning the reference made under section 274" },
  { newForm: "64", oldForm: "3CEI", desc: "Form for making reference to the Approving Panel and for recording the satisfaction by the Commissioner before making a reference to the Approving Panel under section 274(4)" },
  { newForm: "65", oldForm: "3CFA", desc: "Form for opting for taxation of income by way of royalty in respect of patent" },
  { newForm: "66", oldForm: "29B", desc: "Report for Computation of Book Profit for the purposes of section 206(1) of the Act" },
  { newForm: "67", oldForm: "29C", desc: "Report for computation of adjusted total income and alternate minimum tax for the purposes of section 206(2) of the Act" },
  { newForm: "68", oldForm: "10-IG", desc: "Statement of exempt income under Schedule VI [Table: Sl. Nos. 1 to 4]" },
  { newForm: "69", oldForm: "10-IH", desc: "Statement of income of a specified fund eligible for concessional taxation under section 210(2) of the Act" },
  { newForm: "70", oldForm: "10-IK", desc: "Annual Statement of exempt income and income taxable at concessional rate for an investment division of an offshore banking unit" },
  { newForm: "71", oldForm: "10-IL", desc: "Verification by an accountant for computation of exempt income of specified fund, attributable to the investment division of an offshore banking unit, for purposes of Schedule VI to the Act" },
  { newForm: "72", oldForm: "64E", desc: "Statement of income paid or credited by a securitisation trust to be furnished under section 221" },
  { newForm: "73", oldForm: "64F", desc: "Statement of income distributed by a securitisation trust to be provided to the investor under section 221" },
  { newForm: "74", oldForm: "64", desc: "Statement of income paid or credited by Venture Capital Company or Venture Capital Fund to be furnished under section 222" },
  { newForm: "75", oldForm: "New Form", desc: "Statement of income paid or credited by Venture Capital Company or Venture Capital Fund to be provided to the person who is liable to tax under section 222" },
  { newForm: "76", oldForm: "64A", desc: "Statement of income paid or credited by business trust to be furnished under section 223" },
  { newForm: "77", oldForm: "64B", desc: "Statement of income distributed by a business trust to be provided to the unit holder under section 223" },
  { newForm: "78", oldForm: "64C", desc: "Statement of income distributed by an investment fund to be provided to the unit holder under section 224" },
  { newForm: "79", oldForm: "64D", desc: "Statement of income paid or credited by investment fund to be furnished under section 224" },
  { newForm: "80", oldForm: "65", desc: "Application for *exercising/renewing option for the tonnage tax scheme under * section 231(1) or 231(10)" },
  { newForm: "81", oldForm: "66", desc: "Audit Report under section 232(21) for tonnage tax scheme" },
  { newForm: "82", oldForm: "45", desc: "Warrant of authorisation under section 247 of the Income-tax Act, 2025 (30 of 2025) and rule 148 of the Income-tax Rules, 2026" },
  { newForm: "83", oldForm: "45A", desc: "Warrant of authorisation under section 247(2) of the Income-tax Act, 2025 (30 of 2025)" },
  { newForm: "84", oldForm: "45B", desc: "Warrant of authorisation under section 247(3) of the I n c ome - t a x Act, 2025 (30 of 2025)" },
  { newForm: "85", oldForm: "6C", desc: "Application under section 247(5) or 247(9) of the Income-tax Act, 2025 (30 of 2025)" },
  { newForm: "86", oldForm: "45C", desc: "Warrant of authorisation under section 248(1) of the Income-tax Act, 2025 (30 of 2025)" },
  { newForm: "87", oldForm: "45D", desc: "Information to be furnished to the Income-tax authority under section 254 of the Income-tax Act, 2025 ( 30 of 2025)" },
  { newForm: "88", oldForm: "46", desc: "Application for information under section 258(2)(a) of the Act" },
  { newForm: "89", oldForm: "47", desc: "Form for furnishing information under section 258(2) of the Act" },
  { newForm: "90", oldForm: "48", desc: "Refusal to supply information under section 258(2)(a) of the Act." },
  { newForm: "91", oldForm: "49", desc: "Refusal to supply information under section 258(2)(a) of the Act." },
  { newForm: "92", oldForm: "49BA", desc: "Quarterly statement to be furnished by specified fund or stock broker in respect of a non-resident referred to in rule 157 for the quarter of ________________ of ___________ (Financial Year)" },
  { newForm: "93", oldForm: "49A", desc: "Application for Allotment of Permanent Account Number" },
  { newForm: "94", oldForm: "49A", desc: "Application for Allotment of Permanent Account Number [For an Indian Company / an Entity incorporated in India/ an Unincorporated Entity formed in India]" },
  { newForm: "95", oldForm: "49AA", desc: "Application for Allotment of Permanent Account Number [For an Individual not being a Citizen of India]" },
  { newForm: "96", oldForm: "49AA", desc: "Application for Allotment of Permanent Account Number [For an Entity incorporated outside India/ an Unincorporated Entity formed outside India]" },
  { newForm: "97", oldForm: "60", desc: "Form for declaration to be filed by any person (other than a company or firm) or a foreign company covered by sub-rule (2) to rule 159 , who does not have a permanent account number and who enters into any transaction specified in rule 159" },
  { newForm: "98", oldForm: "61", desc: "Statement containing particulars of declaration received in Form No. 97" },
  { newForm: "99", oldForm: "35", desc: "Appeal to the Joint commissioner of Income-tax (Appeals) or the Commissioner of Income-tax (Appeals)" },
  { newForm: "100", oldForm: "6B", desc: "Audit report under section 268(5)" },
  { newForm: "101", oldForm: "6D", desc: "Inventory Valuation report under section 268(5)" },
  { newForm: "102", oldForm: "71", desc: "Application under section 288(1) [Table: Sl. No. 11] for credit of tax deduction at source" },
  { newForm: "103", oldForm: "7", desc: "Notice of demand under section 289 of the Act" },
  { newForm: "104", oldForm: "10A", desc: "Application for provisional registration or provisional approval" },
  { newForm: "105", oldForm: "10AB", desc: "Application for registration of non-profit organisation under section 332 or approval under section 354" },
  { newForm: "106", oldForm: "10AC", desc: "Order for provisional registration under section 332 or provisional approval under section 354 Rejection of application" },
  { newForm: "107", oldForm: "10AD", desc: "Order for grant of registration under section 332 or approval under section 354 or rejection of application or cancellation of registration or approval granted" },
  { newForm: "108", oldForm: "9A", desc: "Exercise of option under section 341(7) in respect of amount applied for charitable or religious purposes" },
  { newForm: "109", oldForm: "10", desc: "Statement of accumulation or setting apart of income under section 342(1)" },
  { newForm: "110", oldForm: "New Form", desc: "Application for change of purpose of accumulation or setting apart of income under section 342(5)" },
  { newForm: "111", oldForm: "New Form", desc: "Order under section 342(6) on the request for change of purpose of accumulation or setting apart of income" },
  { newForm: "112", oldForm: "10B & 10BB", desc: "Audit report under section 348 in the case of a registered non profit organisation (NPO)" },
  { newForm: "113", oldForm: "10BD", desc: "Statement or Correction Statement to be filed by Donee under section 354(1)" },
  { newForm: "114", oldForm: "10BE", desc: "Certificate of donation under section 354(1)(g)" },
  { newForm: "115", oldForm: "36", desc: "Form of appeal to the Appellate Tribunal" },
  { newForm: "116", oldForm: "36A", desc: "Form of memorandum of cross-objections to the Appellate Tribunal" },
  { newForm: "117", oldForm: "8", desc: "Declaration under section 375(1) of the Act to be made by an assessee claiming that identical question of law is pending before the High Court or the Supreme Court" },
  { newForm: "118", oldForm: "8A", desc: "In the High Court of _______ or Income-tax Appellate Tribunal _______" },
  { newForm: "119", oldForm: "34BC", desc: "Application to the Dispute Resolution Committee under section 379 of the Act" },
  { newForm: "120", oldForm: "34C, 34D, 34DA, 34E and 34EA", desc: "Form of application for obtaining an advance ruling section 383(1) of the Act" },
  { newForm: "121", oldForm: "15G, 15H.", desc: "Declaration under section 393(6) for receipt of certain incomes without deduction of tax" },
  { newForm: "122", oldForm: "12B and 12BAA", desc: "Form for furnishing details of income under section 392(4)(a) for the purposes of making deduction where income is chargeable under the head \"Salaries\"" },
  { newForm: "123", oldForm: "12BA", desc: "Statement showing particulars of perquisites, other fringe benefits or amenities and profits in lieu of salary with value thereof" },
  { newForm: "124", oldForm: "12BB", desc: "Statement showing particulars of claims by an employee for deduction of tax under section 392(5)(b)" },
  { newForm: "125", oldForm: "12BBA", desc: "Declaration to be furnished by Specified Senior Citizen for deduction of tax under Section 393(1) [Table: Sl. No. 8(iii)]" },
  { newForm: "126", oldForm: "15C, 15D", desc: "Application by a person specified in rule 209 for a certificate under section 395(1), for receipt of certain sums without deduction of tax" },
  { newForm: "127", oldForm: "27C", desc: "Declaration under section 394(2) to be made by a buyer for obtaining goods without collection of tax" },
  { newForm: "128", oldForm: "13", desc: "Application for issuance of certificate for lower or nil deduction of income-tax under section 395(1) and lower collection of income-tax under section 395(3)" },
  { newForm: "129", oldForm: "15E", desc: "Application by a person for a certificate under section 395(2) and 400(3) for determination of appropriate proportion of sum (other than salary) payable to non-resident, chargeable to tax in case of the recipient." },
  { newForm: "130", oldForm: "16", desc: "Certificate under section 395 for tax deducted at source on salary paid to an employee under section 392 or pension or interest income of specified senior citizen under section 393(1)" },
  { newForm: "131", oldForm: "16A", desc: "Certificate under section 395(4) for tax deducted at source other than on salary paid to an employee under section 392 or pension or interest income of specified senior citizen under section 393(1)" },
  { newForm: "132", oldForm: "16B, 16C, 16D, 16E", desc: "Certificate under section 395(4) for tax deducted at source" },
  { newForm: "133", oldForm: "27D", desc: "Certificate under section 395(4) for tax collected at source" },
  { newForm: "134", oldForm: "49B(1)", desc: "Form for application for allotment of Tax Deduction and Collection Account Number [TAN] under section 397" },
  { newForm: "135", oldForm: "49B(2)", desc: "Form for application for allotment of Tax Deduction and Collection Account Number [TAN] under section 397" },
  { newForm: "136", oldForm: "New Form", desc: "Application for allotment of Accounts Office Identification Number (AIN)" },
  { newForm: "137", oldForm: "24G", desc: "TDS/TCS Book Adjustment Statement" },
  { newForm: "138", oldForm: "24Q", desc: "Quarterly statement of deduction of tax under section 397(3)(b) of the Act in respect of salary paid to employee under section 392, or income of specified senior citizen under section 393(1) [Table: Sl. No. 8(iii)], for the quarter ended ……….." },
  { newForm: "139", oldForm: "26B", desc: "Form to be filed by the deductor, if he claims refund of sum paid under Chapter XIX of the Act" },
  { newForm: "140", oldForm: "26Q", desc: "Quarterly statement of deduction of tax under section 397(3)(b) in respect of payments made other than salary for the quarter ended…………………………(June/September/December/March ) ………………. (Tax Year)]" },
  { newForm: "141", oldForm: "26QB, 26QC, 26QD, 26QE", desc: "Challan-cum-statement of deduction of tax under section 393(1) [Table Sl. No. 2(i), 3(i), 6(ii) and 8(vi)]" },
  { newForm: "142", oldForm: "26QF", desc: "Quarterly statement of tax deposited in relation to transfer of virtual digital asset under section 393(1) [ Table: S. No. 8(vi)] to be furnished by an Exchange for the quarter ending ……. June/September/December/March of Tax Year" },
  { newForm: "143", oldForm: "27EQ", desc: "Quarterly statement of collection of tax at source under section 397(3)(b) for the quarter ended………………………….. (June/September/December/March) ……………………….. (Tax Year)" },
  { newForm: "144", oldForm: "27Q", desc: "Quarterly statement of deduction of tax under section 397(3)(b) in respect of payments other than salary made to non-residents for quarter ended…………………………(June/September/December/March" },
  { newForm: "145", oldForm: "15CA", desc: "Information to be furnished for payments to a non-resident not being a company, or to a foreign company" },
  { newForm: "146", oldForm: "15CB", desc: "Certificate of an accountant for payments to a non-resident, not being a company or to a foreign company" },
  { newForm: "147", oldForm: "15CC", desc: "Quarterly statement to be furnished by an authorised dealer in respect of remittances made for the quarter of ………….. of (Tax Year)" },
  { newForm: "148", oldForm: "15CD", desc: "Quarterly statement to be furnished by a unit of an International Financial Services Centre, as referred to in section 147(1)(b), in respect of remittances, made for the quarter of ………….. of (Tax Year)" },
  { newForm: "149", oldForm: "26A", desc: "Form for furnishing accountant certificate under section 398(2) for person responsible for deduction of tax not to be deemed to be an assessee in default" },
  { newForm: "150", oldForm: "27BA", desc: "Form for furnishing accountant certificate under section 398(2) for person responsible for collection of tax as per section 394(1)[Table: Sl. No. 1 to 5 and 9] not to be deemed to be an assessee in default" },
  { newForm: "151", oldForm: "28", desc: "Notice of demand under section 289 of the Act for payment of advance tax under section 407(2) or 407(5) of the Act" },
  { newForm: "152", oldForm: "28A", desc: "Intimation to the Assessing Officer under section 407(8) regarding the notice of demand under section 289 of the Act for payment of advance tax under section 407(2)/407(5) of the Act" },
  { newForm: "153", oldForm: "57", desc: "Certificate under section 413 or 414." },
  { newForm: "154", oldForm: "30A", desc: "Form of undertaking to be furnished under section 420(1)" },
  { newForm: "155", oldForm: "30B", desc: "No Objection Certificate for a person not domiciled in India under section 420(1)" },
  { newForm: "156", oldForm: "30C", desc: "Form for furnishing the details under section 420(3)" },
  { newForm: "157", oldForm: "New Form", desc: "Form for furnishing the certificate under section 420(4)" },
  { newForm: "158", oldForm: "31", desc: "Application for Certificate under section 420(5)" },
  { newForm: "159", oldForm: "33", desc: "Clearance Certificate under section 420(5)" },
  { newForm: "160", oldForm: "29D", desc: "Application by a person under section 434 for refund of tax deducted" },
  { newForm: "161", oldForm: "68", desc: "Form of application under section 440(2)" },
  { newForm: "162", oldForm: "49C", desc: "Annual Statement under section 505" },
  { newForm: "163", oldForm: "49D", desc: "Information and Documents to be furnished by an Indian concern under section 506" },
  { newForm: "164", oldForm: "52A", desc: "Statement to be furnished under section 507 by a person carrying on production of a cinematograph film or engaged in specified activity or both" },
  { newForm: "165", oldForm: "61A", desc: "Statement of Specified Financial Transactions under section 508(1)" },
  { newForm: "166", oldForm: "61B", desc: "Statement of Reportable Account under section 508(1)" },
  { newForm: "167", oldForm: "New Form", desc: "Statement to furnish information on transaction of crypt-asset under section 509" },
  { newForm: "168", oldForm: "26AS", desc: "Annual Information Statement" },
  { newForm: "169", oldForm: "New Form", desc: "Application for registration as a valuer under section 514" },
  { newForm: "170", oldForm: "New Form", desc: "Report of valuation of Asset under section 514" },
  { newForm: "171", oldForm: "-", desc: "Form of application for registration as authorised income-tax practitioner under section 515" },
  { newForm: "172", oldForm: "3CEJA", desc: "Report from an accountant to be furnished for the purpose of section 9(12) [Schedule I: Paragraph 1(4)] regarding fulfilment of certain conditions by an eligible investment fund" },
  { newForm: "173", oldForm: "3CEK", desc: "Statement to be furnished by an eligible investment fund to the Assessing Officer under section 9(12) [Schedule I: Paragraph 1(4)]" },
  { newForm: "174", oldForm: "10BBA", desc: "Application for notification under Schedule V [Table: Sl. No.7.Note 5(a)(iii)(D)] (Pension Fund)" },
  { newForm: "175", oldForm: "10BBB", desc: "Intimation by Pension Fund of investment under Schedule V [Table: Sl. No. 7] (within one month from the end of the quarter ending on 30th June, 30th September, 31st December and 31st March of the financial year)" },
  { newForm: "176", oldForm: "10BBC", desc: "Certificate of accountant in respect of compliance to the provisions of Schedule V [Table: Sl. No. 7] by the notified Pension Fund" },
  { newForm: "177", oldForm: "10BBD", desc: "Statement of eligible investment received" },
  { newForm: "178", oldForm: "10-II", desc: "Statement of exempt income under Schedule VI [Table: Sl. No. 10]" },
  { newForm: "179", oldForm: "10-IJ", desc: "Certificate to be issued by the accountant under Schedule VI [Table: Sl. No. 10]" },
  { newForm: "180", oldForm: "9", desc: "Application for grant of approval to a fund referred to in Schedule VII [Table: Sl. No. 2]" },
  { newForm: "181", oldForm: "10BC", desc: "Audit report under rule 289(12) in the case of the electoral trust" },
  { newForm: "182", oldForm: "3AC", desc: "Audit Report under paragraph 2 of Schedule IX for deduction for tea development account, coffee development account and rubber development account" },
  { newForm: "183", oldForm: "3AD", desc: "Audit Report under paragraph 2 of Schedule X for deduction for site restoration fund" },
  { newForm: "184", oldForm: "40A/40B", desc: "Form of nomination/modifying nominations for provident/gratuity fund" },
  { newForm: "185", oldForm: "41", desc: "Form for maintaining accounts of subscribers to a recognised provident fund" },
  { newForm: "186", oldForm: "40C", desc: "Application for recognition of provident fund under Part-A of the Schedule XI to the Act" },
  { newForm: "187", oldForm: "42, 43, 44", desc: "Appeal against refusal to recognize or withdrawal of recognition from a provident fund/refusal to approve or withdrawal of approval from a superannuation fund or from a gratuity fund" },
  { newForm: "188", oldForm: "New Form", desc: "Application for approval of superannuation fund or gratuity fund" },
  { newForm: "189", oldForm: "59", desc: "Application for approval of issue of public companies under Paragraph 1(z)(i) of Schedule XV to the Act" },
  { newForm: "190", oldForm: "59A", desc: "Application for approval of mutual funds investing in the eligible issue of public companies under Paragraph 1(z)(ii) of Schedule XV to the Act" },
];
// Lowercase, so "pan" finds "PAN" etc.
const normalize = (text) => String(text).toLowerCase();

// Every row gets a stable id and one searchable text (all columns together).
const allRows = rows.map((row, id) => ({
  ...row,
  id,
  searchText: normalize([row.newForm, row.oldForm, row.desc].join(' ')),
}));

export default function FormsMappingPage() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  // Go to the previous page; if this page was opened directly (no history), go to Home.
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Builds an actual .pdf file client-side (via jsPDF + jspdf-autotable) and
  // downloads it directly — no print dialog involved. Downloads whatever the
  // search box currently shows, so a filtered PDF is possible too.
  const handleDownloadPdf = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'pt', format: 'a4' });

      doc.setFontSize(14);
      doc.text('Forms \u2014 Income-tax Act 2025 (mapped to Income-tax Act, 1961)', 40, 32);

      const tableOptions = {
        startY: 48,
        head: [['Form No. (ITA, 2025)', 'Form No. (ITA, 1961)', 'Form Description']],
        body: filteredRows.map((row) => [`Form No. ${row.newForm}`, row.oldForm, row.desc]),
        styles: { fontSize: 8, cellPadding: 4, overflow: 'linebreak', valign: 'top' },
        headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [241, 245, 249] },
        columnStyles: {
          0: { cellWidth: 95 },
          1: { cellWidth: 95 },
          2: { cellWidth: 'auto' },
        },
        margin: { left: 40, right: 40 },
      };

      // jspdf-autotable v4+ exports a function: autoTable(doc, options)
      // jspdf-autotable v3 and earlier instead patches the instance:
      // doc.autoTable(options) — support both so this works either way.
      if (typeof autoTable === 'function') {
        autoTable(doc, tableOptions);
      } else if (typeof doc.autoTable === 'function') {
        doc.autoTable(tableOptions);
      } else {
        throw new Error('jspdf-autotable did not load correctly.');
      }

      doc.save('income-tax-forms-ita-2025.pdf');
    } catch (err) {
      // Surface the failure instead of doing nothing, so it's obvious
      // something needs fixing (usually a missing/mismatched package).
      console.error('PDF generation failed:', err);
      alert(
        'Could not generate the PDF. Open the browser console (F12) for the error, and check that "jspdf" and "jspdf-autotable" are installed (npm install jspdf jspdf-autotable) and the dev server was restarted after installing.'
      );
    }
  };

  // Every word typed must match somewhere in the row, e.g. "26q quarterly" or "tcs".
  const filteredRows = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return allRows;
    return allRows.filter((row) => terms.every((term) => row.searchText.includes(term)));
  }, [query]);

  return (
    <Box
      sx={{
        position: 'relative',
        minHeight: '100vh',
        color: galaxy.text,
        background:
          'radial-gradient(circle at top left, rgba(37, 99, 235, 0.25), transparent 32%), linear-gradient(135deg, #07111f 0%, #0f172a 45%, #111827 100%)',
        '@media print': {
          background: '#ffffff',
          color: '#000000',
          minHeight: 'auto',
        },
      }}
    >
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Back + Download PDF buttons (hidden when printing) */}
        <Box className="no-print" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
          <Button
            onClick={handleBack}
            variant="outlined"
            size="small"
            aria-label="Go back"
            sx={{
              px: 2,
              color: '#dbeafe',
              textTransform: 'none',
              borderRadius: 3,
              borderColor: galaxy.border,
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(6px)',
              '&:hover': {
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.18)',
                boxShadow: '0 0 18px rgba(96, 165, 250, 0.4)',
              },
            }}
          >
            ← Back
          </Button>

          <Button
            onClick={handleDownloadPdf}
            variant="outlined"
            size="small"
            aria-label="Download PDF"
            sx={{
              px: 2,
              color: '#dbeafe',
              textTransform: 'none',
              borderRadius: 3,
              borderColor: galaxy.border,
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              backdropFilter: 'blur(6px)',
              '&:hover': {
                borderColor: '#60a5fa',
                backgroundColor: 'rgba(96, 165, 250, 0.18)',
                boxShadow: '0 0 18px rgba(96, 165, 250, 0.4)',
              },
            }}
          >
            ⬇ Download PDF
          </Button>
        </Box>

        {/* Heading + search bar */}
        <Box
          className="no-print"
          sx={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
            mb: 3,
          }}
        >
          <Box>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                background: 'linear-gradient(90deg, #bfdbfe 0%, #60a5fa 55%, #67e8f9 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Forms — Income-tax Act 2025
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: galaxy.muted }}>
              New Income-tax Act, 2025 form numbers mapped to the corresponding Income-tax Act, 1961 form
            </Typography>
          </Box>

          <TextField
            type="search"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search form number or description..."
            inputProps={{ 'aria-label': 'Search forms' }}
            sx={{
              width: { xs: '100%', sm: 380 },
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                borderRadius: 3,
                backgroundColor: 'rgba(255, 255, 255, 0.07)',
                backdropFilter: 'blur(6px)',
                '& fieldset': { borderColor: galaxy.border },
                '&:hover fieldset': { borderColor: '#60a5fa' },
                '&.Mui-focused fieldset': { borderColor: '#60a5fa', borderWidth: 1 },
                '&.Mui-focused': { boxShadow: '0 0 0 3px rgba(96, 165, 250, 0.28), 0 0 24px rgba(96, 165, 250, 0.35)' },
              },
              '& input::placeholder': { color: 'rgba(226, 232, 240, 0.6)', opacity: 1 },
              '& input[type="search"]::-webkit-search-cancel-button': { filter: 'invert(1)', cursor: 'pointer' },
            }}
          />
        </Box>

        {/* Printed title (only visible when printing) */}
        <Typography
          className="print-only"
          variant="h5"
          sx={{ display: 'none', fontWeight: 700, mb: 2, '@media print': { display: 'block' } }}
        >
          Forms — Income-tax Act 2025 (mapped to Income-tax Act, 1961)
        </Typography>

        <Typography variant="caption" className="no-print" sx={{ display: 'block', mb: 1, color: galaxy.muted }}>
          Showing {filteredRows.length} of {allRows.length} rows
        </Typography>

        <TableContainer
          component={Paper}
          sx={{
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(10px)',
            border: `1px solid ${galaxy.border}`,
            borderRadius: 3,
            boxShadow: '0 0 40px rgba(37, 99, 235, 0.25)',
            '@media print': {
              backgroundColor: '#ffffff',
              backdropFilter: 'none',
              border: '1px solid #999',
              boxShadow: 'none',
            },
          }}
        >
          <Table sx={{ minWidth: 100 }} aria-label="Income-tax Act 2025 forms mapping">
            <TableHead
              sx={{
                background: galaxy.headGradient,
                '@media print': { background: '#e5e7eb !important' },
              }}
            >
              <TableRow>
                <StyledTableCell align="center" sx={{ '@media print': { color: '#000 !important' } }}>
                  Form No.
                  <br />
                  (ITA, 2025)
                </StyledTableCell>
                <StyledTableCell align="center" sx={{ '@media print': { color: '#000 !important' } }}>
                  Form No.
                  <br />
                  (ITA, 1961)
                </StyledTableCell>
                <StyledTableCell sx={{ '@media print': { color: '#000 !important' } }}>
                  Form Description
                </StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={3} align="center" sx={{ py: 5, color: galaxy.muted }}>
                    No results found for "{query}". Try a form number (e.g. 16A) or a keyword (e.g. audit).
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                filteredRows.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell
                      component="th"
                      scope="row"
                      align="center"
                      sx={{ color: '#ffffff', fontWeight: 700, '@media print': { color: '#000 !important' } }}
                    >
                      {`Form No. ${row.newForm}`}
                    </StyledTableCell>
                    <StyledTableCell
                      align="center"
                      sx={{ color: galaxy.oldSection, fontWeight: 600, '@media print': { color: '#000 !important' } }}
                    >
                      {row.oldForm}
                    </StyledTableCell>
                    <StyledTableCell sx={{ '@media print': { color: '#000 !important' } }}>{row.desc}</StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Print-only page setup: hide on-screen chrome, force a clean light page */}
      <style>{`
        @media print {
          .no-print { display: none !important; }
          @page { size: A4 landscape; margin: 12mm; }
        }
      `}</style>
    </Box>
  );
}