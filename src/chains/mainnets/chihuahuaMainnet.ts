import IChain from "../../interfaces/IChain";

const chihuahuaMainnet: IChain = {
  name: "Chihuahua",
  path: "chihuahua",
  cosmostation: "chihuahua",
  coinGecko: "chihuahua-token",
  chain: "chihuahua-1",
  isMain: true,
  denom: "uhuahua",
  symbol: "HUAHUA",
  decimals: 6,
  api: [
    "https://chihuahua-api.polkachu.com",
    "https://api.chihuahua.wtf",
    "https://chihuahua-api.mercury-nodes.net"
  ],
  description: "The first meme coin on Cosmos ecosystem.",
  logo: "/logos/chihuahua.png"
}

export default chihuahuaMainnet;