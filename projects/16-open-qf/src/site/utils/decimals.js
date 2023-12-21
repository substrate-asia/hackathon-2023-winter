export default function getDecimalsFromSymbol(symbol) {
  if (symbol === "DOT") {
    return 10;
  }

  throw new Error(`Unknown symbol: ${ symbol }`);
}
