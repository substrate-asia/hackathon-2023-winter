import BigNumber from "bignumber.js";

export default function LocaleSymbol({ value }) {
  const decimals = 10;
  return `${new BigNumber(value)
    .div(Math.pow(10, decimals))
    .decimalPlaces(0)
    .toNumber()
    .toLocaleString()} DOT`;
}
