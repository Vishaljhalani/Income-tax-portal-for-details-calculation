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

// Source: https://traces.tdscpc.gov.in/thingsToKnow/ratecharts (TCS chart)
// code = Section Code, old = section under Income-tax Act, 1961 (both from Gen e-TDS ver 2.26.8, checked row by row)
// sec = section under Income-tax Act, 2025 (as shown on TRACES)
// TRACES shows these rates under the heading "F. Y. 2025-2026".
const luxury = (item) => `Sale consideration exceeding threshold limit in case of ${item}`;
const LRS = 'Remittance under the Liberalised Remittance Scheme of an amount or aggregate of the amounts exceeding threshold limit for purposes';
const TOUR = 'Sale of “overseas tour programme package” including expenses for travel or hotel stay or boarding or lodging or any such similar or related expenditure with amount or aggregate of amounts';
const NOT_MINING = 'for the purpose of business, excluding mining and quarrying of mineral oil (including petroleum and natural gas).';

const rows = [
  { code: '1068', old: '206C-A', sec: '394(1) [Table: Sl. No. 1]', nature: 'Sale of alcoholic liquor for human consumption.', threshold: '-', ind: '2%', other: '2%' },
  { code: '1069', old: '206C-I', sec: '394(1) [Table: Sl. No. 2]', nature: 'Sale of tendu leaves', threshold: '-', ind: '2%', other: '2%' },
  { code: '1070', old: '206C-B', sec: '394(1) [Table: Sl. No. 3]', nature: 'Sale of timber obtained under a forest lease', threshold: '-', ind: '2%', other: '2%' },
  { code: '1071', old: '206C-C', sec: '394(1) [Table: Sl. No. 3]', nature: 'Sale of timber obtained by any mode other than a forest lease', threshold: '-', ind: '2%', other: '2%' },
  { code: '1072', old: '206C-D', sec: '394(1) [Table: Sl. No. 3]', nature: 'Sale of any other forest produce (not being timber or tendu leaves) obtained under a forest lease.', threshold: '-', ind: '2%', other: '2%' },
  { code: '1073', old: '206C-E', sec: '394(1) [Table: Sl. No. 4]', nature: 'Sale of scrap.', threshold: '-', ind: '2%', other: '2%' },
  { code: '1074', old: '206C-J', sec: '394(1) [Table: Sl. No. 5]', nature: 'Sale of minerals, being coal or lignite or iron ore.', threshold: '-', ind: '2%', other: '2%' },

  { code: '1075', old: '206C-L', sec: '394(1) [Table: Sl. No. 6.D(a)]', nature: luxury('sale of motor vehicle'), threshold: '1000000', ind: '1%', other: '1%' },
  { code: '1076', old: '206C-MA', sec: '394(1) [Table: Sl. No. 6.D(b)]', nature: luxury('sale of wrist watch'), threshold: '1000000', ind: '1%', other: '1%' },
  { code: '1077', old: '206C-MB', sec: '394(1) [Table: Sl. No. 6.D(b)]', nature: luxury('sale of art piece such as antiques, painting, sculpture'), threshold: '1000000', ind: '1%', other: '1%' },
  { code: '1078', old: '206C-MC', sec: '394(1) [Table: Sl. No. 6.D(b)]', nature: luxury('sale of collectibles such as coin, stamp'), threshold: '1000000', ind: '1%', other: '1%' },
  { code: '1079', old: '206C-MD', sec: '394(1) [Table: Sl. No. 6.D(b)]', nature: luxury('sale of yacht, rowing boat, canoe, helicopter'), threshold: '1000000', ind: '1%', other: '1%' },
  { code: '1080', old: '206C-ME', sec: '394(1) [Table: Sl. No. 6.D(b)]', nature: luxury('sale of pair of sunglasses'), threshold: '1000000', ind: '1%', other: '1%' },
  { code: '1081', old: '206C-MF', sec: '394(1) [Table: Sl. No. 6.D(b)]', nature: luxury('sale of bag such as handbag, purse'), threshold: '1000000', ind: '1%', other: '1%' },
  { code: '1082', old: '206C-MG', sec: '394(1) [Table: Sl. No. 6.D(b)]', nature: luxury('sale of pair of shoes'), threshold: '1000000', ind: '1%', other: '1%' },
  { code: '1083', old: '206C-MH', sec: '394(1) [Table: Sl. No. 6.D(b)]', nature: luxury('sale of sportswear and equipment such as golf kit, ski-wear'), threshold: '1000000', ind: '1%', other: '1%' },
  { code: '1084', old: '206C-MI', sec: '394(1) [Table: Sl. No. 6.D(b)]', nature: luxury('sale of home theatre system'), threshold: '1000000', ind: '1%', other: '1%' },
  { code: '1085', old: '206C-MJ', sec: '394(1) [Table: Sl. No. 6.D(b)]', nature: luxury('sale of horse for horse racing in race clubs and horse for polo'), threshold: '1000000', ind: '1%', other: '1%' },

  { code: '1086', old: '206C-T', sec: '394(1) [Table: Sl. No. 7.D(a)]', nature: `${LRS} of education or medical treatment`, threshold: '1000000', ind: '2%', other: '2%' },
  { code: '1087', old: '206C-Q', sec: '394(1) [Table: Sl. No. 7.D(b)]', nature: `${LRS} other than education or medical treatment`, threshold: '1000000', ind: '20%', other: '20%' },
  { code: '1088', old: '206C-O', sec: '394(1) [Table: Sl. No. 8.D(a)]', nature: `${TOUR} up to ₹10,00,000.`, threshold: '-', ind: '2%', other: '2%' },
  { code: '1089', old: '206C-O', sec: '394(1) [Table: Sl. No. 8.D(b)]', nature: `${TOUR} above ₹10,00,000.`, threshold: '-', ind: '2%', other: '2%' },

  { code: '1090', old: '206C-F', sec: '394(1) [Table: Sl. No. 9]', nature: `Use of parking lot ${NOT_MINING}`, threshold: '-', ind: '2%', other: '2%' },
  { code: '1091', old: '206C-G', sec: '394(1) [Table: Sl. No. 9]', nature: `Use of toll plaza ${NOT_MINING}`, threshold: '-', ind: '2%', other: '2%' },
  { code: '1092', old: '206C-H', sec: '394(1) [Table: Sl. No. 9]', nature: `Use of mine or quarry ${NOT_MINING}`, threshold: '-', ind: '2%', other: '2%' },
];

// ==========================================================================
// Surcharge Rates — Form 144, "Collectee Category". Source: same TRACES page,
// "Surcharge Rates" tab. Rates depend only on the Collectee Category, not on
// the nature of collection, so they're identical across every row — the
// section/nature list below is built straight from `rows` above (skipping
// 1069, "Sale of tendu leaves", which TRACES' own Surcharge Rates tab omits)
// so it can never drift out of sync with the TCS Rates tab.
// "Yes" = deductee opting out of taxation regime u/s 202(7) (Old Tax Regime)
// "No"  = deductee not opting out (New Tax Regime)
// ==========================================================================
const surchargeRows = rows
  .filter((r) => r.code !== '1069')
  .map((r, id) => ({ id, section: r.sec, collectionCode: '206C', nature: r.nature }));

const SURCHARGE_CAT1_YES =
  'Does not exceed ₹50 lac = 0%\nAbove ₹50 lac but does not exceed ₹1cr = 10%\nAbove ₹1cr but does not exceed ₹2cr = 15%\nAbove ₹2cr but does not exceed ₹5cr = 25%\nAbove ₹5cr = 37%';
const SURCHARGE_CAT1_NO =
  'Does not exceed ₹50 lac = 0%\nAbove ₹50 lac but does not exceed ₹1cr = 10%\nAbove ₹1cr but does not exceed ₹2cr = 15%\nAbove ₹2cr = 25%';
const SURCHARGE_AOP_COMPANIES =
  'Does not exceed ₹50 lac = 0%\nAbove ₹50 lac but does not exceed ₹1cr = 10%\nAbove ₹1cr = 15%';
const SURCHARGE_COOP = 'Does not exceed ₹1cr = 0%\nAbove ₹1cr but does not exceed ₹10cr = 7%\nAbove ₹10cr = 12%';
const SURCHARGE_FIRM = 'Does not exceed ₹1cr = 0%\nAbove ₹1cr = 12%';
const SURCHARGE_COMPANY = 'Does not exceed ₹1cr = 0%\nAbove ₹1cr but does not exceed ₹10cr = 2%\nAbove ₹10cr = 5%';

// "50000" -> "50,000" (Indian grouping). Text values are shown as-is.
const formatThreshold = (value) =>
  /^\d+$/.test(value) ? Number(value).toLocaleString('en-IN') : value;

// Lowercase + hyphens removed, so "skiwear" or "ski wear" both find "ski-wear".
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

export default function TCSRateChartPage() {
  const [query, setQuery] = useState('');
  const [view, setView] = useState('tcs'); // 'tcs' | 'surcharge'
  const navigate = useNavigate();

  // Go to the previous page; if this page was opened directly (no history), go to Home.
  const handleBack = () => {
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Every word typed must match somewhere in the row, e.g. "scrap 2%" or "sale watch".
  const filteredRows = useMemo(() => {
    const terms = normalize(query).split(/\s+/).filter(Boolean);
    if (terms.length === 0) return allRows;
    return allRows.filter((row) => terms.every((term) => row.searchText.includes(term)));
  }, [query]);

  const toggleButtonSx = (active) => ({
    px: 3,
    color: active ? '#ffffff' : '#dbeafe',
    textTransform: 'none',
    fontWeight: 700,
    borderRadius: 3,
    borderColor: galaxy.border,
    background: active ? galaxy.headGradient : 'rgba(255, 255, 255, 0.07)',
    backdropFilter: 'blur(6px)',
    boxShadow: active ? '0 0 24px rgba(37, 99, 235, 0.35)' : 'none',
    '&:hover': {
      borderColor: '#60a5fa',
      background: active ? galaxy.headGradient : 'rgba(96, 165, 250, 0.18)',
      boxShadow: '0 0 18px rgba(96, 165, 250, 0.4)',
    },
  });

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

        {/* TCS Rates / Surcharge Rates toggle */}
        <Box sx={{ display: 'flex', gap: 1.5, mb: 3 }}>
          <Button
            onClick={() => setView('tcs')}
            variant={view === 'tcs' ? 'contained' : 'outlined'}
            disableElevation
            sx={toggleButtonSx(view === 'tcs')}
          >
            TCS Rates
          </Button>
          <Button
            onClick={() => setView('surcharge')}
            variant={view === 'surcharge' ? 'contained' : 'outlined'}
            disableElevation
            sx={toggleButtonSx(view === 'surcharge')}
          >
            Surcharge Rates
          </Button>
        </Box>

        {view === 'tcs' ? (
          <>
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
                  TCS Rate Chart
                </Typography>
                <Typography variant="body2" sx={{ mt: 0.5, color: galaxy.muted }}>
                  Tax Collected at Source (TCS) - F. Y. 2025-2026 as shown on TRACES (old Income-tax Act, 1961 sections shown for reference)
                </Typography>
              </Box>

              <TextField
                type="search"
                size="small"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search section, nature of payment, rate..."
                inputProps={{ 'aria-label': 'Search TCS rate chart' }}
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
                // width: `100%`
              }}
            >
              <Table sx={{ minWidth: 100 }} aria-label="TCS rate chart">
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
                    <StyledTableCell>Nature of Payment</StyledTableCell>
                    <StyledTableCell align="center">Threshold Amount (₹)</StyledTableCell>
                    <StyledTableCell align="center">
                      TCS Rate (%)
                      <br />
                      Individual / HUF
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      TCS Rate (%)
                      <br />
                      Other
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredRows.length === 0 ? (
                    <StyledTableRow>
                      <StyledTableCell colSpan={7} align="center" sx={{ py: 5, color: galaxy.muted }}>
                        No results found for "{query}". Try a section number (e.g. 394(1)) or a keyword (e.g. scrap).
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
              of this Act, every person, entitled to paying any amount on which tax is collectible, shall furnish his valid
              Permanent Account Number to the person responsible for collecting tax, in case of failing tax shall be
              collected at the higher of the following rates, namely:-
              <br />
              (i) at twice the rate specified in the relevant provision of this Act; or
              <br />
              (ii) at the rate of five per cent.
              <br />
              Provided that the rate of tax collection at source under this section shall not exceed twenty per cent.
            </Alert>
          </>
        ) : (
          <>
            {/* Heading */}
            <Box sx={{ mb: 3 }}>
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
                Surcharge Rate Chart
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, color: galaxy.muted }}>
                Form 144, Collectee Category. "Yes" = deductee opting out of the taxation regime u/s 202(7)
                (Old Tax Regime); "No" = deductee not opting out (New Tax Regime).
              </Typography>
            </Box>

            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: galaxy.muted }}>
              Showing {surchargeRows.length} rows
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
              <Table sx={{ minWidth: 100 }} aria-label="TCS surcharge rate chart">
                <TableHead sx={{ background: galaxy.headGradient }}>
                  <TableRow>
                    <StyledTableCell align="center">
                      Section
                      <br />
                      (Income-tax Act, 2025)
                    </StyledTableCell>
                    <StyledTableCell align="center">Collection Code</StyledTableCell>
                    <StyledTableCell>Nature of Payment</StyledTableCell>
                    <StyledTableCell align="center">
                      Individual / HUF / Body of Individuals / Artificial Judicial Person / Association of Persons
                      (except AOP consisting of only companies as its members)
                      <br />
                      Yes (Old Tax Regime)
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Individual / HUF / Body of Individuals / Artificial Judicial Person / Association of Persons
                      (except AOP consisting of only companies as its members)
                      <br />
                      No (New Tax Regime)
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      Association of Persons (AOP) consisting of only companies as its members
                    </StyledTableCell>
                    <StyledTableCell align="center">Co-operative Society</StyledTableCell>
                    <StyledTableCell align="center">Firm</StyledTableCell>
                    <StyledTableCell align="center">Company</StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {surchargeRows.map((row) => (
                    <StyledTableRow key={row.id}>
                      <StyledTableCell align="center" sx={{ color: galaxy.newSection }}>
                        {row.section}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ color: galaxy.oldSection, fontWeight: 600 }}>
                        {row.collectionCode}
                      </StyledTableCell>
                      <StyledTableCell sx={multiline}>{row.nature}</StyledTableCell>
                      <StyledTableCell align="center" sx={{ ...multiline, color: galaxy.rate, fontWeight: 600 }}>
                        {SURCHARGE_CAT1_YES}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ ...multiline, color: galaxy.rate, fontWeight: 600 }}>
                        {SURCHARGE_CAT1_NO}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ ...multiline, color: galaxy.rate, fontWeight: 600 }}>
                        {SURCHARGE_AOP_COMPANIES}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ ...multiline, color: galaxy.rate, fontWeight: 600 }}>
                        {SURCHARGE_COOP}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ ...multiline, color: galaxy.rate, fontWeight: 600 }}>
                        {SURCHARGE_FIRM}
                      </StyledTableCell>
                      <StyledTableCell align="center" sx={{ ...multiline, color: galaxy.rate, fontWeight: 600 }}>
                        {SURCHARGE_COMPANY}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>
        )}
      </Box>
    </Box>
  );
}