import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Slider from "react-slick";
import PageHeader from "../../UI/PageHeader";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import RedomModal from "../../modals/reedom";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import "./style.css";
import { fetchUserPermissions } from "../../helpers";

const categoryCampleJson = [
  {
    "id": 1,
    "name": "Amazon Shopping Voucher",
    "url": "",
    "description": "Amazon Shopping voucher is redeemable across all physical goods purchase on Amazon.in. It's not redeemable on Digital Goods & Amazon Pay Categories. For detailed Terms & Conditions, please visit: https://www.woohoo.in/amazon-shopping-voucher-terms",
    "images": {
      "image": "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png",
      "thumbnail": "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png",
    },
    "subcategoriesCount": 0,
    "subcategories": []
  }
];

const productSampleJson = [
  {
    "id": 1,
    "sku": "EGCGBAMZSV001",
    "name": "Amazon Shopping Voucher",
    "description": "Only UPI can be used to buy Amazon Pay E-Gift Card",
    "price": {
      "price": "100",
      "type": "",
      "min": null,
      "max": null,
      "denominations": [],
      "currency": {
        "code": "INR",
        "symbol": "₹",
        "numericCode": "356"
      }
    },
    "kycEnabled": null,
    "allowed_fulfillments": [],
    "additionalForm": null,
    "metaInformation": {},
    "type": "DIGITAL",
    "schedulingEnabled": false,
    "currency": "356",
    "images": {
      "thumbnail": "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/3/1/312x200_20092022_1_4.png",
      "mobile": "https://d1o7uku192uawx.cloudfront.net/mobile/media/cardimage/amazon_312x200_21092022_3110.png",
      "base": "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png",
      "small": "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png"
    },
    "tnc": {},
    "categories": [
      1
    ],
    "themes": [],
    "handlingCharges": null,
    "reloadCardNumber": false,
    "expiry": null,
    "formatExpiry": null,
    "discounts": [
      {
        "startDate": "2023-11-16T18:30:00+0000",
        "endDate": "2023-12-15T18:29:59+0000",
        "discount": {
          "type": "by_percent",
          "amount": 3,
          "desc": "Flat 3% OFF | Applicable on payment via UPI |"
        },
        "coupon": {
          "code": "ASV3"
        },
        "priority": 1
      },
      {
        "startDate": "2023-11-16T18:30:00+0000",
        "endDate": "2023-12-15T18:29:59+0000",
        "discount": {
          "type": "by_percent",
          "amount": 2,
          "desc": "Flat 2% Off | Applicable on payment via UPI, Debit Card, Credit Card & Net Banking "
        },
        "coupon": {
          "code": "ASV2"
        },
        "priority": 2
      }
    ],
    "relatedProducts": [],
    "storeLocatorUrl": null,
    "brandName": null,
    "etaMessage": "",
    "payout": {},
    "createdAt": "",
    "updatedAt": "",
    "cpg": {}
  },
];

const Redeem = () => {

  const history = useHistory();
  const userDetails = sessionStorage.getItem('userData')
  const [showGiftCardsAll, setShowGiftCardsAll] = useState(false);
  const [state, setState] = useState({
    data: [],
    product: [],
    model: false
  });

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
    // axios.get(`${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL}/api/v1${URL_CONFIG.GIFT_VOUCHER}`)
    //   .then(response => {
    //     console.log('Qwik gifts---', response?.data);
    setState({ ...state, data: categoryCampleJson, product: productSampleJson })
    // })
    // .catch(error => {
    //   console.error(error);
    // });
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

  const clickHandler = () => {
    setShowGiftCardsAll((pre) => !pre);
  };

  useEffect(() => {
    fetchRedeem();
  }, []);

  const reedPoints = (data) => {
    state.model = true
    setState({ ...state })
    setTimeout(async () => {
      state.model = false
      setState({ ...state })
      await saveRedeemption(data);
      let collections = document.getElementsByClassName("modal-backdrop");
      for (var i = 0; i < collections.length; i++) {
        collections[i].remove();
      }
    }, 2000);

  };

  const saveRedeemption = async (data) => {
    const obj = {
      url: URL_CONFIG.POST_REDEEM,
      method: "post",
      payload: {
        points: data?.price?.price, name: data?.name, image: data?.images?.thumbnail,
        redeem_details: data ?? null
      },
    };
    await httpHandler(obj)
    fetchUserPermissions(dispatch)
    history.push('/app/my-redeem');
  }

  var settings = {
    dots: false,
    arrows: false,
    infinite: true,
    slidesToShow: 1,
  };

  return (

    <React.Fragment>

      {state?.model &&
        <RedomModal />
      }

      <PageHeader title={`Redeem my enlite points`} />

      <Slider {...settings}>
        {state?.data?.map((item) => {
          return <div className="category_button">{item?.name}</div>
        })}
      </Slider>

      <div className="row eep-content-start no-gutters">

        <div className="col-md-12 redeemCards_topdiv mb-3">

          <div className="d-flex">
            <label className="redeemCards_label font-helvetica-m">Gift Cards</label>
            <label className="mypoints_label font-helvetica-m ml-auto"><span className="small mr-2">Available Points</span>{JSON.parse(userDetails)?.allPoints ?? 0}</label>
          </div>

          {!showGiftCardsAll &&
            <div className="redeemCard_div_min">
              <div className="row">
                {state?.product?.map((item) => {
                  const currentDate = new Date();
                  item?.discounts?.sort((a, b) => b.priority - a.priority);
                  const firstActiveDiscount = item?.discounts.find((discount) => {
                    const startDate = new Date(discount.startDate);
                    const endDate = new Date(discount.endDate);

                    return startDate <= currentDate && currentDate <= endDate;
                  });

                  return <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                    <div className="redeemCard_col_div">
                      <div className="redeemCard_inner_div" style={{ height: "285px" }}>
                        <div className="redeemCard_inner1">
                          <div className="redeem_icon_div">
                            <img src={item?.images?.thumbnail} className="redeem_icon" alt="Google play" title="Google play" />
                          </div>
                          <label className="redeemIcon_label font-helvetica-m">{item?.name}</label>
                          <label className="redeemIcon_label font-helvetica-m discription">{item?.description}</label>
                        </div>
                        <div className="redeemCard_inner2">
                          <label className="redeemEnlite_value mb-0 d-flex justify-content-center">
                            <img src={process.env.PUBLIC_URL + "/images/icons/enlite-point-symbol.svg"} className="enlite_point_icon mr-1" alt="Enlite Point Symbol" title="Enlite Point" />
                            <span className="enlite_val font-helvetica-m">Redeem upto {item?.price?.currency?.symbol} {item?.price?.price}</span>
                          </label>
                        </div>
                      </div>
                      <div className="redeemBtn_div text-center">

                        {item?.price?.price <= (JSON.parse(userDetails)?.allPoints ?? 0) ?
                          <a
                            style={{
                              marginBottom: 14,
                              marginRight: 10,
                              color: "#fff"
                            }}
                            className="eep-btn eep-btn-success eep-btn-xsml add_bulk_upload_button c1"
                            data-toggle="modal"
                            data-target="#RedomModal"
                            onClick={() => reedPoints(item)}
                          >Redeem</a> :
                          <button className="eep-btn eep-btn-tb giftRedeemBtn">Redeem</button>}
                      </div>
                    </div>
                  </div>
                })}
              </div>
            </div>
          }

          <div className="d-flex justify-content-end">
            <span className="c-2c2c2c font-helvetica-r a_hover_txt_deco_none giftCards_all c1" onClick={() => clickHandler()}>{showGiftCardsAll ? "View Less" : "View All"}</span>
          </div>

        </div>

      </div>

    </React.Fragment >
  )
}

export default Redeem;