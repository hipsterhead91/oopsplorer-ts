import IChain from "../../interfaces/IChain";

const evmosTestnet: IChain  = {
  name: "Evmos",
  path: "evmos",
  cosmostation: "evmos",
  coinGecko: "",
  chain: "evmos_9001-4",
  isMain: false,
  denom: "atevmos",
  symbol: "TEVMOS",
  decimals: 18,
  api: [
    "https://rest.bd.evmos.dev:1317",
    "https://evmos-testnet-lcd.qubelabs.io",
    "https://api-t.evmos.nodestake.top",
  ],
  description: "A Cosmos SDK-based IBC & Ethereum Virtual Machine-compatible blockchain.",
  logo: "/logos/evmos.png"
}

export default evmosTestnet;

