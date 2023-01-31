// Пакеты
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router";

// Компоненты
import Layout from "./Layout";
import Homepage from "./Homepage";
import NotFound from "./NotFound";
import Chain from "./Chain";
import Validators from "./Validators";
import Validator from "./Validator";
import Proposals from "./Proposals";

// Контексты
import AppComponentContext from "../contexts/AppComponentContext";

// Типизация
import IChain from "../interfaces/IChain";
import ICoin from "../interfaces/ICoin";

// Мой код
import CoinGeckoApi from "../api/CoinGeckoApi";
import { chains } from "../chains/chains";
import { getPath } from "../utils/formatting";



function App() {

  const [coins, setCoins] = useState<ICoin | null>(null);
  const [currentChain, setCurrentChain] = useState<IChain | null>(null);
  const coinGecko = new CoinGeckoApi('https://api.coingecko.com/api/v3');

  // ПОЛУЧАЕМ ИНФОРМАЦИЮ О МОНЕТАХ
  const setCoinsData = () => {
    coinGecko.getCoins()
      .then(result => setCoins(result))
      .catch(() => setCoins(null))
  };
  
  // ОБНОВЛЯЕМ ДАННЫЕ ПО ТАЙМЕРУ
  useEffect(() => {
    setCoinsData();
    let coinsTimer = setInterval(setCoinsData, 60000);
    return () => clearTimeout(coinsTimer);
  }, [])

  return (
    <AppComponentContext.Provider value={{ coins, currentChain, setCurrentChain }}>
      <div className="app">
        <Routes>
          <Route path="/" element={<Layout />}>

            <Route index element={<Homepage />} />
            <Route path="*" element={<NotFound />} />

            {chains.map(chain => {
              return <Route key={chain.chain} path={getPath(chain)} element={<Chain chain={chain} />}>
                <Route path="validators" element={<Validators />}>
                  <Route path=":valoper" element={<Validator />} />
                </Route>
                <Route path="proposals" element={<Proposals />} />
              </Route>
            })}

          </Route>
        </Routes>
      </div>
    </AppComponentContext.Provider>
  );
}

export default App;