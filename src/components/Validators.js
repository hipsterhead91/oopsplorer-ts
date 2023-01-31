// Пакеты
import { useState, useEffect, useRef, useContext } from "react";
import { Outlet } from "react-router";

// Компоненты
import TableRow from "./TableRow";
import TableHeader from "./TableHeader";

// Контексты
import ChainComponentContext from "../contexts/ChainComponentContext";
import ValidatorsComponentContext from "../contexts/ValidatorsComponentContext";
import AppComponentContext from "../contexts/AppComponentContext";

// Мой код
import getAvatarsData from "../api/getAvatarsData";
import { sortByTokens, addRanks, addVotingPower, addAvatars, filterActive, filterInactive } from "../utils/formatting";



function Validators() {

  const currentChain = useContext(AppComponentContext).currentChain;
  const chainApi = useContext(ChainComponentContext).chainApi;
  const totalBonded = useContext(ChainComponentContext).totalBonded;
  const [isCurrentSetActive, setIsCurrentSetActive] = useState(true);
  const [avatarsData, setAvatarsData] = useState([]);
  const [allValidators, setAllValidators] = useState([]);
  const [activeValidators, setActiveValidators] = useState([]);
  const [inactiveValidators, setInactiveValidators] = useState([]);
  const [shownValidators, setShownValidators] = useState([]);
  const [shownValidatorsBackup, setShownValidatorsBackup] = useState([]); // нужен для отката после фильтраций
  const filterInput = useRef();

  // ПОЛУЧАЕМ АВАТАРЫ В МАССИВЕ ОБЪЕКТОВ
  useEffect(() => {
    getAvatarsData(currentChain)
      .then(result => {setAvatarsData(result)})
  }, [currentChain])

  // ПОЛУЧАЕМ ВАЛИДАТОРОВ, СОРТИРУЕМ И ДОБАВЛЯЕМ ПОЛЯ
  useEffect(() => {
    chainApi.getAllValidators()
      .then(async result => {
        let active = filterActive(result);
        let inactive = filterInactive(result);
        active = sortByTokens(active);
        inactive = sortByTokens(inactive);
        let all = active.concat(inactive);
        all = addRanks(all);
        all = addVotingPower(all, totalBonded);
        all = addAvatars(all, avatarsData);
        setAllValidators(all);
        active = filterActive(all);
        inactive = filterInactive(all);
        setActiveValidators(active);
        setInactiveValidators(inactive);
      })
  }, [currentChain, totalBonded, avatarsData]);

  // РЕНДЕРИМ АКТИВНЫХ ВАЛИДАТОРОВ КОГДА ОНИ ПОЛУЧЕНЫ
  useEffect(() => {
    setShownValidators(activeValidators);
    setShownValidatorsBackup(activeValidators);
  }, [activeValidators])

  // СБРАСЫВАЕМ НАСТРОЙКИ ПРИ ПЕРЕКЛЮЧЕНИИ СЕТИ
  useEffect(() => {
    setIsCurrentSetActive(true);
  }, [currentChain])

  // СБРАСЫВАЕМ ИНПУТ ФИЛЬТРА ВАЛИДАТОРОВ
  useEffect(() => {
    filterInput.current.value = '';
  }, [currentChain, isCurrentSetActive])

  // ПЕРЕКЛЮЧАЕМСЯ НА АКТИВНЫЙ СЕТ
  const switchToActive = () => {
    setShownValidators(activeValidators);
    setShownValidatorsBackup(activeValidators);
    setIsCurrentSetActive(true);
  }

  // ПЕРЕКЛЮЧАЕМСЯ НА НЕАКТИВНЫЙ СЕТ
  const switchToInactive = () => {
    setShownValidators(inactiveValidators);
    setShownValidatorsBackup(inactiveValidators);
    setIsCurrentSetActive(false);
  }

  // СКРОЛЛИМ СТРАНИЦУ ВВЕРХ
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  }

  // СКРОЛЛИМ СТРАНИЦУ ВНИЗ
  const scrollToBottom = () => {
    window.scrollTo({
      top: 99999999,
      behavior: "smooth"
    });
  }

  // ФИЛЬТРУЕМ ВАЛИДАТОРОВ ПО МОНИКЕРУ
  const filterByMoniker = (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = shownValidatorsBackup.filter(validator => validator.description.moniker.toLowerCase().includes(value));
    setShownValidators(filtered);
  }

  // СБРАСЫВАЕМ ФИЛЬТР
  const clearFilter = () => {
    setShownValidators(shownValidatorsBackup);
    filterInput.current.value = '';
  }

  const activeButtonStyle = isCurrentSetActive ? "validators__switcher-button validators__switcher-button_selected" : "validators__switcher-button"
  const inactiveButtonStyle = isCurrentSetActive ? "validators__switcher-button" : "validators__switcher-button validators__switcher-button_selected"

  return (
    <ValidatorsComponentContext.Provider value={{ allValidators }}>
      <div className="validators">
        <Outlet />
        <div className="validators__navigation">
          <div className="validators__switcher">
            <button onClick={switchToActive} className={activeButtonStyle}>Active</button>
            <button onClick={switchToInactive} className={inactiveButtonStyle}>Inactive</button>
          </div>
          <div className="validators__find">
            <input ref={filterInput} onChange={event => filterByMoniker(event)} className="validators__find-input" type="text" placeholder="Search by moniker"></input>
            <button onClick={clearFilter} className="validators__find-button">Clear</button>
          </div>
        </div>
        <div className="validators__table">
          <TableHeader shownValidators={shownValidators} setShownValidators={setShownValidators} currentChain={currentChain} isCurrentSetActive={isCurrentSetActive} />
          <div className="validators__rows">
            {shownValidators.map(validator => {
              return <TableRow key={validator.operator_address} validator={validator} currentChain={currentChain} />
            })}
          </div>
        </div>

        <div className="validators__scroll-buttons">
          <div onClick={scrollToTop} className="validators__scroll-button">
            <div className="validators__top-arrow"></div>
          </div>
          <div onClick={scrollToBottom} className="validators__scroll-button">
            <div className="validators__bottom-arrow"></div>
          </div>
        </div>
      </div>
    </ValidatorsComponentContext.Provider>
  )
}

export default Validators