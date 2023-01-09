import IChain from "./IChain";

interface ILayoutProps {
  setCurrentChain: React.Dispatch<React.SetStateAction<IChain | null>>
}

export default ILayoutProps;