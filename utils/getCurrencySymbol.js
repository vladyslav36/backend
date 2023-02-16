const getCurrencySymbol=(currencyShop)=> {
  switch (currencyShop) {
    case "UAH":
      return "₴"
      break
    case "EUR":
      return "€"
      break
    case "USD":
      return "$"
      break

    default:
      return "₴"
  }
}
module.exports = getCurrencySymbol
