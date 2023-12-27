import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Breadcrumb = () => {
  const getBreadCrumb = useSelector((state) => state.breadcrumb.breadCrumbArr);
  return (
    <div className="row eep_tab_menus eep_breadcrumb_whole_div no-gutters">
      <div className="eep_breadcrumb_div">
        <nav
          className="eep-breadcrumb content-lr-padding"
          aria-label="breadcrumb"
        >
          <ol className="breadcrumb">
            {getBreadCrumb?.map((val, i) => {
              const classValue = `breadcrumb-item ${i === getBreadCrumb.length - 1 ? "active" : ""
                }`;
              return (
                <li className={classValue} key={`list_${i}`}>
                  {i !== getBreadCrumb.length - 1 && (
                    <Link to={`/${val.link}`}>{val.label}</Link>
                  )}
                  {i === getBreadCrumb.length - 1 && <span>{val.label}</span>}
                </li>
              );
            })}
            {/* <li className="breadcrumb-item">
              <a href="dashboard.php">Home</a>
            </li>
            <li className="breadcrumb-item active">Dashboard</li> */}
          </ol>
        </nav>
      </div>
    </div>
  );
};
export default Breadcrumb;
