import IValidator from "./IValidator";
import IChain from "./IChain";

interface ITableRowProps {
  validator: IValidator,
  currentChain: IChain
}

export default ITableRowProps;