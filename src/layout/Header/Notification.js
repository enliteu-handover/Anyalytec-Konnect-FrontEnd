import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Notification = () => {

  const isNotification = useSelector((state) => state.sharedData.isNotification);

  return (
    <React.Fragment>
      <li className="nav-item dropdown no-arrow mx-1 eep_notification_li">
        <Link className="nav-link dropdown-toggle" id="alertsDropdown" role="button" to="notifications">
          <div className="position-relative">
            <img alt="" src={process.env.PUBLIC_URL + `/images/notification.svg`} />
            {/* <span className="badge badge-danger badge-counter">0</span> */}
            {Object.keys(isNotification).length > 0 && isNotification.filter(e => e.seen === false).length > 0 && 
              <span className="notification-highlight"></span>
            }
          </div>
        </Link>
      </li>
    </React.Fragment>
  );

};
export default Notification;