import React, { useEffect, useState } from "react";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import ResponseInfo from "../../UI/ResponseInfo";
import ShareToWall from "../../modals/ShareToWall";
import PageHeader from "../../UI/PageHeader";
import YearFilter from "../../UI/YearFilter";
import { formatDate } from "../../shared/SharedService";

const MyBadge = () => {

  const yrDt = new Date().getFullYear();
  const [yearFilterValue, setYearFilterValue] = useState({ filterby: yrDt });
  const [myAwardData, setMyAwardData] = useState([]);
  const [myAwardModalShow, setMyAwardModalShow] = useState(false);
  const [shareAwardID, setShareAwardID] = useState(null);

  const fetchMyAwardData = (paramData = {}) => {
    const obj = {
      url: URL_CONFIG.MY_AWARDS,
      method: "get",
    };
    if (paramData && Object.keys(paramData).length > 0) {
      obj["params"] = paramData;
    }
    httpHandler(obj)
      .then((aData) => {
        setMyAwardData([...aData.data]);
      })
      .catch((error) => {
        console.log("MyAward error", error.response?.data?.message);
      });
  };

  useEffect(() => {
    fetchMyAwardData({ filterby: yearFilterValue?.filterby });
  }, []);

  const getMyHashTag = (arg) => {
    const arr = [];
    arg.map(res => {
      arr.push(res.hashtagName)
    });
    return arr.join(', ');
  }

  const MyAwardModalHandler = (arg) => {
    setMyAwardModalShow(true);
    setShareAwardID(arg);
  }

  const onFilterChange = (filterValue) => {
    setYearFilterValue({ filterby: filterValue.value });
    fetchMyAwardData({ filterby: filterValue.value });
  }

  return (
    <React.Fragment>
      <PageHeader title="My Awards"
        filter={
          <YearFilter onFilterChange={onFilterChange} />
        }
      />
      {myAwardModalShow && (<ShareToWall ShareID={shareAwardID} fetchMyData={fetchMyAwardData} />)}
      <div className={`${myAwardData.length <= 0 ? "h-100 " : "mt-4"} row eep-content-start eep-mybadge-div`} id="content-start">
        {myAwardData && myAwardData.length > 0 && myAwardData.map((data, index) => (
          <div className="col-md-4 col-lg-3 col-xs-4 col-sm-6 text-left badge_col_div card-container" key={'MyBadge_' + index}>
            <div className="card-flip">
              <div className="badge_assign_div card front">
                <div className="outter">
                  <img
                    src={data?.imageByte?.image ? data.imageByte.image : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`}
                    className="badge_img"
                    alt="Performer"
                    title="Performer"
                  />
                </div>
                <div className="p-2">
                  <div className="badge_info_div">
                    <p className="badge_info font-helvetica-m">{data.award ? data.award.name : ""}</p>
                    {data?.award?.hashTag?.length > 0 && (
                      <p className="badge_info eep_truncate" style={{ maxWidth: "100%" }}>{data?.award?.hashTag?.length > 0 ? getMyHashTag(data?.award?.hashTag) : "---"}</p>
                    )}
                    <p className="badge_info font-helvetica-m">{data.award ? (data.award.points + " pts") : ""}</p>
                  </div>
                </div>
              </div>
              <div className="card back rewards_backside_list_div">
                <div className="card-block h-100">
                  <div className="d-flex flex-column p-2 h-100">
                    {data.wallPost && (
                      <div className="c1 d-flex justify-content-end" >
                        <img
                          src={`${process.env.PUBLIC_URL}/images/icons/static/reply.svg `}
                          className=""
                          alt="Share"
                          title="Social Wall Share"
                          onClick={() => MyAwardModalHandler(data.id)}
                          data-toggle="modal"
                          data-target="#ShareToWall"
                        />
                      </div>
                    )}
                    <div className="rewards_backside_list_row flex-column h-100 ">
                      <h6 className="b_r_flip_nm font-helvetica-m">{data?.createdBy?.fullName}</h6>
                      <div className="d-flex flex-column flex-grow-1">
                        <div className="flex-grow-1 eep_scroll_y" style={{ maxHeight: "125px" }}>
                          <p className="b_r_flip_msg">{data.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="b_r_flip_dt mb-0">{data.createdAt ? formatDate(data.createdAt) : ""}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        {myAwardData && myAwardData.length <= 0 && (
          <ResponseInfo title="Yet to earn awards" responseImg="noRecord" responseClass="response-info" />
        )}
      </div>
    </React.Fragment>
  );
};
export default MyBadge;