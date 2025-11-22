import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAppSelector } from "@/store/hooks";
import AdminNavbar from "@/components/Navbars/AdminNavbar";
import AdminFooter from "@/components/Footers/AdminFooter";
import Sidebar from "@/components/Sidebar/Sidebar";
import routes from "../../routes";

interface AdminProps {
  children: React.ReactNode;
  permissionCheck?: string;
  router?: any;
}

const Admin: React.FC<AdminProps> = (props) => {
  const router = useRouter();
  
  // Get user from Redux store
  const user = useAppSelector((state) => state.auth.user);

  const [sidenavOpen, setSidenavOpen] = useState(true);
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    // Initialize sidebar state on mount
    if (typeof window !== 'undefined') {
      if (sidenavOpen) {
        document.body.classList.add("g-sidenav-pinned");
        document.body.classList.remove("g-sidenav-hidden");
      } else {
        document.body.classList.remove("g-sidenav-pinned");
        document.body.classList.add("g-sidenav-hidden");
      }
    }
  }, [sidenavOpen]);

  useEffect(() => {
    // Set window width only on client
    if (typeof window !== 'undefined') {
      setWindowWidth(window.innerWidth);
      
      const handleResize = () => {
        setWindowWidth(window.innerWidth);
      };
      
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  const getBrandText = (path: string) => {
    for (let i = 0; i < routes.length; i++) {
      const route = routes[i];
      if (route && route.layout && route.path && path.indexOf(route.layout + route.path) !== -1) {
        return route.name || "Brand";
      }
    }
    return "Brand";
  };

  const toggleSidenav = (e: React.MouseEvent) => {
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
    return router.pathname.indexOf("admin/alternative-dashboard") === -1
      ? "dark"
      : "light";
  };

  const closeSidenav = () => {
    if (windowWidth < 1200) {
      toggleSidenav({} as React.MouseEvent);
    }
  };

  const pathname = router.pathname || props.router?.pathname || "";

  return (
    <>
      <Sidebar
        {...props}
        router={router}
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
      <div className="main-content" onClick={closeSidenav}>
        <AdminNavbar
          {...({
            router,
            theme: getNavbarTheme(),
            toggleSidenav,
            sidenavOpen,
            brandText: getBrandText(pathname),
          } as any)}
        />
        <div className="main-content-body">
        {props.permissionCheck && user && !(user.hasOwnProperty(props.permissionCheck) && user[props.permissionCheck] == 1) ? (
          <div>No Permission</div>
        ) : (
          props.children
        )}
        </div>
        <AdminFooter />
      </div>
      {sidenavOpen ? (
        <div className="backdrop d-xl-none" onClick={toggleSidenav} />
      ) : null}
    </>
  );
};

export default Admin;

