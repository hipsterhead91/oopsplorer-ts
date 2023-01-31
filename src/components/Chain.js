// Пакеты
import { useState, useEffect, useContext } from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";

// Контексты
import AppComponentContext from "../contexts/AppComponentContext";
import ChainComponentContext from "../contexts/ChainComponentContext";

// Мой код
import CosmosRestApi from "../api/CosmosRestApi";
import { cutDecimals, cutExtra, tweakPrice, filterActive, getPath } from "../utils/formatting";



function Chain(props) {

  const coins = useContext(AppComponentContext).coins;
  const currentChain = props.chain;
  const setCurrentChain = useContext(AppComponentContext).setCurrentChain;
  const chainApi = new CosmosRestApi(currentChain.api[0]);
  const [activeSetLength, setActiveSetLength] = useState(null);
  const [wholeSetLength, setWholeSetLength] = useState(null);
  const [totalBonded, setTotalBonded] = useState(null); // получается один раз для расчёта voting power валидаторов и больше не меняется
  const [totalBondedUpdating, setTotalBondedUpdating] = useState(null); // то же, что и totalBonded, но обновляется по таймеру
  const [unbondingTime, setUnbondingTime] = useState(null);
  const [activeProposals, setActiveProposals] = useState(null);
  const [blockHeight, setBlockHeight] = useState(null);
  const [inflation, setInflation] = useState(null);
  const [communityPool, setCommunityPool] = useState(null);
  const [price, setPrice] = useState(null);
  const navigate = useNavigate();

  // ОБНОВЛЯЕМ ТЕКУЩУЮ СЕТЬ 
  // Примечание: нужно для корректного отображения сети в выпадающем меню хедера в том случае, когда переход
  // на страницу сети осуществлён не "пошагово" с главной, а вводом полного пути в адресную строку браузера.
  useEffect(() => {
    setCurrentChain(currentChain);
  }, [])
  
  // РЕДИРЕКТ НА ВАЛИДАТОРОВ
  // Примечание: при переходе по адресу типа site/chain делает редирект на site/chain/validators, поскольку 
  // страница только с компонентом chain выглядит полупустой.
  useEffect(() => {
    const path = getPath(currentChain);
    const currentUrl = window.location.href;
    if (currentUrl.endsWith(path) || currentUrl.endsWith(`${path}/`)) {
      navigate(`/${path}/validators`);
    }
  }, [currentChain])

  // ПОЛУЧАЕМ КОЛИЧЕСТВО ВАЛИДАТОРОВ
  useEffect(() => {
    chainApi.getAllValidators()
      .then(result => {
        const active = filterActive(result).length;
        const total = result.length;
        setActiveSetLength(active);
        setWholeSetLength(total);
      })
      .catch(() => {
        setActiveSetLength(null);
        setWholeSetLength(null);
      })
  }, [currentChain])

  // ПОЛУЧАЕМ СУММУ ВСЕХ ЗАСТЕЙКАННЫХ МОНЕТ (единоразово, для расчёта voting power валидаторов)
  useEffect(() => {
    chainApi.getBondedTokens()
      .then(result => setTotalBonded(result))
      .catch(() => setTotalBonded(null))
  }, [currentChain])

  // ПОЛУЧАЕМ СУММУ ВСЕХ ЗАСТЕЙКАННЫХ МОНЕТ (для обновления по таймеру)
  const setCurrentTotalBonded = () => {
    chainApi.getBondedTokens()
      .then(result => setTotalBondedUpdating(result))
      .catch(() => setTotalBondedUpdating(null))
  }

  // ПОЛУЧАЕМ ВРЕМЯ АНБОНДА
  useEffect(() => {
    chainApi.getStakingParams()
      .then(result => {
        const seconds = result.unbonding_time.slice(0, -1);
        const minutes = seconds / 60;
        const hours = minutes / 60;
        const days = hours / 24;
        setUnbondingTime(days);
      })
      .catch(() => setUnbondingTime(null))
  }, [currentChain])

  // ПОЛУЧАЕМ ВСЕ ГОЛОСОВАНИЯ
  useEffect(() => {
    chainApi.getProposals()
      .then(result => {
        const active = result.proposals.filter(p => p.status === 'PROPOSAL_STATUS_VOTING_PERIOD');
        setActiveProposals(active);
      })
      .catch(() => setActiveProposals(null))
  }, [currentChain])

  // ПОЛУЧАЕМ ПОСЛЕДНИЙ БЛОК
  const setLatestBlock = () => {
    chainApi.getLatestBlock()
      .then(result => setBlockHeight(result.block.last_commit.height))
      .catch(() => setBlockHeight(null))
  };

  // ПОЛУЧАЕМ ИНФЛЯЦИЮ
  useEffect(() => {
    chainApi.getInflation()
      .then(result => setInflation(result.inflation))
      .catch(() => setInflation(null))
  }, [currentChain])

  // ПОЛУЧАЕМ ПУЛ СООБЩЕСТВА
  useEffect(() => {
    chainApi.getCommunityPool()
      .then(result => {
        const pool = result.pool.find(el => el.denom === currentChain.denom);
        const amount = pool.amount;
        const cutted = cutExtra(amount, 19); // точка + 18 символов
        setCommunityPool(cutted);
      })
      .catch(() => setCommunityPool(null))
  }, [currentChain])

  // ПОЛУЧАЕМ ЦЕНУ ТОКЕНА
  useEffect(() => {
    if (coins && currentChain.coinGecko) {
      const currentCoin = coins.find(coin => coin.id === currentChain.coinGecko);
      setPrice(currentCoin.current_price);
    } else {
      setPrice(null);
    }
  }, [coins, currentChain])

  // ОБНОВЛЯЕМ ДАННЫЕ ПО ТАЙМЕРУ
  // Примечание: return в конце хука необходим для того, чтобы выполнить некий код при размонтировании компонента.
  // В данном случае он сбрасывает мои таймеры - без этого при переключении между разными сетями дисплей с данными
  // начинали лагать, показывая попеременно информацию то из одной, то из другой сети. Как я понял, это происходило
  // потому, что если таймер не сбросить, то он сохраняет используемое им лексическое окружение, и простое переключение
  // между сетями/компонентами тут не поможет - оттуда и глюки. Странная тема, но интересная - буду знать.
  useEffect(() => {
    setLatestBlock();
    setCurrentTotalBonded();
    let latestBlockTimer = setInterval(setLatestBlock, 5000); // 5 сек.
    let currentTotalBondedTimer = setInterval(setCurrentTotalBonded, 20000); // 20 сек.
    return () => {
      clearTimeout(latestBlockTimer);
      clearTimeout(currentTotalBondedTimer);
    };
  }, [currentChain])

  // РЕНДЕР ОСНОВНОЙ ИНФОРМАЦИИ О СЕТИ
  const heading = currentChain.isMain ? currentChain.name : `${currentChain.name} Testnet`;
  const subheading = `${currentChain.isMain ? 'mainnet' : 'testnet'} · ${currentChain.chain}`;
  const description = currentChain.description;
  const errorEl = <span className="chain__plate-error"><span>Oops!</span><br />something<br />went wrong</span>;

  // РЕНДЕР ЗАСТЕЙКАННЫХ ТОКЕНОВ
  let totalBondedEl = errorEl;
  if (totalBondedUpdating) {
    const value = Number(cutDecimals(totalBondedUpdating, currentChain.decimals)).toLocaleString('en');
    totalBondedEl = <span className="chain__plate-tokens">{value}<span>{currentChain.symbol}</span></span>;
  }

  // РЕНДЕР ПУЛА СООБЩЕСТВА
  let communityPoolEl = errorEl;
  if (communityPool) {
    const value = Number(cutDecimals(communityPool, currentChain.decimals)).toLocaleString('en');
    communityPoolEl = <span className="chain__plate-tokens">{value}<span>{currentChain.symbol}</span></span>;
  }

  // РЕНДЕР ГОЛОСОВАНИЙ
  let proposalsEl = errorEl;
  if (activeProposals && activeProposals.length !== 0) {
    proposalsEl = <Link to="proposals" className="chain__plate-link">{activeProposals.length} active</Link>;
  }
  else if (activeProposals && activeProposals.length === 0) {
    proposalsEl = <span className="chain__plate-data">none</span>;
  }

  // РЕНДЕР ЛОГОТИПА
  const logo = currentChain.logo;

  // РЕНДЕР ВЫСОТЫ БЛОКА
  let blockHeightEl = errorEl;
  if (blockHeight) {
    const value = Number(blockHeight).toLocaleString('en');
    blockHeightEl = <span className="chain__plate-data">{value}</span>;
  }

  // РЕНДЕР ВАЛИДАТОРОВ
  let validatorsEl = errorEl;
  if (activeSetLength && wholeSetLength) {
    validatorsEl = <Link to="validators" className="chain__plate-link">{activeSetLength}/{wholeSetLength}</Link>;
  }

  // РЕНДЕР ИНФЛЯЦИИ
  let inflationEl = errorEl;
  if (inflation) {
    const value = (inflation * 100).toFixed(2) + '%';
    inflationEl = <span className="chain__plate-data">{value}</span>;
  }

  // РЕНДЕР АНБОНДИНГА
  let unbondingEl = errorEl;
  if (unbondingTime) {
    const value = `${unbondingTime} days`;
    unbondingEl = <span className="chain__plate-data">{value}</span>;
  }

  // РЕНДЕР ЦЕНЫ
  let priceEl = errorEl;
  if (price) {
    const value = '$' + tweakPrice(price);
    priceEl = <a href={`https://www.coingecko.com/en/coins/${currentChain.coinGecko}`} target="_blank" className="chain__plate-link">{value}</a>;
  }

  return (
    <ChainComponentContext.Provider value={{ chainApi, totalBonded, activeProposals }}>
      <section className="chain">
        <div className="chain__plates">

          {/* ОПИСАНИЕ */}
          <div id="description-plate" className="chain__plate">
            <h1 className="chain__heading">{heading}</h1>
            <span className="chain__subheading">{subheading}</span>
            <p className="chain__description">{description}</p>
          </div>

          {/* ЗАСТЕЙКАНО */}
          <div id="bonded-plate" className="chain__plate">
            <span className="chain__plate-heading">Tokens Bonded:</span>
            {totalBondedEl}
          </div>

          {/* ПУЛ СООБЩЕСТВА */}
          <div id="community-plate" className="chain__plate">
            <span className="chain__plate-heading">Community Pool:</span>
            {communityPoolEl}
          </div>

          {/* ГОЛОСОВАНИЯ */}
          <div id="proposals-plate" className="chain__plate">
            <span className="chain__plate-heading">Active Proposals:</span>
            {proposalsEl}
          </div>

          {/* ЛОГО */}
          <div id="logo-plate" className="chain__plate">
            <div style={{ backgroundImage: `url(${logo})` }} className="chain__plate-logo" />
          </div>

          {/* ВЫСОТА БЛОКА */}
          <div id="block-plate" className="chain__plate">
            <span className="chain__plate-heading">Block Height:</span>
            {blockHeightEl}
          </div>

          {/* ВАЛИДАТОРЫ */}
          <div id="validators-plate" className="chain__plate">
            <span className="chain__plate-heading">Validators:</span>
            {validatorsEl}
          </div>

          {/* ИНФЛЯЦИЯ */}
          <div id="inflation-plate" className="chain__plate">
            <span className="chain__plate-heading">Inflation:</span>
            {inflationEl}
          </div>

          {/* СРОКИ АНБОНДА */}
          <div id="unbonding-plate" className="chain__plate">
            <span className="chain__plate-heading">Unbonding:</span>
            {unbondingEl}
          </div>

          {/* ЦЕНА */}
          <div id="price-plate" className="chain__plate">
            <span className="chain__plate-heading">Price by CoinGecko:</span>
            {priceEl}
          </div>

        </div>

        <Outlet />

      </section>
    </ChainComponentContext.Provider>
  )
}

export default Chain;