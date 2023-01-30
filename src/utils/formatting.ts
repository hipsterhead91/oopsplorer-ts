import IChain from "../interfaces/IChain";
import IValidator from "../interfaces/IValidator";
import ICosmostationData from "../interfaces/ICosmostationData";

// ПОЛУЧИТЬ ПУТЬ
export function getPath(chain: IChain): string {
  const network = (chain.isMain) ? 'mainnet' : 'testnet';
  return chain.path + '-' + network;
}

// ОБРЕЗАТЬ КОПЕЙКИ
export function cutDecimals(tokens: string, decimals: number): string {
  return (tokens.length > decimals)
    ? tokens.slice(0, -decimals)
    : '0'
}

// ОБРЕЗАТЬ ЛИШНИЕ СИМВОЛЫ
export function cutExtra(tokens: string, extraSymbols: number): string {
  return tokens.slice(0, -extraSymbols);
}

// ОТФОРМАТИРОВАТЬ ЦЕНУ
export function tweakPrice(price: number): string {
  if (price < 0.00000001) return price.toFixed(10)
  if (price < 0.0000001) return price.toFixed(9)
  if (price < 0.000001) return price.toFixed(8)
  if (price < 0.00001) return price.toFixed(7)
  if (price < 0.0001) return price.toFixed(6)
  if (price < 0.001) return price.toFixed(5)
  if (price < 0.01) return price.toFixed(4)
  if (price < 0.1) return price.toFixed(3)
  else return price.toFixed(2)
}

// УПОРЯДОЧИТЬ ВАЛИДАТОРОВ ПО СТЕЙКУ
export function sortByTokens(validators: Array<IValidator>): Array<IValidator> {
  validators.sort((x, y) => Number(x.tokens) - Number(y.tokens));
  validators.reverse();
  return validators;
}

// ДОБАВИТЬ РЕЙТИНГ
// Примечание: принимаемый массив валидаторов уже должен быть упорядочен по стейку! Хотя по идее, можно просто в 
// самое начало вставить sortByTokens() и не париться - попробую позже.
export function addRanks(validators: Array<IValidator>): Array<IValidator> {
  validators.forEach(validator => validator.rank = validators.indexOf(validator) + 1);
  return validators;
}

// ДОБАВИТЬ АВАТАРЫ
// Примечание: аватар является ссылкой, и сейчас проходит простейшую валидацию (ссылка должна содержать валопер
// и иметь формат PNG). В будущем валидацию можно прописать глубже - вероятно, существуют и готовые решения.
export function addAvatars(validators: Array<IValidator>, avatarsData: Array<ICosmostationData>): Array<IValidator> {
  validators.forEach(validator => {
    const valoper = validator.operator_address;
    const match = avatarsData.find(object => {
      return (object.download_url.includes(valoper)) && (object.download_url.includes('.png'))
    })
    match ? validator.avatar = match.download_url : validator.avatar = '';
  });
  return validators;
}

// ДОБАВИТЬ ВЕС ГОЛОСА
// Примечание: принимает массив валидаторов и сумму всех застейканных монет в сети; возвращает массив валидаторов, 
// но с новым свойством voting_power () у каждого объекта.
export function addVotingPower(validators: Array<IValidator>, bondedTotal: string): Array<IValidator> {
  validators.forEach(validator => {
    const votingPower = (Number(validator.tokens) * 100 / Number(bondedTotal)).toFixed(2); // метод toFixed() возвращает строку
    validator.voting_power = votingPower;
  });
  return validators;
}

// ОТФИЛЬТРОВАТЬ АКТИВНЫХ
// Примечание: принимает массив валидаторов, возвращает его же, но отфильтрованным. На случай, если ничего не найдётся и 
// массив вернётся пустым, указал в дополнительно [] в качестве возвращаемого значения. По идее логично.
export function filterActive(validators: Array<IValidator>): Array<IValidator> | [] {
  const active = validators.filter(validator => validator.status === 'BOND_STATUS_BONDED');
  return active;
}

// ОТФИЛЬТРОВАТЬ НЕАКТИВНЫХ
// Примечание: принимает массив валидаторов, возвращает его же, но отфильтрованным. На случай, если ничего не найдётся и 
// массив вернётся пустым, указал в дополнительно [] в качестве возвращаемого значения. По идее логично.
export function filterInactive(validators: Array<IValidator>): Array<IValidator> | [] {
  const inactive = validators.filter(validator => validator.status !== 'BOND_STATUS_BONDED');
  return inactive;
}

// ОТФОРМАТИРОВАТЬ КОМИССИЮ
export function tweakCommission(commission: string): string {
  return (Number(commission) * 100).toFixed(2)
}


// ОТФОРМАТИРОВАТЬ ТИП ПРОПОЗАЛА
export function tweakProposalType(type: string): string {
  const arr = type.split('.');
  const i = arr.length - 1;
  type = arr[i];
  type = type.replace(/([a-z])([A-Z])/g, '$1 $2');
  return type;
}

// ОТФОРМАТИРОВАТЬ СТАТУС ПРОПОЗАЛА
export function tweakProposalStatus(status: string): string {
  if (status === 'PROPOSAL_STATUS_DEPOSIT_PERIOD') { return 'Deposit Period' }
  else if (status === 'PROPOSAL_STATUS_VOTING_PERIOD') { return 'Voting Period' }
  else if (status === 'PROPOSAL_STATUS_PASSED') { return 'Passed' }
  else if (status === 'PROPOSAL_STATUS_REJECTED') { return 'Rejected' }
  else if (status === 'PROPOSAL_STATUS_FAILED') { return 'Failed' }
  else return 'Unspecified';
}

// ОТФОРМАТИРОВАТЬ ДАТУ ПРОПОЗАЛА
export function tweakProposalPeriod(period: string): string {
  const date = period.split('T')[0];
  const time = period.split('T')[1].split('.')[0];
  return date + ', ' + time;
}