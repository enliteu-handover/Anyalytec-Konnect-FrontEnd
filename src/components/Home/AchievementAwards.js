import React from 'react';
import ResponseInfo from "../../UI/ResponseInfo";

const AchievementAwards = (props) => {

  const { dashboardDetails } = props;

  return (
    <div className="bg-f5f5f5 br-10 achievements_section_div h-100 eep_scroll_y">
      <div className="p-3 text-center">
        <label className="achievements_lbl title_lbl">Awards</label>
        {dashboardDetails && dashboardDetails.acheivedAwardList?.length > 0 &&
          <div className="d-flex flex-wrap justify-content-center achievements_awards">
            {dashboardDetails.acheivedAwardList.map((item, index) => {
              return (
                <div className="col-auto achievements_img_div" key={"Achievements_award_" + index}>
                  <img src={item?.imageByte ? item?.imageByte?.image : process.env.PUBLIC_URL + "/images/icons/static/noData.svg"} className="d_achievements_img eep-pulse-direct-animation" alt={item?.imageByte?.name} title={item?.imageByte?.name} />
                  <span>{item.acheivedCount > 9 ? item.acheivedCount : "0" + item.acheivedCount}</span>
                </div>
              )
            })}
          </div>
        }
        {dashboardDetails && dashboardDetails.acheivedAwardList?.length <= 0 && (
          <ResponseInfo title="No award found" responseImg="noRecord" responseClass="response-info" />
        )}
        <div className="dropdown-divider"></div>
        <label className="achievements_lbl title_lbl">Awaiting Awards</label>
        {dashboardDetails && dashboardDetails.awaitingAwardList?.length > 0 &&
          <div className="d-flex flex-wrap justify-content-center achievements_awards_waiting">
            {dashboardDetails.awaitingAwardList.map((item, index) => {
              return (
                <div className="col-auto achievements_img_div" key={"Waiting_award_" + index}>
                  <img src={item?.imageByte ? item?.imageByte?.image : process.env.PUBLIC_URL + "/images/icons/static/noData.svg"} className="d_achievements_img eep-bounce-direct-animation" alt={item?.imageByte?.name} title={item?.imageByte?.name} />
                </div>
              )
            })}
          </div>
        }
        {dashboardDetails && dashboardDetails.awaitingAwardList?.length <= 0 && (
          <ResponseInfo title="No wating award found" responseImg="noRecord" responseClass="response-info" />
        )}
      </div>
    </div>
  );
}

export default AchievementAwards;