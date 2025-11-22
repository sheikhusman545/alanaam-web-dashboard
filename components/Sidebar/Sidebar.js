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
import React from "react";
import Link from "next/link";
import { withRouter } from "next/router";
// nodejs library that concatenates classes
import classnames from "classnames";
// nodejs library to set properties for components
import { PropTypes } from "prop-types";
// react library that creates nice scrollbar on windows devices
// PerfectScrollbar will be loaded dynamically to avoid SSR issues
// reactstrap components
import { Collapse, NavbarBrand, Navbar, NavItem, NavLink, Nav } from "reactstrap";

class Sidebar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ...this.getCollapseStates(props.routes),
      PerfectScrollbar: null, // Will be loaded dynamically
    };
  }
  async componentDidMount() {
    this.setState({
      windowWidth: window.innerWidth,
      navigatorPlatform: navigator.platform,
    });
    
    // Load PerfectScrollbar only on client side
    if (typeof window !== 'undefined') {
      try {
        const PerfectScrollbarModule = await import("react-perfect-scrollbar");
        this.setState({
          PerfectScrollbar: PerfectScrollbarModule.default || PerfectScrollbarModule,
        });
      } catch (e) {
        console.error("Failed to load PerfectScrollbar:", e);
      }
    }
  }
  // verifies if routeName is the one active (in browser input)
  activeRoute = (routeName) => {
    return this.props.router.pathname.indexOf(routeName) > -1 ? "active" : "";
  };
  // makes the sidenav normal on hover (actually when mouse enters on it)
  onMouseEnterSidenav = () => {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.add("g-sidenav-show");
    }
  };
  // makes the sidenav mini on hover (actually when mouse leaves from it)
  onMouseLeaveSidenav = () => {
    if (!document.body.classList.contains("g-sidenav-pinned")) {
      document.body.classList.remove("g-sidenav-show");
    }
  };
  // this creates the intial state of this component based on the collapse routes
  // that it gets through this.props.routes
  getCollapseStates = (routes) => {
    let initialState = {};
    routes.map((prop, key) => {
      if (prop.collapse) {
        initialState = {
          [prop.state]: this.getCollapseInitialState(prop.views),
          ...this.getCollapseStates(prop.views),
          ...initialState,
        };
      }
      return null;
    });
    return initialState;
  };
  // this verifies if any of the collapses should be default opened on a rerender of this component
  // for example, on the refresh of the page,
  // while on the src/views/forms/RegularForms.js - route /admin/regular-forms
  getCollapseInitialState(routes) {
    for (let i = 0; i < routes.length; i++) {
      if (routes[i].collapse && this.getCollapseInitialState(routes[i].views)) {
        return true;
      } else if (this.props.router.pathname.indexOf(routes[i].path) !== -1) {
        return true;
      }
    }
    return false;
  }
  // this is used on mobile devices, when a user navigates
  // the sidebar will autoclose

  // this function creates the links and collapses that appear in the sidebar (left menu)
  createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.redirect) {
        return null;
      }

      if (prop.permissionCheck) {
        if (!((this.props.user.hasOwnProperty(prop.permissionCheck)) && (this.props.user[prop.permissionCheck] == 1))) {
          return null;
        }
      }

      if (prop.collapse) {
        var st = {};
        st[prop["state"]] = !this.state[prop.state];
        return (
          <NavItem key={key}>
            <NavLink
              href="#pablo"
              data-toggle="collapse"
              aria-expanded={this.state[prop.state]}
              className={classnames({
                active: this.getCollapseInitialState(prop.views),
              })}
              onClick={(e) => {
                e.preventDefault();
                this.setState(st);
              }}
            >
              {prop.icon ? (
                <>
                  <i className={prop.icon} />
                  <span className="nav-link-text">{prop.name}</span>
                </>
              ) : prop.miniName ? (
                <>
                  <span className="sidenav-mini-icon"> {prop.miniName} </span>
                  <span className="sidenav-normal"> {prop.name} </span>
                </>
              ) : null}
            </NavLink>
            <Collapse isOpen={this.state[prop.state]}>
              <Nav className="nav-sm flex-column">{this.createLinks(prop.views)}</Nav>
            </Collapse>
          </NavItem>
        );
      }
      return (
        <NavItem className={this.activeRoute(prop.layout + prop.path)} key={key}>
          <Link href={prop.layout + prop.path}>
            <NavLink href="#pablo" onClick={this.props.closeSidenav}>
              {prop.icon !== undefined ? (
                <>
                  <i className={prop.icon} />
                  <span className="nav-link-text">{prop.name}</span>
                </>
              ) : prop.miniName !== undefined ? (
                <>
                  <span className="sidenav-mini-icon"> {prop.miniName} </span>
                  <span className="sidenav-normal"> {prop.name} </span>
                </>
              ) : (
                    prop.name
                  )}
            </NavLink>
          </Link>
        </NavItem>
      );
    });
  };
  render() {
    const { routes, logo } = this.props;
    const scrollBarInner = (
      <div className="scrollbar-inner">
        <div className="sidenav-header d-flex align-items-center">
          {logo && logo.innerLink ? (
            <Link href={logo.innerLink}>
              <span>
                <NavbarBrand href="#pablo">
                  <img
                    alt={logo.imgAlt}
                    className="navbar-brand-img"
                    src={logo.imgSrc}
                    style={{ maxWidth: "60%", maxHeight: "none" }}
                  />
                </NavbarBrand>
              </span>
            </Link>
          ) : null}
          {logo && logo.outterLink ? (
            <NavbarBrand href={logo.outterLink} target="_blank">
              <img alt={logo.imgAlt} className="navbar-brand-img" src={logo.imgSrc} />
            </NavbarBrand>
          ) : null}
          <div className="ml-auto">
            <div
              className={classnames("sidenav-toggler d-none d-xl-block", {
                active: this.props.sidenavOpen,
              })}
              onClick={this.props.toggleSidenav}
            >
              <div className="sidenav-toggler-inner">
                <i className="sidenav-toggler-line" />
                <i className="sidenav-toggler-line" />
                <i className="sidenav-toggler-line" />
              </div>
            </div>
          </div>
        </div>
        <div className="navbar-inner">
          <Collapse navbar isOpen={true}>
            <Nav navbar>{this.createLinks(routes)}</Nav>
            <hr className="my-3" />
          </Collapse>
        </div>
      </div>
    );
    return (
      <Navbar
        className={
          "sidenav navbar-vertical navbar-expand-xs navbar-light bg-white " +
          (this.props.rtlActive ? "" : "fixed-left")
        }
        onMouseEnter={this.onMouseEnterSidenav}
        onMouseLeave={this.onMouseLeaveSidenav}
      >
        {(() => {
          const PerfectScrollbar = this.state.PerfectScrollbar;
          return typeof window !== 'undefined' && this.state.navigatorPlatform && this.state.navigatorPlatform.indexOf("Win") > -1 && PerfectScrollbar ? (
            <PerfectScrollbar>{scrollBarInner}</PerfectScrollbar>
          ) : (
              scrollBarInner
            );
        })()}
      </Navbar>
    );
  }
}

Sidebar.defaultProps = {
  routes: [{}],
  toggleSidenav: () => { },
  sidenavOpen: false,
  rtlActive: false,
};

Sidebar.propTypes = {
  // function used to make sidenav mini or normal
  toggleSidenav: PropTypes.func,
  // prop to know if the sidenav is mini or normal
  sidenavOpen: PropTypes.bool,
  // links that will be displayed inside the component
  routes: PropTypes.arrayOf(PropTypes.object),
  // logo
  logo: PropTypes.shape({
    // innerLink is for links that will direct the user within the app
    // it will be rendered as <Link to="...">...</Link> tag
    innerLink: PropTypes.string,
    // outterLink is for links that will direct the user outside the app
    // it will be rendered as simple <a href="...">...</a> tag
    outterLink: PropTypes.string,
    // the image src of the logo
    imgSrc: PropTypes.string.isRequired,
    // the alt for the img
    imgAlt: PropTypes.string.isRequired,
  }),
  // rtl active, this will make the sidebar to stay on the right side
  rtlActive: PropTypes.bool,
};

export default withRouter(Sidebar);
