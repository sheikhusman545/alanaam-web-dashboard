/*!

=========================================================
* NextJS Argon Dashboard PRO - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/nextjs-argon-dashboard-pro
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useContext } from "react";
import { withRouter } from "next/router";
// core components
import AdminNavbar from "components/Navbars/AdminNavbar.js";
import AdminFooter from "components/Footers/AdminFooter.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import routes from "routes.js";
import AppContext from "@/api/context/AppContext";


const Admin = (props) => {
  const { user } = useContext(AppContext);

  const [sidenavOpen, setSidenavOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.collapse) {
        return getRoutes(prop.views);
      }
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      } else {
        return null;
      }
    });
  };
  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props.router.pathname.indexOf(
          routes[i].layout + routes[i].path
        ) !== -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };
  // toggles collapse between mini sidenav and normal
  const toggleSidenav = (e) => {
    if (document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-pinned");
      document.body.classList.add("g-sidenav-hidden");
    } else {
      document.body.classList.add("g-sidenav-pinned");
      document.body.classList.remove("g-sidenav-hidden");
    }
    setSidenavOpen(!sidenavOpen);
  };
  const getNavbarTheme = () => {
    return props.router.pathname.indexOf("admin/alternative-dashboard") ===
      -1
      ? "dark"
      : "light";
  };

  const closeSidenav = () => {
    if (windowWidth < 1200) {
      toggleSidenav();
    }
  };

  return (
    <>
      <Sidebar
        {...props}
        routes={routes}
        toggleSidenav={toggleSidenav}
        closeSidenav={closeSidenav}
        sidenavOpen={sidenavOpen}
        user={user}
        logo={{
          innerLink: "/",
          imgSrc: "/assets/img/logo/logo png 2.png",
          imgAlt: "...",
        }}
      />
      <div
        className="main-content"
        onClick={closeSidenav}
      >
        <AdminNavbar
          {...props}
          theme={getNavbarTheme()}
          toggleSidenav={toggleSidenav}
          sidenavOpen={sidenavOpen}
          brandText={getBrandText(props.router.pathname)}
        />
        {((props.permissionCheck) && (!((user.hasOwnProperty(props.permissionCheck)) && (user[props.permissionCheck] == 1))))
          && <div>No Permission</div>
          || props.children}
        <AdminFooter />
      </div>
      {sidenavOpen ? (
        <div className="backdrop d-xl-none" onClick={toggleSidenav} />
      ) : null}
    </>
  );
}

export default withRouter(Admin);
