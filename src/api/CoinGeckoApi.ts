import { coinGeckoIds } from "../chains/chains";

class CoinGeckoApi {

  _baseUrl: string;

  constructor(baseUrl: string) {
    this._baseUrl = baseUrl;
  }

  // ИНФОРМАЦИЯ ПО ВСЕМ МОНЕТАМ
  async getCoins() {
    const response = await fetch(`${this._baseUrl}/coins/markets?vs_currency=usd&ids=${coinGeckoIds}&order=market_cap_desc&per_page=100&page=1&sparkline=false`);
    if (response.ok) {
      const result = await response.json();
      return result;
    } else {
      return Promise.reject(`Something went wrong: ${response.status}`)
    }
  }

}

export default CoinGeckoApi;