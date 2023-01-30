import IChain from "./IChain";

interface IChainProps {
  chain: IChain,
  setCurrentChain: React.Dispatch<React.SetStateAction<IChain | null>>
}

export default IChainProps;