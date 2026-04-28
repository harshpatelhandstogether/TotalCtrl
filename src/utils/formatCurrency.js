function formatCurrency(value, symbol) {
  if (value === null || value === undefined || value === "") return "";
  if (!symbol) symbol = "";

  const formatted = new Intl.NumberFormat("sv-SE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);
  return `${formatted} ${symbol}`;
}


const formatCurrencyInput = (value, currency) => {
  const decimal = currency?.decimalSeparator || ",";

  // Replace BOTH dot and comma → currency decimal separator
  let cleaned = value.replace(/[.,]/g, decimal);

  // Remove everything except numbers and decimal separator
  const escaped = decimal.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  cleaned = cleaned.replace(new RegExp(`[^0-9${escaped}]`, "g"), "");

  // Prevent multiple decimal separators
  const parts = cleaned.split(decimal);
  if (parts.length > 2) {
    cleaned = parts[0] + decimal + parts.slice(1).join("");
  }

  return cleaned; // stored as "12,50" if decimal is ","
};

const parseLocalizedNumber = (value, currency) => {
  if (value === null || value === undefined || value === "") return NaN;
  const decimal = currency?.decimalSeparator || ",";
  const normalized = value.toString().replace(decimal, ".");
  return Number(normalized);
};

const displayCurrency = (value, currency) => {
  if (!value && value !== 0) return "";
  if (!currency) return value; // ← guard if currency not loaded yet

  const num = parseLocalizedNumber(value, currency);
  if (isNaN(num)) return "";

  const decimal = currency?.decimalSeparator || " ";   // "," from API
  const thousand = currency?.thousandSeparator || " "; // " " from API
  const symbol = currency?.symbol || "";
  console.log("currency in displayCurrency:", symbol);

  const [intPart, decPart] = num.toFixed(2).split(".");

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
  const formattedValue = `${formattedInt}${decimal}${decPart} ${symbol}`; // "1 234,50 kr"
  const finalValue = formattedValue.trim(); // Remove any extra spaces

 
  return finalValue;

};

const displayCurrencyWithoutSymbol = (value, currency) => {
  if (!value && value !== 0) return "";
  if (!currency) return value; // ← guard if currency not loaded yet

  const num = parseLocalizedNumber(value, currency);
  if (isNaN(num)) return "";

  const decimal = currency?.decimalSeparator || " ";   // "," from API
  const thousand = currency?.thousandSeparator || " "; // " " from API

  const [intPart, decPart] = num.toFixed(2).split(".");

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, thousand);
  const formattedValue = `${formattedInt}${decimal}${decPart}`; // "1 234,50"
  return formattedValue.trim(); // Remove any extra spaces
};
export { formatCurrency, formatCurrencyInput, displayCurrency, displayCurrencyWithoutSymbol };