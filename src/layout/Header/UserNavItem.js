import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import LogoutModal from "../../modals/LogoutModal";

const UserNavItem = () => {

  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

  return (
    <React.Fragment>
      <LogoutModal />
      <li className="nav-item dropdown no-arrow mx-1 eep_header_dp nav-link_icons">
        <Link
          // className={`nav-link_icons`}
          id="userDropdown"
          role="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
          to="#"
        >
          <img
            className={`img-profile rounded-circle`}
            src={process.env.PUBLIC_URL + `/images/user_profile.png`}
            alt="profile"
          />
        </Link>

        <div
          className="eep-dropdown-menu eep-dropdown-div eep_profile_topbar dropdown-menu dropdown-menu-right shadow animated--grow-in"
          aria-labelledby="userDropdown"
        >

          <Link to="/app/myprofile" className="dropdown-item">
            My Profile
          </Link>

          {userRolePermission.adminPanel &&
            <Link to="/app/adminpanel" className="dropdown-item">
              Admin Panel
            </Link>
          }

          <Link to="/app/help" className="dropdown-item">
            Help
          </Link>

          <Link className="dropdown-item" data-toggle="modal" data-target="#logoutModal" to="#">
            Logout
          </Link>
        </div>
      </li>
    </React.Fragment>
  );
};
export default UserNavItem;
