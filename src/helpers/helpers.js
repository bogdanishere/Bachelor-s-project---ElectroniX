export function formatCurrency(value, currency = "RON") {
  return new Intl.NumberFormat("RO", {
    style: "currency",
    currency: currency,
  }).format(value);
}

export async function convertUSDtoRON(amount, fromCurrency = "USD") {
  //   const fromCurrency = "USD";
  const toCurrency = "RON";

  try {
    const response = await fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${fromCurrency}&to=${toCurrency}`
    );

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    const data = await response.json();
    const convertedAmount = data.rates[toCurrency];

    return convertedAmount;
  } catch (error) {
    console.error("There was an error converting the currency:", error);
    return null; // sau poți returna
  }
}
