import IChain from "./IChain";
import IValidator from "./IValidator";

interface ITableHeaderProps {
  shownValidators: IValidator[],
  setShownValidators: React.Dispatch<React.SetStateAction<IValidator[] | null>>,
  chain: IChain,
  isCurrentSetActive: boolean
}

export default ITableHeaderProps;