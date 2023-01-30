import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import ILayoutProps from "../interfaces/ILayoutProps";

function Layout(props: ILayoutProps) {

  return (
    <div className="app__container">

      <Header setCurrentChain={props.setCurrentChain} />

      <main className="app__main">
        <Outlet context={[props.setCurrentChain]} />
      </main>

      <Footer />

    </div>
  );
}

export default Layout;