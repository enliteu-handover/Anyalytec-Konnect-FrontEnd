import React from 'react';
import { Link } from "react-router-dom";
import ResponseInfo from "../../UI/ResponseInfo";
const Upcomings = (props) => {

    const { dashboardDetails } = props;

    return (
        <div className="bg-f5f5f5 br-15 mt-3 myTask_section">
            <div className="p-3">
                <Link to="#" className="c-2c2c2c a_hover_txt_deco_none">
                    <h4 className="title_lbl">Happenings
                        <img width="30px" src="../images/image (3).png" />
                    </h4>
                </Link>
                {dashboardDetails && dashboardDetails.upcomings && dashboardDetails.upcomings.map((item, index) => {
                    return (
                        <div className="mytasks_list_div text-left" key={"myTask_" + index}>
                            <div className="">
                                <Link to={{ pathname: "ecardIndex", state: { activeTab: 'CardsTab' } }} className="c-2c2c2c a_hover_txt_deco_none d_mytasks_list"  style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                    <p className="mb-2 eep_overflow_ellipsis d_mytasks">
                                        <span>{item?.message}</span>
                                    </p>
                                    <button
                                        style={{
                                            padding: 6,
                                            fontSize: 10
                                        }}
                                        className="eep-btn eep-btn-success eep-btn-xsml">
                                        Send
                                    </button>
                                </Link>
                                <div className="text-left d_mytasks_dt mb-0 opacity-3" style={{ marginTop: "-8px" }}>{item?.date}</div>
                            </div>
                            {index !== dashboardDetails?.upcomings?.length - 1 && <div style={{ borderTop: "1px solid #e1dede" }} className="dropdown-divider"></div>}
                        </div>
                    )
                })}
                {dashboardDetails && !dashboardDetails.upcomings?.length &&
                    <ResponseInfo title="No upcomings found" responseImg="noRecord" responseClass="response-info" />
                }
            </div>
        </div>
    );
}

export default Upcomings;