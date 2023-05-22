import React, { useEffect } from "react";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
const Communication = () => {
  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Communication",
      link: "app/communication",
    },
  ];


  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Communication",
      })
    );
  });
  return (
    <React.Fragment>
      <div className="adminPanel-div p-0 m-0">
        <div className="row no-gutters">
          <div className="col-md-12">
            <h4 className="title_h4 c-2c2c2c">Communication</h4>
          </div>
        </div>
        <div className="eep-dropdown-divider"></div>
      </div>

      <div className="recognition_container">
        <Link to="mysurvey">
          <div className="recognition_items bg-white">
            <div className="outter">
              <img
                src={process.env.PUBLIC_URL + "/images/icons/communications/Survey.svg"}
                className="image-circle"
                alt="Survey"
              />
            </div>
            <span>Survey</span>
          </div>
        </Link>
        <Link to={{ pathname: 'forum', state: { activeTab: 'forumpot' } }}>
          <div className="recognition_items bg-white">
            <div className="outter">
              <img
                src={
                  process.env.PUBLIC_URL + "/images/icons/communications/Forum.svg"
                }
                className="image-circle"
                alt="Forums"
              />
            </div>
            <span>Forums</span>
          </div>
        </Link>
        <Link to="closedpolls">
          <div className="recognition_items bg-white">
            <div className="outter">
              <img
                src={
                  process.env.PUBLIC_URL + "/images/icons/communications/Polls.svg"
                }
                className="image-circle"
                alt="Polls"
              />
            </div>
            <span>Polls</span>
          </div>
        </Link>
        <Link to={{ pathname: 'ideabox', state: { activeTab: 'ideas' } }}>
          <div className="recognition_items bg-white">
            <div className="outter">
              <img
                src={
                  process.env.PUBLIC_URL + "/images/icons/communications/IdeaBox.svg"
                }
                className="image-circle"
                alt="Idea Box"
              />
            </div>
            <span>Idea Box</span>
          </div>
        </Link>
      </div>
    </React.Fragment>
  );
};
export default Communication;
