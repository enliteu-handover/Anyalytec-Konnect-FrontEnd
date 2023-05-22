import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import PageHeader from "../../UI/PageHeader";
// import { httpHandler } from "../../http/http-interceptor";
// import { URL_CONFIG } from "../../constants/rest-config";

const Redeem = () => {

  // const [redeemData, setRedeemData] = useState(null);
  // const [data, setData] = useState(null);
  const [showGiftCardsAll, setShowGiftCardsAll] = useState(false);
  const [showMerchandiseAll, setShowMerchandiseAll] = useState(false);

  const dispatch = useDispatch();

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Rewards",
      link: "app/points",
    },
    {
      label: "Redeem",
      link: "app/redeem",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Redeem",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  });



  const fetchRedeem = () => {
    // let obj;
    // obj = {
    //   url: URL_CONFIG.,
    //   method: "get"
    // };
    // httpHandler(obj).then((response) => {
    //   console.log("fetchPoints API response :", response.data);
    //   setPointsList(response.data);
    // }).catch((error) => {
    //   console.log("fetchPoints error", error);
    //   //const errMsg = error.response?.data?.message;
    // });
  };

  const clickHandler = (arg) => {
    if (arg) {
      setShowGiftCardsAll((pre) => !pre);
    } else if (!arg) {
      setShowMerchandiseAll((pre) => !pre);
    }
  };

  useEffect(() => {
    fetchRedeem();
  }, []);

  return (

    <React.Fragment>

      <PageHeader title={`Redeem my enlite points`} />

      <div className="row eep-content-start no-gutters">

        <div className="col-md-12 redeemCards_topdiv mb-3">

          <div className="d-flex">
            <label className="redeemCards_label font-helvetica-m">Gift Cards</label>
            <label className="mypoints_label font-helvetica-m ml-auto"><span className="small mr-2">Available Points</span>0</label>
          </div>

          {!showGiftCardsAll &&
            <div className="redeemCard_div_min">
              <div className="row">
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-5.svg"} className="redeem_icon" alt="Google play" title="Google play" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Google play</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb giftRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-2.svg"} className="redeem_icon" alt="Adidas" title="Adidas" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Adidas</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb giftRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-3.svg"} className="redeem_icon" alt="Amazon" title="Amazon" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Amazon</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb giftRedeemBtn" >Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-4.svg"} className="redeem_icon" alt="Netflix" title="Netflix" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Netflix</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb giftRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {/* <!-- Minimal Gift cards display END --> */}

          {/* <!-- Maximum Gift cards display START --> */}

          {showGiftCardsAll &&
            <div className="redeemCard_div_all">
              <div className="row">
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-5.svg"} className="redeem_icon" alt="Google play" title="Google play" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Google play</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb giftRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-2.svg"} className="redeem_icon" alt="Adidas" title="Adidas" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Adidas</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb giftRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-3.svg"} className="redeem_icon" alt="Amazon" title="Amazon" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Amazon</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb giftRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-1.svg"} className="redeem_icon" alt="Play Station" title="Play Station" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Play
                          Station</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb giftRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-4.svg"} className="redeem_icon" alt="Netflix" title="Netflix" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Netflix</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb giftRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          {/* <!-- Maximum Gift cards display START --> */}

          {/* <!--  endo of hard coded gifts --> */}

          <div className="d-flex justify-content-end">
            <span className="c-2c2c2c font-helvetica-r a_hover_txt_deco_none giftCards_all c1" onClick={() => clickHandler(true)}>{showGiftCardsAll ? "View Less" : "View All"}</span>
          </div>

        </div>

        <div className="col-md-12 merchandise_topdiv">

          <div className="d-flex">
            <label className="redeemCards_label font-helvetica-m">Merchandise</label>
            <label className="mypoints_label font-helvetica-m ml-auto"><span className="small mr-2">Available Points</span>0</label>
          </div>

          {!showMerchandiseAll &&
            <div className="merchandise_div_min">
              <div className="row">
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-5.svg"} className="redeem_icon" alt="Google play" title="Google play" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Google play</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb merchandiseRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-2.svg"} className="redeem_icon" alt="Adidas" title="Adidas" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Adidas</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb merchandiseRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-3.svg"} className="redeem_icon" alt="Amazon" title="Amazon" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Amazon</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb merchandiseRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-4.svg"} className="redeem_icon" alt="Netflix" title="Netflix" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Netflix</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb merchandiseRedeemBtn" id="4">Redeem</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          {/* <!-- Minimal Merchandise display END --> */}

          {/* <!-- Maximum Merchandise display START --> */}

          {showMerchandiseAll &&
            <div className="merchandise_div_all">
              <div className="row">
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-5.svg"} className="redeem_icon" alt="Google play" title="Google play" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Google play</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb merchandiseRedeemBtn" id="5">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-2.svg"} className="redeem_icon" alt="Adidas" title="Adidas" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Adidas</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb merchandiseRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-3.svg"} className="redeem_icon" alt="Amazon" title="Amazon" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Amazon</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb merchandiseRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-1.svg"} className="redeem_icon" alt="Play Station" title="Play Station" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Play
                          Station</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb merchandiseRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
                <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                  <div className="redeemCard_col_div">
                    <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                      <div className="redeemCard_inner1">
                        <div className="redeem_icon_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/redeem/Redeem-4.svg"} className="redeem_icon" alt="Netflix" title="Netflix" />
                        </div>
                        <label className="redeemIcon_label font-helvetica-m">Netflix</label>
                      </div>
                      <div className="redeemCard_inner2">
                        <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                          <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                          <span className="enlite_val font-helvetica-m">500</span>
                        </label> <span className="enlite_val font-helvetica-m">+</span> <span className="enlite_val font-helvetica-m">$0</span>
                      </div>
                    </div>
                    <div className="redeemBtn_div text-center">
                      <button className="eep-btn eep-btn-tb merchandiseRedeemBtn">Redeem</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }
          {/* <!-- Maximum Merchandise display START --> */}

          {/* <!--  end of hard code merchandise --> */}

          <div className="d-flex justify-content-end">
            <span className="c-2c2c2c font-helvetica-r a_hover_txt_deco_none merchandise_all c1" onClick={() => clickHandler(false)}>{showMerchandiseAll ? "View Less" : "View All"}</span>
          </div>

        </div>

      </div>

    </React.Fragment>
  )
}

export default Redeem;