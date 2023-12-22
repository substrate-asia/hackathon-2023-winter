function formatMoney(number: any) {
  const [integerPart, decimalPart] = Number(number).toFixed(2).toString().split(".");

  // 格式化整数部分
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );

  // 如果有小数部分，将整数和小数部分合并
  if (decimalPart) {
    return `${formattedIntegerPart}.${decimalPart}`;
  } else {
    return formattedIntegerPart;
  }
}
export default formatMoney;
