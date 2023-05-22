import React, { useEffect } from "react";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
const Recognition = () => {
  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Recognition",
      link: "app/recognition",
    },
  ];

  
useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Recognition",
      })
    );
  });
  return (
    <React.Fragment>
        <div className="adminPanel-div p-0 m-0">
            <div className="row no-gutters">
                <div className="col-md-12">
                    <h4 className="title_h4 c-2c2c2c">Recognition</h4>
                </div>
            </div>
            <div className="eep-dropdown-divider"></div>
        </div>

      <div className="recognition_container">
        <Link to="ecardIndex">
          <div className="recognition_items bg-white">
            <div className="outter">
              <img
                src={ process.env.PUBLIC_URL + "/images/icons/recognition/e-cards.svg" }
                className="image-circle"
                alt="E-Cards"
              />
            </div>
            <span>Ecards</span>
          </div>
        </Link>
        <Link to="certificates">
          <div className="recognition_items bg-white">
            <div className="outter">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/icons/recognition/certificates.svg"
                }
                className="image-circle"
                alt="Certificates"
              />
            </div>
            <span>Certificates</span>
          </div>
        </Link>
        <Link to="badges">
          <div className="recognition_items bg-white">
            <div className="outter">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/icons/recognition/badges.svg"
                }
                className="image-circle"
                alt="Badges"
              />
            </div>
            <span>Badges</span>
          </div>
        </Link>
        <Link to="awards">
          <div className="recognition_items bg-white">
            <div className="outter">
              <img
                src={
                  process.env.PUBLIC_URL +
                  "/images/icons/recognition/awards.svg"
                }
                className="image-circle"
                alt="Awards"
              />
            </div>
            <span>Awards</span>
          </div>
        </Link>
      </div>
    </React.Fragment>
  );
};
export default Recognition;
