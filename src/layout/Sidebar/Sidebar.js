/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { sideMenuHidden } from "../../helpers";
import Communication from "./icon/communication";
import Dashboard from "./icon/dashboard";
import DownArrow from "./icon/downArrow";
import Library from "./icon/library";
import Org from "./icon/org";
import Recognition from "./icon/recognition";
import Rewards from "./icon/rewards";
import UpArrow from "./icon/upArrrow";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleDown } from '@fortawesome/free-solid-svg-icons';


const Sidebar = (props) => {
  const [sidebarMenu, setSidebarMenu] = useState([]);
  const [sidebarToggled, setSidebarToggled] = useState(false);
  const [theme, setTheme] = useState(props?.theme)
  const [activeMenu, setActiveMenu] = useState(null)
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

  const fetchSidebarMenu = () => {
    fetch(`${process.env.PUBLIC_URL}/data/sidebarMenu.json`)
      .then((response) => response.json())
      .then(async (data) => {

        if (JSON.stringify(userRolePermission) !== "{}")
          setSidebarMenu(
            // data
            await sideMenuHidden(data, userRolePermission)
          );
      });
  };

  const sidebarToggleHanlder = () => {
    setSidebarToggled(!sidebarToggled);
  };

  React.useEffect(() => {
    setTheme({
      color: JSON.parse(sessionStorage.getItem('userData'))?.theme?.color,
    })
  }, [JSON.parse(sessionStorage.getItem('userData'))?.theme?.color])

  useEffect(() => {
    fetchSidebarMenu();
  }, [userRolePermission]);

  const user_details = sessionStorage.getItem('userData');
  const theme_color = (theme?.color || theme || "color_one") === 'color_two' ? "#000" : "#fff"
  const icon = {
    'Dashboard.svg': <Dashboard color={theme_color} />,
    'Recognition.svg': <Recognition color={theme_color} />,
    'Library.svg': <Library color={theme_color} />,
    'Communication.svg': <Communication color={theme_color} />,
    'Rewards.svg': <Rewards color={theme_color} />,
    'download.svg': <Org color={theme_color} />
  }

  // const handleChangeMenu = (Element,index) => {
  //   const value = index === activeMenu ? null : index
  //   setActiveMenu(value)
  // }

  const handleChangeMenu = (element, index) => {

    const newActiveMenu = index === activeMenu ? null : index;
    setActiveMenu(newActiveMenu);
  };
  
  

  return (
    <React.Fragment>
      <ul
        className={`navbar-nav sidebar sidebar-dark accordion eep-navbar-div eep-navbar-newversion menu-bg-theme ${sidebarToggled ? "eep-navbar-div-sm toggled" : ""
          }`}
        id="accordionSidebar"
      >
        <li className="nav-item">
          <div className={`px-3 pt-3 pb-0 profile-greet text-white text-left`}>
            Hello,
          </div>
          <div
            className={`px-3 pt-0 pb-2 text-white profile-nm text-wrap card-text`}
          >

            <span className="u_full_name mb-2 mt-1">{(
              JSON.parse(user_details)?.firstName ?? ""
            ) + ' ' + (
                JSON.parse(user_details)?.lastName ?? ""
              )}</span>

            <span className="u_initials mt-3 d-none">{
              (
                JSON.parse(user_details)?.firstName?.[0]?.toUpperCase() ?? ""
              ) + (
                JSON.parse(user_details)?.lastName?.[0]?.toUpperCase() ?? ""
              )}</span>

          </div>
        </li>

        <hr className={`sidebar-divider my-2`} />

       

        {sidebarMenu?.map((menu, index) => {
          return (
            <li className="nav-item" key={"list" + index}>
              <Link
                className={` nav-link collapsed ${(((`/app/` + menu?.link) === window.location.pathname) &&
                  (!menu?.subMenu)) && activeMenu === index   ? 'active-parent-menu' : ''}`}
                data-toggle={menu && menu.subMenu  ? "collapse" : ""}
                data-target={
                  menu && menu.subMenu  ? `#collapseSection${index}` : ""
                }
                to={menu.isDirectLink ? (`/app/` + menu?.link) : "#"}
                onClick={(e) => handleChangeMenu(e,index)}
              >
                <span
                  className="eep-menu-icon-sidebar"
                >
                  {icon[menu.icon]}
                </span>
       
                <span>{menu.label}</span>
                
                <span style={{}}>
                {!sidebarToggled && menu?.subMenu?.length > 0 ?
                  (activeMenu !== index ?
                     <FontAwesomeIcon icon={faAngleRight} color={theme_color} className="sidebaricondownup"  />
                    :
                    <FontAwesomeIcon icon={faAngleDown} color={theme_color} className="sidebaricondown" />

                    // <UpArrow color={theme_color}
                    // />
                    // : <DownArrow color={theme_color}
                    // />
                    
                  ) : ''}
                </span>

              </Link>
              {menu?.subMenu && (
                <div
                  id={`collapseSection${index}`}
                  className="collapse"
                  data-parent="#accordionSidebar"
                >
                  <div className="bg-white py-2 collapse-inner rounded">
                    {menu?.subMenu?.map((submenu, index) => {
                      return (
                        <Link
                          className={`collapse-item ${(`/app/` + submenu?.link)
                            === window.location.pathname && 'active-menu'}`}
                          key={"submenu" + index}
                          to={`/app/` + submenu.link}
                        >
                          {submenu.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              )}
            </li>
          );
        })}
        <div className="text-center sidebarToggleDiv">
          <Link
            className="nav-link sidebarToggleLink collapsed"
            id="sidebarToggle"
            onClick={sidebarToggleHanlder}
            to="#"
          >
            <img
              alt="enlite logo"
              className="eep-logo-side-icon"
              src={`${process.env.PUBLIC_URL}/images/menu/Enlite.svg`}
            />
            <img
              alt="enlite logo"
              className="eep-logo-fav-side-icon d-none"
              src={`${process.env.PUBLIC_URL}/images/menu/Enlite-Fav-Icon.svg`}
            />
          </Link>
        </div>
      </ul>
    </React.Fragment>
  );
};
export default Sidebar;
