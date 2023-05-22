import React from "react";
import { useLocation} from "react-router-dom";
import { useSelector } from "react-redux";
import ManageAwardViewInfo from "./ManageAwardViewInfo";
import ResponseInfo from "../../UI/ResponseInfo";

const ManageSpotAwardView = () => {

	const getLocation = useLocation();
	const aDataValue = getLocation.state ? getLocation.state?.awardManageData : {};
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

	return(
    <React.Fragment>
      {userRolePermission.awardCategorisation &&
      <div className="pt-4">
        <div className="row justify-content-md-center eep-content-start" id="content-start">
          <div className="col-md-4 col-lg-4 col-xs-12 col-sm-12">
            <ManageAwardViewInfo aDataValue={aDataValue}/>
          </div>
          <div className="col-md-8 col-lg-8 col-xs-12 col-sm-12">
            <div className="bg-f5f5f5 br-15 h-100">
              <div className="p-4">
                <div className="r_award_col_div">				
                  <div className="col-md-12 form-group px-0 eep-recognition-select2-dropdown_div">
                    <label className="font-helvetica-m c-404040">Award Type</label>
                    <div className="vInputsDiv">
                      <p className="mb-0">Spot Award</p>
                    </div>
                  </div>					
                  <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 px-0 form-group s_awardDept_div eep-recognition-select2-dropdown_div">
                    <div className="d-flex p-0 mb-2">
                      <label className="font-helvetica-m c-404040">Department</label>
                    </div>
                    <div className="vInputsDiv">
                      <p className="mb-0">{aDataValue?.departmentId?.name}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      }
      {!userRolePermission.awardCategorisation &&
        <div className="row eep-content-section-data no-gutters">
          <ResponseInfo title="Oops! Looks illigal way." responseImg="accessDenied" responseClass="response-info" messageInfo="Contact Administrator." />
        </div>
      }		
    </React.Fragment>
	)
}

export default ManageSpotAwardView;