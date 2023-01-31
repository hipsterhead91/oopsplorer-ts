// Пакеты
import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

// Контексты
import AppComponentContext from "../contexts/AppComponentContext";
import ValidatorsComponentContext from "../contexts/ValidatorsComponentContext";

// Типизация
import IValidator from "../interfaces/IValidator";

// Мой код
import { cutDecimals, tweakCommission, getPath } from "../utils/formatting";



function Validator() {

  const currentValoper = useParams()["valoper"]; // из ссылки в браузерной строке получаем адрес текущего валидатора
  const currentChain = useContext(AppComponentContext).currentChain;
  const allValidators = useContext(ValidatorsComponentContext).allValidators;
  const [validator, setValidator] = useState<IValidator | null>();
  const network = currentChain.isMain ? 'mainnet' : 'testnet';
  const chainPath = currentChain.path + '-' + network;
  const navigate = useNavigate();

  // ПОЛУЧАЕМ ОБЪЕКТ ТЕКУЩЕГО ВАЛИДАТОРА
  useEffect(() => {
    const validator = allValidators.find((val: { operator_address: string }) => val.operator_address === currentValoper);
    setValidator(validator);
  }, [currentChain, allValidators, currentValoper])

  let [rank, moniker, valoper, activity, activityStyle, bond, bondStyle, jail, jailStyle, highCommission, highCommissionStyle, stake, symbol, votingPower, commission, securityContact, details] = '';
  // Примечание: как я понял, для аватара нужно указать undefined как возможный тип, т.к. далее происходит обращение к файловой
  // структуре проекта через process.env - в ней ищется нужный файл, и если он не найдётся, то это undefined. Сугубо моя догадка.
  let avatar: string | undefined;
  let website = <p />;

  if (!validator) {
    avatar = `${process.env["PUBLIC_URL"]}/images/no-avatar.png`;
    rank = '#000';
    moniker = "Validator Doesn't Exist";
    valoper = 'no such validator operator address';
    activity = '';
    activityStyle = 'validators__activity validators__activity_inactive';
    stake = '—';
    votingPower = '—';
    commission = '—';
    website = <p className="validator__data-text">—</p>;
    securityContact = '—';
    details = '—';
  }

  else if (validator && currentChain) {

    // РЕНДЕР АВАТАРА
    avatar = (validator.avatar === '') ? `${process.env["PUBLIC_URL"]}/images/no-avatar.png` : validator.avatar;

    // РЕНДЕР РЕЙТИНГА
    rank = '#' + validator.rank?.toString().padStart(3, '0');

    // РЕНДЕР МОНИКЕРА
    moniker = validator.description.moniker;

    // РЕНДЕР ВАЛОПЕРА
    valoper = validator.operator_address;

    // РЕНДЕР АКТИВНОСТИ
    activity = (validator.status === 'BOND_STATUS_BONDED') ? 'Active' : 'Inactive';

    // РЕНДЕР БОНДА
    activityStyle = (validator.status === 'BOND_STATUS_BONDED') ? 'validator__activity' : 'validator__activity validator__activity_inactive';
    if (validator.status === 'BOND_STATUS_BONDED') { bond = 'Bonded'; bondStyle = 'validator__bond' }
    if (validator.status === 'BOND_STATUS_UNBONDED') { bond = 'Unbonded'; bondStyle = 'validator__bond validator__bond_unbonded' }
    if (validator.status === 'BOND_STATUS_UNBONDING') { bond = 'Unbonding'; bondStyle = 'validator__bond validator__bond_unbonding' }

    // РЕНДЕР ТЮРЬМЫ
    jail = (validator.jailed) ? 'Jailed' : '';
    jailStyle = (validator.jailed) ? 'validator__jail' : 'validator__jail_hidden';

    // РЕНДЕР ВЫСОКОЙ КОМИССИИ
    highCommission = (Number(validator.commission.commission_rates.rate) > 0.1) ? 'High Commission' : '';
    highCommissionStyle = (Number(validator.commission.commission_rates.rate) > 0.1) ? 'validator__warning' : 'validator__warning_hidden';

    // РЕНДЕР СТЕЙКА
    stake = Number(cutDecimals(validator.tokens, currentChain.decimals)).toLocaleString('en');
    symbol = currentChain.symbol;

    // РЕНДЕР ВЕСА ГОЛОСА
    votingPower = validator.voting_power + '%';

    // РЕНДЕР КОМИССИИ
    commission = tweakCommission(validator.commission.commission_rates.rate) + '%';

    // РЕНДЕР ВЕБСАЙТА
    website = (validator.description.website === '')
      ? <p className="validator__data-text">—</p>
      : <a className="validator__data-link" href={validator.description.website} target="_blank">{validator.description.website}</a>

    // РЕНДЕР БЕЗОПАСНОГО КОНТАКТА
    securityContact = (validator.description.security_contact === '') ? '—' : validator.description.security_contact;

    // РЕНДЕР ОПИСАНИЯ
    details = (validator.description.details === '') ? '—' : validator.description.details;
  }

  // ЗАКРЫВАЕМ ОКНО ПО КЛИКУ НА ОВЕРЛЕЙ
  const closeWindow = () => {
    if (currentChain) {
      const path = getPath(currentChain);
      navigate(`/${path}/validators`);
    }
  }

  return (
    <div className="validator">
      <div className="validator__overlay" onClick={closeWindow}></div>
      <div className="validator__container">
        <Link to={`/${chainPath}/validators`} className="validator__close-button">&#10006;</Link>
        <div className="validator__card">
          <div style={{ backgroundImage: `url(${avatar})` }} className="validator__avatar" />
          <div className="validator__header">
            <h1 className="validator__moniker">{moniker}</h1>
            <span className="validator__valoper">{valoper}</span>
            <div className="validator__statuses">
              <span className={activityStyle}>{activity}</span>
              <span className={bondStyle}>{bond}</span>
              <span className={jailStyle}>{jail}</span>
              <span className={highCommissionStyle}>{highCommission}</span>
            </div>
          </div>
          <span className="validator__rank">{rank}</span>
          <div className="validator__data">
            <p className="validator__data-heading">Tokens Bonded:</p>
            <span className="validator__data-text">{stake}<span className="validator__denom">{symbol}</span></span>
            <p className="validator__data-heading">Voting Power:</p>
            <span className="validator__data-text">{votingPower}</span>
            <p className="validator__data-heading">Commission:</p>
            <span className="validator__data-text">{commission}</span>
            <p className="validator__data-heading">Website:</p>
            {website}
            <p className="validator__data-heading">Security Contact:</p>
            <span className="validator__data-text">{securityContact}</span>
            <p className="validator__data-heading">Details:</p>
            <span className="validator__data-text">{details}</span>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Validator;