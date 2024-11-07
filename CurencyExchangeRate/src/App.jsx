import { useEffect, useState } from 'react';
import './App.css';
import { currencyCountryCodeMap } from './assets/CountryCode';

function App() {
  const [input, setInput] = useState(1);
  const [currFrom, setCurrFrom] = useState("usd");
  const [currTo, setCurrTo] = useState("inr");
  const [currencyRate, setCurrencyRate] = useState(null);
  const [result, setResult] = useState(null);

  const getCurrency = async () => {
    try {
      const response = await fetch(`https://latest.currency-api.pages.dev/v1/currencies/${currFrom}.json`);
      if (!response.ok) {
        console.error("Network response was not ok!");
        return;
      }
      const data = await response.json();
      setCurrencyRate(data[currFrom][currTo]);
      console.log(data[currFrom][currTo])
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    getCurrency();
  }, [currFrom, currTo]);

  useEffect(() => {
    if (currencyRate !== null) {
      setResult(input * currencyRate);
    }
  }, [input, currencyRate]);

  const handleInputChange = (e) => setInput(e.target.value);
  const handleFromCurrencyChange = (e) => setCurrFrom(e.target.value.toLowerCase());
  const handleToCurrencyChange = (e) => setCurrTo(e.target.value.toLowerCase());

  return (
    <div className="container">
      <h1>Currency Converter</h1>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="amount">
          <p>Enter Amount</p>
          <input
            type="number"
            min={1}
            value={input}
            onChange={handleInputChange}
          />
        </div>

        <div className="dropdown">
          <div className="from">
            <p>From</p>
            <div className="select-container">
              <img src={`https://flagsapi.com/${currencyCountryCodeMap[currFrom.toUpperCase()]}/flat/64.png`} alt={`${currFrom}`} />
              <select value={currFrom.toUpperCase()} onChange={handleFromCurrencyChange}>
                {Object.keys(currencyCountryCodeMap).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="to">
            <p>To</p>
            <div className="select-container">
              <img src={`https://flagsapi.com/${currencyCountryCodeMap[currTo.toUpperCase()]}/flat/64.png`} alt={`${currTo}`} />
              <select value={currTo.toUpperCase()} onChange={handleToCurrencyChange}>
                {Object.keys(currencyCountryCodeMap).map((code) => (
                  <option key={code} value={code}>
                    {code}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="msg">
          {currencyRate !== null  && result != null
            ? `${input} ${currFrom.toUpperCase()} = ${result.toFixed(2)} ${currTo.toUpperCase()}`
            : "Loading exchange rate..."}
        </div>

      </form>
    </div>
  );
}

export default App;
