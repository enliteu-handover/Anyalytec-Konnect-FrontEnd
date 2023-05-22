import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const CustomLinkComponent = (props) => {

	const {cSettings, data} = props;
  //console.log("CustomLinkComponent props", props);
  const [stateObj, setStateObj] = useState({});

  useEffect(() => {
    let optionsVal = {};
    if(cSettings.isRedirect) {
      if(cSettings.objReference && Object.keys(cSettings.objReference).length > 0) {
        Object.keys(cSettings.objReference).forEach(function(key) {
          if(cSettings.objReference[key] === "data") {
            optionsVal[key] = data;
          } else {
            optionsVal[key] = cSettings.objReference[key];
          }
        });
        setStateObj(optionsVal);
      }
    }
  }, [cSettings]);
  
  //console.log("setStateObj", stateObj);

	return (
		<React.Fragment>
      {cSettings && cSettings.isRedirect &&
			  <Link 
          to={{
            pathname: cSettings.link,
            state: stateObj,
          }}
          className="table-btn"
        >
          <img
            src={data.state && data.state === "created" ? `${process.env.PUBLIC_URL}/images/icons/static/EEPProceed.svg` : (data.state === "submitted" ? `${process.env.PUBLIC_URL}/images/icons/static/EEPView.svg` : `${process.env.PUBLIC_URL}/images/icons/static/ViewMore.svg`)}
            className="r_award_img selected"
            alt="Icon"
            title="Proceed"
            style={{ height: "25px" }}
          />
        </Link>
      }
      {cSettings && !cSettings.isRedirect &&
			  <Link to="#" className="table-btn">{cSettings.label}</Link>
      }
		</React.Fragment>
	);
};
export default CustomLinkComponent;
