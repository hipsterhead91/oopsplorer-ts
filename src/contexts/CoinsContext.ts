import React from "react";
import ICoin from "../interfaces/ICoin";

const CoinsContext = React.createContext<ICoin | null>(null);

export default CoinsContext;