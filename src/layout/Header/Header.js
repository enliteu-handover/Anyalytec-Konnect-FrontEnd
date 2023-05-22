import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import classes from "./Header.module.scss";
import "../../styles/lib/eep-search.scss";
import HeaderSearch from "./HeaderSearch";
import UserNavItem from "./UserNavItem";
import Notification from "./Notification";
const Header = () => {
  const pageTitle = useSelector((state) => state.breadcrumb.title);

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

        <img
          src={process.env.PUBLIC_URL + "/images/logo.svg"}
          className={`${classes["eep-logo"]} img-responsive center-block d-block w-100`}
          alt="logo"
        />

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
