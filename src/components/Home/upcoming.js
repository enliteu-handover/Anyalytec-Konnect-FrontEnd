import React from "react";
import { Link } from "react-router-dom";
import ResponseInfo from "../../UI/ResponseInfo";
import { useTranslation } from "react-i18next";
const Upcomings = (props) => {
  const { dashboardDetails } = props;
  const { t } = useTranslation();

  return (
    <div className="bg-f5f5f5 br-15 mt-3 myTask_section">
      <div className="p-3">
        <Link to="#" className="c-2c2c2c a_hover_txt_deco_none">
          <h4 className="title_lbl">
            {t(`dashboard.Happenings`)}
            <img width="30px" src="../images/image (3).png" />
          </h4>
        </Link>
        {dashboardDetails &&
          dashboardDetails.upcomings &&
          dashboardDetails.upcomings.map((item, index) => {
            return (
              <div className="mytasks_list_div " key={"myTask_" + index}>
                <div className="">
                  <Link
                    to={{
                      pathname: "ecardIndex",
                      state: {
                        activeTab: "CardsTab",
                        active: item?.active,
                        isDashbaordData: {
                          value: item?.userId,
                          label: item?.fullName + " - " + item?.role,
                        },
                      },
                    }}
                    className="c-2c2c2c a_hover_txt_deco_none d_mytasks_list"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <p className="mb-2 eep_overflow_ellipsis d_mytasks">
                      <span style={{ textTransform: "capitalize" }}>
                        {item?.message}
                      </span>
                    </p>
                    <button
                      style={{
                        padding: 6,
                        fontSize: 10,
                      }}
                      className="eep-btn eep-btn-success eep-btn-xsml"
                    >
                      {t(`dashboard.Send`)}
                    </button>
                  </Link>
                  <label
                    className="d_mytasks_dt mb-0 opacity-3"
                    style={{
                      textAlign: "start",
                      paddingRight: "20px",
                    }}
                  >
                    {t(`dashboard.${item?.date}`)}
                  </label>
                </div>
                {index !== dashboardDetails?.upcomings?.length - 1 && (
                  <div
                    style={{ borderTop: "1px solid #e1dede" }}
                    className="dropdown-divider"
                  ></div>
                )}
              </div>
            );
          })}
        {dashboardDetails && !dashboardDetails.upcomings?.length && (
          <ResponseInfo
            title={t(`dashboard.No upcomings found`)}
            responseImg="noRecord"
            responseClass="response-info"
          />
        )}
      </div>
    </div>
  );
};

export default Upcomings;
