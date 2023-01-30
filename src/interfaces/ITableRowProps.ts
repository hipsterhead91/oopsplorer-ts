import IValidator from "./IValidator";
import IChain from "./IChain";

interface ITableRowProps {
  validator: IValidator,
  chain: IChain
}

export default ITableRowProps;