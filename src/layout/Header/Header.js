import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classes from "./Header.module.scss";
import "../../styles/lib/eep-search.scss";
import HeaderSearch from "./HeaderSearch";
import UserNavItem from "./UserNavItem";
import Notification from "./Notification";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import SvgComponent from "../../components/svgComponent";
const Header = () => {
  const pageTitle = useSelector((state) => state.breadcrumb.title);
  const headerLogo = useSelector((state) => state.storeState.logo);
  const [state, setState] = useState({
    "headerLogoByte": null
  });

  React.useEffect(() => {
    const obj = {
      url: URL_CONFIG.ADD_ADMIN_HEADER_LOGO,
      method: "get"
    };
    httpHandler(obj)
      .then((reponse) => {
        setState({
          ...state,
          "headerLogoByte": reponse?.data?.image ?? ''
        })
      })
  }, [])

  React.useEffect(() => {
    setState({
      ...state,
      "headerLogoByte": headerLogo?.headerLogoByte ?? ""
    })
  }, [headerLogo])

  return (
    <div>
      {/* <div className="header-toggle-btn"></div> */}

      <nav
        className={`navbar navbar-expand navbar-bg-color navbar-light topbar static-top br-b-25`}
      >
        <button
          id="sidebarToggleTop"
          className={`btn btn-link d-md-none rounded-circle mr-3`}
        >
          <i className="fa fa-bars"></i>
        </button>

        {
          state?.headerLogoByte?.includes('.svg') ?
           <div style={{height:"60px"}}> <SvgComponent svgUrl={state?.headerLogoByte} /></div> : <img
              src={(state?.headerLogoByte) || (process.env.PUBLIC_URL + "/images/logo.svg")}
              className={`${classes["eep-logo"]} img-responsive center-block d-block w-100`}
              alt="logo"
            />}

        <div className={`eep-topbar-divider d-none d-sm-block`}></div>

        <div className={`pg_heading`}>
          <h2>{pageTitle}</h2>
        </div>

        {/* Search  */}
        <HeaderSearch />

        <ul className="navbar-nav">
          {/* Nav Item - Search Dropdown (Visible Only XS) */}
          <li className="nav-item dropdown no-arrow d-sm-none">
            <Link
              className="nav-link dropdown-toggle"
              id="searchDropdown"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
              to="#"
            >
              <i className="fas fa-search fa-fw"></i>
            </Link>

            <div
              className="dropdown-menu dropdown-menu-right p-3 shadow animated--grow-in"
              aria-labelledby="searchDropdown"
            >
              <form className="form-inline mr-auto w-100 navbar-search">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control bg-light border-0 small"
                    placeholder="Search for..."
                    aria-label="Search"
                    aria-describedby="basic-addon2"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary" type="button">
                      <i className="fas fa-search fa-sm"></i>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </li>
          {/* Notification */}
          <Notification />

          {/* Nav Item User */}
          <UserNavItem />
        </ul>
      </nav>
    </div>
  );
};
export default Header;
