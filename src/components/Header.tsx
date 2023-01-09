import React from 'react';
import { Link, NavLink } from "react-router-dom";
import IHeaderProps from '../interfaces/IHeaderProps';
import IChain from '../interfaces/IChain';
import INavLink from '../interfaces/INavLink';
import { chains } from '../chains/chains';
import CurrentChainContext from '../contexts/CurrentChainContext';
import { getPath } from '../utils/formatting';

function Header(props: IHeaderProps) {

  const currentChain = React.useContext(CurrentChainContext);
  const chainList = React.useRef<HTMLDivElement>(null);
  const arrow = React.useRef<HTMLSpanElement>(null);
  const overlay = React.useRef<HTMLDivElement>(null);

  const toggleChainList = () => {
    if (chainList.current && arrow.current && overlay.current) {
      chainList.current.classList.toggle("header__chain-list_hidden");
      arrow.current.classList.toggle("header__switcher-arrow_up");
      overlay.current.classList.toggle("header__overlay_hidden");
    }
  };

  const hideChainList = () => {
    if (chainList.current && arrow.current && overlay.current) {
      chainList.current.classList.add("header__chain-list_hidden")
      arrow.current.classList.remove("header__switcher-arrow_up");
      overlay.current.classList.add("header__overlay_hidden");
    }
  };

  const switchChain = (chain: IChain | null) => {
    props.setCurrentChain(chain);
    hideChainList();
    window.scrollTo(0, 0); // прокрутка страницы наверх
  }

  const chainText = (currentChain === null) ? 'Chain is not selected' : `${currentChain.name} ${currentChain.isMain ? '' : 'Testnet'}`;
  const chainButtonStyle = ({ isActive }: INavLink) => isActive ? "header__chain header__chain_selected" : "header__chain";

  return (
    <header className="header">
      <div className="header__container">
        <Link to="/" onClick={() => { switchChain(null) }} className="header__logo">
          <div className="header__logo-top"><span>Oops!</span>plorer</div>
          <div className="header__logo-bottom">humblest blockchain explorer ever</div>
        </Link>
        <div className="header__chains">
          <div onClick={toggleChainList} className="header__chain-switcher">
            <span className="header__current-chain">{chainText}</span>
            <div className="header__switcher"><span ref={arrow} className="header__switcher-arrow" /></div>
          </div>
          <div ref={chainList} className="header__chain-list header__chain-list_hidden">
            <div className="header__chain-list-container">
              {chains.map(chain => {
                return <NavLink key={chain.chain} to={`/${getPath(chain)}/validators`} onClick={() => { switchChain(chain) }} className={chainButtonStyle}>
                  {`${chain.name} ${chain.isMain ? '' : 'Testnet'}`} <span>({chain.chain})</span>
                </NavLink>
              })}
            </div>
          </div>
        </div>
      </div>
      <div ref={overlay} onClick={hideChainList} className="header__overlay header__overlay_hidden" />
    </header>
  );
}

export default Header;