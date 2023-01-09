import IChain from "./IChain";

interface IHeaderProps {
  setCurrentChain: React.Dispatch<React.SetStateAction<IChain | null>>
}

export default IHeaderProps;