// Пакеты
import { Outlet } from "react-router-dom";

// Компоненты
import Header from "./Header";
import Footer from "./Footer";



function Layout() {

  return (
    <div className="app__container">

      <Header />

      <main className="app__main">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}

export default Layout;