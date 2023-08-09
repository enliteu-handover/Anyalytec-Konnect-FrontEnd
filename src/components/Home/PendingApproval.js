import React from 'react';
import { Link } from 'react-router-dom';
import ResponseInfo from "../../UI/ResponseInfo";
import { eepFormatDateTime } from "../../shared/SharedService";

const PendingApproval = (props) => {
  const { dashboardDetails } = props;

  return (
    <div className="bg-f5f5f5 br-15 waitingapprovals_section">
      <div className="p-3">
        <h4 className="title_lbl">Approval Requests pending</h4>
        {dashboardDetails && dashboardDetails?.awardApprovals &&
          <div className="waitingapprovals_list_div text-left">
            {dashboardDetails.awardApprovals.map((item, index) => {
              return (
                <div className="col-md-12 px-0 mb-3" key={"waitingapprovals_" + index}>
                  <Link to={{ pathname: "nominationsapproval", state: { awardData: item, isApproval: true } }} className="c-2c2c2c a_hover_txt_deco_none d_waitingapprovals_list"
                    title={item?.award?.name}>
                    <p className="mb-2 eep_overflow_ellipsis d_waitingapprovals">
                      <img className="d_list_icon" src={process.env.PUBLIC_URL + "/images/icons/static/award.svg"} alt="program-icon" />
                      <span className="pl-1">{item?.award?.name}</span>
                    </p>
                  </Link>
                  <p className="text-right mb-1 d_waitingapprovals_dt opacity-3">{eepFormatDateTime(item?.award?.createdAt)}</p>
                </div>
              )
            })}
          </div>
        }
        {dashboardDetails && !dashboardDetails.awardApprovals?.length && (
          <ResponseInfo title="No award found" responseImg="noRecord" responseClass="response-info" />
        )}
      </div>
    </div>
  );
}

export default PendingApproval;