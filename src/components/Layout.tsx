import { Outlet, useOutletContext } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ILayoutProps from "../interfaces/ILayoutProps";

function Layout(props: ILayoutProps) {

  const setCurrentChain = props.setCurrentChain;

  return (
    <div className="app__container">

      <Header setCurrentChain={setCurrentChain} />

      <main className="app__main">
        <Outlet context={[setCurrentChain]} />
      </main>

      <Footer />

    </div>
  );
}


export function useSetCurrentChain() {
  return useOutletContext<any>();
}

export default Layout;