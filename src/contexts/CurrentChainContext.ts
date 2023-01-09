import React from "react";
import IChain from "../interfaces/IChain";

const CurrentChainContext = React.createContext<IChain | null>(null);

export default CurrentChainContext;