import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// ---------- Galaxy theme tokens ----------
const galaxy = {
  text: '#e2e8f0',
  muted: 'rgba(226, 232, 240, 0.7)',
  border: 'rgba(96, 165, 250, 0.35)',
  headGradient: 'linear-gradient(90deg, #1e3a8a 0%, #2563eb 60%, #0284c7 100%)',
  oldSection: '#93c5fd', // light blue
  newSection: '#cbd5e1', // slate
  rate: '#67e8f9', // cyan
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
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
});

// Source: https://traces.tdscpc.gov.in/thingsToKnow/ratecharts
// code = Section Code, old = section under Income-tax Act, 1961 (both from Gen e-TDS ver 2.26.8, checked row by row; blank = not in Gen e-TDS)
// sec = section under Income-tax Act, 2025 (as shown on TRACES)
const NR_RES = '10% - For Residents\n35% - For Non Residents Company\n30% - For Non Residents other than companies';
const CONTRACT_LIMIT = '(a) ₹ 30000; for any such sum; and (b) ₹ 100000 in case of aggregate of such sums.';
const BOND_4A = '4%, where such bonds are issued on or after the 1st April, 2020 but before the 1st July, 2023;';
const BOND_4B = '9%, where such bonds are issued on or after the 1st July, 2023';

const rows = [
  { code: '1004', old: '192A', sec: '392(7)', nature: 'Any payment of accumulated balance due to an employee', threshold: '50000', ind: '10%', other: '-' },

  { code: '1005', old: '194D', sec: '393(1) [Table: Sl. No. 1(i)]', nature: 'Commission or brokerage - insurance', threshold: '20000', ind: '2%', other: '10%' },
  { code: '1006', old: '194H', sec: '393(1) [Table: Sl. No. 1(ii)]', nature: 'Commission or brokerage - others', threshold: '20000', ind: '2%', other: '2%' },
  { code: '', old: '', sec: '393(1) [Table: Sl. No. 2(i)]', nature: 'Payment of any other Rent', threshold: '50000', ind: '2%', other: '2%' },
  { code: '1008', old: '194I(a)', sec: '393(1) [Table: Sl. No. 2(ii).D(a)]', nature: 'Rent on machinery etc.- specified person', threshold: '50000', ind: '2%', other: '2%' },
  { code: '1009', old: '194I(b)', sec: '393(1) [Table: Sl. No. 2(ii).D(b)]', nature: 'Rent other than machinery etc.- specified person', threshold: '50000', ind: '10%', other: '10%' },
  { code: '', old: '', sec: '393(1) [Table: Sl. No. 3(i)]', nature: 'TDS on transfer of immovable property under section 393(1) [Table: Sl. No. 3(i)]', threshold: '5000000', ind: '1%', other: '1%' },
  { code: '', old: '', sec: '393(1) [Table: Sl.No. 2(i)]', nature: 'TDS on Rent paid by Individual/HUF under section 393(1) [Table Sl. No. 2(i)]', threshold: '50000', ind: '2%', other: '2%' },
  { code: '1011', old: '194IC', sec: '393(1) [Table: Sl. No. 3(ii)]', nature: 'Payment on any consideration, not being consideration in kind, under the agreement referred to in section 67(14).', threshold: 'Nil', ind: '10%', other: '10%' },
  { code: '1012', old: '194LA', sec: '393(1) [Table: Sl. No. 3(iii)]', nature: 'Payment of compensation on acquisition of certain immovable property', threshold: '500000', ind: '10%', other: '10%' },
  { code: '1013', old: '194K', sec: '393(1) [Table: Sl. No. 4(i)]', nature: 'Income payable to a resident assessee in respect of Units of a specified Mutual Fund specified under Schedule VII [Table: Sl. No. 20 or 21] or units from the Administrator of the specified undertaking or units from specified company', threshold: '10000', ind: '10%', other: '10%' },
  { code: '1014', old: '194LBA', sec: '393(1) [Table: Sl. No. 4(ii)]', nature: 'Certain income in the form of interest from units of a business trust to a resident unit holder', threshold: 'Nil', ind: '10%', other: '10%' },
  { code: '1015', old: '194LBA', sec: '393(1) [Table: Sl. No. 4(ii)]', nature: 'Certain income in the form of dividend from units of a business trust to a resident unit holder', threshold: 'Nil', ind: '10%', other: '10%' },
  { code: '1016', old: '194LBA', sec: '393(1) [Table: Sl. No. 4(ii)]', nature: 'Certain income in the form of Renting from units of a business trust being a real estate investment trust to a resident unit holder', threshold: 'Nil', ind: '10%', other: '10%' },
  { code: '1017', old: '194LBB', sec: '393(1) [Table: Sl. No. 4(iii)]', nature: 'Any income, other than that proportion of income which is exempt under Schedule V [Table: Sl. No. 2], in respect of units of an investment fund specified in section 224, payable to its unitholder.', threshold: 'Nil', ind: '10%', other: '10%' },
  { code: '1018', old: '194LBC', sec: '393(1) [Table: Sl. No. 4(iv)]', nature: 'Any income, in respect of an investment in a securitisation trust specified in section 221 to an investor.', threshold: 'Nil', ind: '10%', other: '10%' },
  { code: '1019', old: '193', sec: '393(1) [Table: Sl. No. 5(i)]', nature: 'Any income by way of Interest on securities', threshold: '10000', ind: '10%', other: '10%' },
  { code: '1020', old: '194A', sec: '393(1) [Table: Sl. No. 5(ii).D(a)]', nature: 'Any income by way of interest other than interest on securities, in case of deductee/payee is a senior citizen', threshold: '100000', ind: '10%', other: '-' },
  { code: '1021', old: '194A', sec: '393(1) [Table: Sl. No. 5(ii).D(b)]', nature: 'Any income by way of interest other than interest on securities, in case of deductee/payee is other than senior citizen', threshold: '50000', ind: '10%', other: '10%' },
  { code: '1022', old: '194A', sec: '393(1) [Table: Sl. No. 5(iii)]', nature: 'Any income being interest other than interest on securities', threshold: '10000', ind: '10%', other: '10%' },
  { code: '1023', old: '194C', sec: '393(1) [Table: Sl. No. 6(i).D(a)]', nature: 'Any sum for carrying out any work (including supply of labour for carrying out any work) in pursuance of a contract between the contractor and a designated person – if contractor is individual or Hindu undivided family', threshold: CONTRACT_LIMIT, ind: '1%', other: '2%' },
  { code: '1024', old: '194C', sec: '393(1) [Table: Sl. No. 6(i).D(b)]', nature: 'Any sum for carrying out any work (including supply of labour for carrying out any work) in pursuance of a contract between the contractor and a designated person – if contractor is a person other than individual or Hindu undivided family', threshold: CONTRACT_LIMIT, ind: '1%', other: '2%' },
  { code: '', old: '', sec: '393(1) [Table: Sl. No. 6(ii)]', nature: 'TDS on payment made by individual_huf to Contractor / Professionals u/s. 393(1) [Table Sl. No. 6(ii)]', threshold: '5000000', ind: '2%', other: '-' },
  { code: '1026', old: '194J(a)', sec: '393(1) [Table: Sl. No. 6(iii).D(a)]', nature: 'Any sum by way of–– (a) fees for technical services (not being a professional services); or (b) royalty in the nature of consideration for sale, distribution or exhibition of cinematographic films; or (c) payee, engaged only in the business of operation of call centre', threshold: '50000', ind: '2%', other: '2%' },
  { code: '1027', old: '194J(b)', sec: '393(1) [Table: Sl. No. 6(iii).D(b)]', nature: 'Any sum by way of–– (a) fees for professional services; or (b) any sum referred to in section 26(2)(h)', threshold: '50000', ind: '10%', other: '10%' },
  { code: '1028', old: '194J(b)', sec: '393(1) [Table: Sl. No. 6(iii).D(b)]', nature: 'Any sum by way of remuneration or fees or commission by whatever name called, other than those on which tax is deductible under section 392, to a director of a company', threshold: '–', ind: '10%', other: '10%' },
  { code: '1029', old: '194', sec: '393(1) [Table: Sl. No. 7]', nature: 'Any dividends (including on preference shares) declared.', threshold: '10000(Individual)', ind: '10%', other: '10%' },
  { code: '1030', old: '194DA', sec: '393(1) [Table: Sl. No. 8(i)]', nature: 'Any sum under a life insurance policy, including the sum allocated as bonus on such policy, other than the amount not includible in the total income under Schedule II [Table: Sl. No. 2]', threshold: '100000', ind: '2%', other: '2%' },
  { code: '1031', old: '194Q', sec: '393(1) [Table: Sl. No. 8(ii)]', nature: 'Any sum for purchase of any goods', threshold: 'in excess of 5000000', ind: '0.10%', other: '0.10%' },
  { code: '1033', old: '194R', sec: '393(1) [Table: Sl. No. 8(iv)]', nature: 'Any benefit or perquisite, whether convertible into money or not, arising from business or the exercise of a profession of any resident.', threshold: '20000', ind: '10%', other: '10%' },
  { code: '', old: '', sec: '393(1) [Table: Sl. No. 8(iv) Note 6]', nature: 'Any benefit or perquisite, whether in cash or in kind or partly in cash and partly in kind, whether convertible into money or not, arising from business or the exercise of a profession of any resident.', threshold: '20000', ind: '10%', other: '10%' },
  { code: '1035', old: '194O', sec: '393(1) [Table: Sl. No. 8(v)]', nature: 'Sale of goods or provision of services by an e-commerce participant, facilitated by an e-commerce operator through its digital or electronic facility or platform. - any e commerce operator', threshold: '500000(Individual/HUF)', ind: '0.10%', other: '0.10%' },
  { code: '1037', old: '194S', sec: '393(1) [Table: Sl. No. 8(vi)]', nature: 'Any sum by way of consideration for transfer of a virtual digital asset by other than Individual or Hindu Undivided Family.', threshold: '10000', ind: '1%', other: '1%' },
  { code: '', old: '', sec: '393(1) [Table: Sl. No. 8(vi)]', nature: 'Any sum by way of consideration for transfer of a virtual digital asset by Individual or Hindu Undivided Family 393(1) [Table: Sl. No. 8(vi)]', threshold: '50000', ind: '1%', other: '1%' },
  { code: '', old: '', sec: '393(1) [Table: Sl. No. 8(vi)] Note 6', nature: 'Any sum by way of consideration, whether in cash or in kind or partly in cash and partly in kind, for transfer of a virtual digital asset', threshold: '10000', ind: '1%', other: '1%' },

  { code: '1039', old: '194E', sec: '393(2) [Table: Sl. No. 1]', nature: 'Any income referred to in section 211.', threshold: '-', ind: '20%', other: '20%' },
  { code: '1040', old: '194LC (2)(i)', sec: '393(2) [Table: Sl. No. 2]', nature: 'Any income by way of interest payable in respect of moneys borrowed in foreign currency from a source outside India,— (a) under a loan agreement or issue of long term infrastructure bond on or after the 1st July, 2012 but before the 1st July, 2023; or (b) by way of issue of any long-term bond on or after the 1st October, 2014 but before the 1st July, 2023, which is approved by the Central Government in this behalf (for non resident payee)', threshold: '-', ind: '5%', other: '5%' },
  { code: '1041', old: '194LC (2)(ia)', sec: '393(2) [Table: Sl. No. 3]', nature: 'Any income by way of interest payable in respect of monies borrowed from a source outside India by way of issue of rupee denominated bond before the 1st July, 2023.', threshold: '-', ind: '5%', other: '5%' },
  { code: '1042', old: '194LC (2)(ib)', sec: '393(2) [Table: Sl. No. 4.E(a)]', nature: 'Any income by way of interest payable in respect of monies borrowed from a source outside India by way of issue of any long-term bond or rupee denominated bond, which is listed only on a recognised stock exchange located in any International Financial Services Centre. - Issued on or after the 1st April, 2020 but before the 1st July, 2023', threshold: '-', ind: BOND_4A, other: BOND_4A },
  { code: '1043', old: '194LC (2)(ic)', sec: '393(2) [Table: Sl. No. 4.E(b)]', nature: 'Any income by way of interest payable in respect of monies borrowed from a source outside India by way of issue of any long-term bond or rupee denominated bond, which is listed only on a recognised stock exchange located in any International Financial Services Centre - Issued on or after the 1st July, 2023', threshold: '-', ind: BOND_4B, other: BOND_4B },
  { code: '1044', old: '194LB', sec: '393(2) [Table: Sl. No. 5]', nature: 'Income by way of interest from infrastructure debt fund', threshold: '-', ind: '5%', other: '5%' },
  { code: '1045 / 1046', old: '194LBA', sec: '393(2) [Table: Sl. No. 6.E(a) / 6.E(b)]', nature: 'Any distributed income referred to in section 223, being of the nature referred to in Schedule V [Table: Sl. No. 3.B(a) / 3.B(b)]', threshold: '-', ind: '5 % (Int) or 10% (Rental)', other: '5 % (Int) or 10% (Rental)' },
  { code: '1047', old: '194LBA', sec: '393(2) [Table: Sl. No. 7]', nature: 'Distributed income from business trust (Schedule V, Table 4)\nOther Distributed income – could be capital gains , dividends, misc income', threshold: '-', ind: '30%', other: '35% - For Non Residents Company\n30% - For Non Residents other than companies' },
  { code: '1048', old: '194LBB', sec: '393(2) [Table: Sl. No. 8]', nature: 'Income from investment funds (Section 224)', threshold: '-', ind: '10% - For Residents\n30% - For Non Resident', other: NR_RES },
  { code: '1049', old: '194LBC', sec: '393(2) [Table: Sl. No. 9]', nature: 'Income from securitisation trust (Section 221)', threshold: '-', ind: '30%', other: NR_RES },
  { code: '1050', old: '196A', sec: '393(2) [Table: Sl. No. 10]', nature: 'Income from mutual funds or specified company', threshold: '-', ind: '20% or rate provided in the agreement, whichever is lower', other: '20% or rate provided in the agreement, whichever is lower\n* Not Applicable for company' },
  { code: '1051', old: '196B', sec: '393(2) [Table: Sl. No. 11]', nature: 'Income from units referred to in Section 208', threshold: '-', ind: '10%', other: '10%' },
  { code: '1052', old: '196B', sec: '393(2) [Table: Sl. No. 12]', nature: 'Long-term capital gains from transfer of units referred in Section 208', threshold: '-', ind: '12.5%', other: '12.5%' },
  { code: '1053', old: '196C', sec: '393(2) [Table: Sl. No. 13]', nature: 'Interest or dividends from bonds or GDRs (Section 209)', threshold: '-', ind: '10%', other: '10%' },
  { code: '1054', old: '196C', sec: '393(2) [Table: Sl. No. 14]', nature: 'Long-term capital gains from transfer of bonds or GDRs (Section 209)', threshold: '-', ind: '12.5%', other: '12.5%' },
  { code: '1055', old: '196D', sec: '393(2) [Table: Sl. No. 15]', nature: 'Income from securities referred in Section 210', threshold: '-', ind: '20%', other: '20%' },
  { code: '1056', old: '196D(1A)', sec: '393(2) [Table: Sl. No. 16]', nature: 'Any income in respect of securities referred to in section 210(1)', threshold: '-', ind: '10%', other: '10%' },
  { code: '1057', old: '195', sec: '393(2) [Table: Sl. No. 17]', nature: 'Any interest (not covered under S.No. 2–5) or any other sum chargeable under the Act (excluding salaries)', threshold: '-', ind: '-', other: 'Average rate as applicable' },

  { code: '1058', old: '194B', sec: '393(3) [Table: Sl. No. 1]', nature: 'Any income by way of winnings (other than winnings from Sl. No. 2 of the table at section 393(3)) from–– (a) any lottery; or (b) crossword puzzle; or (c) card game and other game of any sort; or (d) gambling or betting of any form or nature whatsoever', threshold: '10000 for a single transaction', ind: '30%', other: '30%' },
  { code: '1060', old: '194BA', sec: '393(3) [Table: Sl. No. 2]', nature: 'Any income by way of winnings from online game.', threshold: '-', ind: '30%', other: '30%' },
  { code: '1062', old: '194BB', sec: '393(3) [Table: Sl. No. 3]', nature: 'Any income by way of winnings from any horse race.', threshold: '10000 for a single transaction', ind: '30%', other: '30%' },
  { code: '1063', old: '194G', sec: '393(3) [Table: Sl. No. 4]', nature: 'Any income, credited or paid to a person, who is or has been stocking, distributing, purchasing or selling lottery tickets, by way of commission, remuneration or prize (by whatever name called) on such tickets', threshold: '20000', ind: '2%', other: '2%' },
  { code: '1064', old: '194NC', sec: '393(3) [Table: Sl. No. 5.D(a)]', nature: 'Payment of certain amounts in cash by bank/ post office / co-operative society to a deductee being a co-operative society', threshold: '3 crore', ind: '2%', other: '2%' },
  { code: '1065', old: '194N', sec: '393(3) [Table: Sl. No. 5.D(b)]', nature: 'Payment of certain amounts in cash by bank/ post office / co-operative society to a deductee being a person other than co-operative society', threshold: '1 crore', ind: '2%', other: '2%' },
  { code: '1066', old: '194EE', sec: '393(3) [Table: Sl. No. 6]', nature: 'Any amount referred to in section 80CCA(2)(a) of the Income-tax Act, 1961 (43 of 1961).', threshold: '2500', ind: '10%', other: '10%' },
  { code: '1067', old: '194T', sec: '393(3) [Table: Sl. No. 7]', nature: 'Any sum in the nature of salary, remuneration, commission, bonus or interest paid to a partner of the firm or credited to his account (including capital account).', threshold: '20000', ind: '-', other: '10%' },
];

// "50000" -> "50,000" (Indian grouping). Text values are shown as-is.
const formatThreshold = (value) =>
  /^\d+$/.test(value) ? Number(value).toLocaleString('en-IN') : value;

// Lowercase + hyphens removed, so "ecommerce" finds "e-commerce".
const normalize = (text) => String(text).toLowerCase().replace(/-/g, '');

// Every row gets a stable id and one searchable text (all columns together).
const allRows = rows.map((row, id) => ({
  ...row,
  id,
  searchText: normalize(
    [row.code, row.old, row.sec, row.nature, row.threshold, formatThreshold(row.threshold), row.ind, row.other].join(' ')
  ),
}));

const multiline = { whiteSpace: 'pre-line' };

export default function TDSRateChartPage() {
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

  // Every word typed must match somewhere in the row, e.g. "194c contractor" or "rent 10%".
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
      }}
    >
      {/* Content */}
      <Box sx={{ position: 'relative', zIndex: 1, p: { xs: 2, sm: 3, md: 4 } }}>
        {/* Back button */}
        <Button
          onClick={handleBack}
          variant="outlined"
          size="small"
          aria-label="Go back"
          sx={{
            mb: 2,
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

        {/* Heading + search bar */}
        <Box
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
              TDS Rate Chart
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, color: galaxy.muted }}>
              Income-tax Act, 2025 sections (old Income-tax Act, 1961 sections shown for reference)
            </Typography>
          </Box>

          <TextField
            type="search"
            size="small"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search section, nature of payment, rate..."
            inputProps={{ 'aria-label': 'Search TDS rate chart' }}
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

        <Typography variant="caption" sx={{ display: 'block', mb: 1, color: galaxy.muted }}>
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
          }}
        >
          <Table sx={{ minWidth: 1250 }} aria-label="TDS rate chart">
            <TableHead sx={{ background: galaxy.headGradient }}>
              <TableRow>
                <StyledTableCell align="center">Section Code</StyledTableCell>
                <StyledTableCell align="center">
                  Old Section
                  <br />
                  (Income-tax Act, 1961)
                </StyledTableCell>
                <StyledTableCell align="center">
                  New Section
                  <br />
                  (Income-tax Act, 2025)
                </StyledTableCell>
                <StyledTableCell>Nature of Payment Made To Residents (Section - Description)</StyledTableCell>
                <StyledTableCell align="center">Threshold (₹)</StyledTableCell>
                <StyledTableCell align="center">Individual / HUF</StyledTableCell>
                <StyledTableCell align="center">Other than Individual / HUF</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.length === 0 ? (
                <StyledTableRow>
                  <StyledTableCell colSpan={7} align="center" sx={{ py: 5, color: galaxy.muted }}>
                    No results found for "{query}". Try a section number (e.g. 194C) or a keyword (e.g. rent).
                  </StyledTableCell>
                </StyledTableRow>
              ) : (
                filteredRows.map((row) => (
                  <StyledTableRow key={row.id}>
                    <StyledTableCell component="th" scope="row" align="center" sx={{ color: '#ffffff', fontWeight: 700 }}>
                      {row.code}
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: galaxy.oldSection, fontWeight: 600 }}>
                      {row.old}
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ color: galaxy.newSection }}>
                      {row.sec}
                    </StyledTableCell>
                    <StyledTableCell sx={multiline}>{row.nature}</StyledTableCell>
                    <StyledTableCell align="center" sx={multiline}>
                      {formatThreshold(row.threshold)}
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ ...multiline, color: galaxy.rate, fontWeight: 600 }}>
                      {row.ind}
                    </StyledTableCell>
                    <StyledTableCell align="center" sx={{ ...multiline, color: galaxy.rate, fontWeight: 600 }}>
                      {row.other}
                    </StyledTableCell>
                  </StyledTableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Alert
          severity="info"
          sx={{
            mt: 3,
            color: '#e0f2fe',
            backgroundColor: 'rgba(56, 189, 248, 0.10)',
            border: '1px solid rgba(56, 189, 248, 0.35)',
            backdropFilter: 'blur(6px)',
            '& .MuiAlert-icon': { color: '#38bdf8' },
          }}
        >
          <AlertTitle>Note :- Tax Rates where PAN is Invalid/Inoperative/Not Available.</AlertTitle>
          Section 397 of Income-tax Act, 2025 provides that irrespective of anything contained in any other provision
          of this Act, every person, entitled to receive any amount on which tax is deductible, shall furnish his valid
          Permanent Account Number to the person responsible for deducting tax, in case of failing tax shall be
          deducted at the higher of the following rates, namely:-
          <br />
          (i) at the rate specified in the relevant provision of this Act; or
          <br />
          (ii) at the rate or rates in force; or
          <br />
          (iii) at the rate of 5% where tax is required to be deducted under section 393(1) [Table: Sl. No. 8(ii) or
          8(v)]; or 20% in any other case;
        </Alert>
      </Box>
    </Box>
  );
}