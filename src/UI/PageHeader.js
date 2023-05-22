import React from "react";
const PageHeader = (props) => {
  const { title, navLinksLeft, navLinksRight, filter, BulkAction, toggle } = props;
  return (
    <React.Fragment>
      <div className="d-flex p-0 m-0 eep-templates-setting-title">
        <h3 className="font-helvetica-r c-2c2c2c">
          {navLinksLeft && (
            <span className="mr-2" key={`${title}navLinksLeft`}>{navLinksLeft}</span>
          )}
          {title}
          {navLinksRight && (
            <span key={`${title}navLinksLeft`}>{navLinksRight}</span>
          )}
        </h3>
        <div className="eep-options-div my-auto eep_select_maindiv">
          {BulkAction}    
          {filter}
          {toggle}
        </div>

        {props.children}
      </div>
      <div className="eep-dropdown-divider"></div>
    </React.Fragment>
  );
};
export default PageHeader;
