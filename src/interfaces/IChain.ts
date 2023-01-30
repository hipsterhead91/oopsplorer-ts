interface IChain {
  "name": string,
  "path": string,
  "cosmostation": string,
  "coinGecko": string,
  "chain": string,
  "isMain": boolean,
  "denom": string,
  "symbol": string,
  "decimals": number,
  "api": Array<string>,
  "description": string,
  "logo": string
}

export default IChain;