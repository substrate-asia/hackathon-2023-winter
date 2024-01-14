let currency: string = '';

const setCurrency = (newCurrency): void => {
  currency = newCurrency;
};

const getCurrency = (): string => {
  return currency;
};

const useEnvironment = {
  setCurrency,
  getCurrency
};

export default useEnvironment;
