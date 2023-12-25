/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import PageHeader from "../../UI/PageHeader";
import { URL_CONFIG } from "../../constants/rest-config";
import { fetchUserPermissions, getCurrencyForCounty } from "../../helpers";
import { httpHandler } from "../../http/http-interceptor";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import RedomModalDetails from "../../modals/redeemDetails";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { userProfile } from "../../store/user-profile";
import "./style.css";

const categoryCampleJson = [
  {
    id: 1,
    name: "Travel",
  }, {
    id: 1,
    name: "Amazon Shopping Voucher",
  },
  {
    id: 1,
    name: "Home Furnishings",
  }, {
    id: 1,
    name: "Gaming",
  },
  {
    id: 1,
    name: "Entertainment",
  }, {
    id: 1,
    name: "Health & Beauty",
  },
  {
    id: 1,
    name: "Electronics",
  }, {
    id: 1,
    name: "Food & Beverages",
  },
];

const productSampleJson = [
  {
    "id": 1,
    "sku": "EGCGBAMZSV001",
    "name": "Apollo Pharmacy E-Gift(Instant Voucher)",
    "description": "Flat 12% OFF | Applicable on payment via UPI AJIO E-Gift Card – A Style Treat For Everyone! Welcome to AJIO - India’s favourite online shopping destination. Indulge in the world of fashion with the best of global brands, home-grown labels and the trendiest international styles, with just a click. ",
    "price": {
      "price": "10",
      "type": "",
      "min": "10",
      "max": "10000",
      "denominations": [],
      "currency": {
        "code": "INR",
        "symbol": "₹",
        "numericCode": "356"
      }
    },
    kycEnabled: null,
    allowed_fulfillments: [],
    additionalForm: null,
    metaInformation: {},
    type: "DIGITAL",
    schedulingEnabled: false,
    currency: "356",
    images: {
      thumbnail:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/3/1/312x200_21_8.png",
      mobile:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/cardimage/amazon_312x200_21092022_3110.png",
      base: "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png",
      small:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png",
    },
    tnc: {},
    categories: [1],
    themes: [],
    handlingCharges: null,
    reloadCardNumber: false,
    expiry: null,
    formatExpiry: null,
    discounts: [
      {
        startDate: "2023-11-16T18:30:00+0000",
        endDate: "2024-12-15T18:29:59+0000",
        discount: {
          type: "by_percent",
          amount: 3,
          desc: "Flat 8% OFF | Applicable on payment via Credit Card, Debit Card, UPI, Net Banking & Amazon Pay Wallet | USE CODE: DM8",
        },
        coupon: {
          code: "ASV3",
        },
        priority: 1,
      },
      {
        startDate: "2023-11-16T18:30:00+0000",
        endDate: "2023-12-15T18:29:59+0000",
        discount: {
          type: "by_percent",
          amount: 2,
          desc: "Flat 2% Off | Applicable on payment via UPI, Debit Card, Credit Card & Net Banking ",
        },
        coupon: {
          code: "ASV2",
        },
        priority: 2,
      },
    ],
    relatedProducts: [],
    storeLocatorUrl: null,
    brandName: null,
    etaMessage: "",
    payout: {},
    createdAt: "",
    updatedAt: "",
    cpg: {},
  },
  {
    "id": 2,
    "sku": "EGCGBAMZSV001",
    "name": "MakeMyTrip E-Gift (Instant Voucher)",
    "description": "Flat 5.5% OFF | Applicable on payment via UPI, AJIO E-Gift Card – A Style Treat For Everyone! Welcome to AJIO - India’s favourite online shopping destination. Indulge in the world of fashion with the best of global brands, home-grown labels and the trendiest international styles, with just a click. ",
    "price": {
      "price": "10",
      "type": "",
      "min": "10",
      "max": "10000",
      "denominations": [],
      "currency": {
        "code": "INR",
        "symbol": "₹",
        "numericCode": "356"
      }
    },
    kycEnabled: null,
    allowed_fulfillments: [],
    additionalForm: null,
    metaInformation: {},
    type: "DIGITAL",
    schedulingEnabled: false,
    currency: "356",
    images: {
      thumbnail:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/3/1/312x200_copy100072234.png",
      mobile:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/cardimage/amazon_312x200_21092022_3110.png",
      base: "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png",
      small:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png",
    },
    tnc: {},
    categories: [1],
    themes: [],
    handlingCharges: null,
    reloadCardNumber: false,
    expiry: null,
    formatExpiry: null,
    discounts: [
      {
        startDate: "2023-11-16T18:30:00+0000",
        endDate: "2024-12-15T18:29:59+0000",
        discount: {
          type: "by_percent",
          amount: 3,
          desc: "Flat 8% OFF | Applicable on payment via Credit Card, Debit Card, UPI, Net Banking & Amazon Pay Wallet | USE CODE: DM8",
        },
        coupon: {
          code: "ASV3",
        },
        priority: 1,
      },
      {
        startDate: "2023-11-16T18:30:00+0000",
        endDate: "2023-12-15T18:29:59+0000",
        discount: {
          type: "by_percent",
          amount: 2,
          desc: "Flat 2% Off | Applicable on payment via UPI, Debit Card, Credit Card & Net Banking ",
        },
        coupon: {
          code: "ASV2",
        },
        priority: 2,
      },
    ],
    relatedProducts: [],
    storeLocatorUrl: null,
    brandName: null,
    etaMessage: "",
    payout: {},
    createdAt: "",
    updatedAt: "",
    cpg: {},
  },
  {
    "id": 3,
    "sku": "EGCGBAMZSV001",
    "name": "Swiggy Money E-Gift Card(Instant Voucher)",
    "description": "Flat 3% OFF | Applicable on payment via Debit Card, AJIO E-Gift Card – A Style Treat For Everyone! Welcome to AJIO - India’s favourite online shopping destination. Indulge in the world of fashion with the best of global brands, home-grown labels and the trendiest international styles, with just a click. ",
    "price": {
      "price": "10",
      "type": "",
      "min": "10",
      "max": "10000",
      "denominations": [],
      "currency": {
        "code": "INR",
        "symbol": "₹",
        "numericCode": "356"
      }
    },
    kycEnabled: null,
    allowed_fulfillments: [],
    additionalForm: null,
    metaInformation: {},
    type: "DIGITAL",
    schedulingEnabled: false,
    currency: "356",
    images: {
      thumbnail:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/c/a/card_swiggy.png",
      mobile:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/cardimage/amazon_312x200_21092022_3110.png",
      base: "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png",
      small:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png",
    },
    tnc: {},
    categories: [1],
    themes: [],
    handlingCharges: null,
    reloadCardNumber: false,
    expiry: null,
    formatExpiry: null,
    discounts: [
      {
        startDate: "2023-11-16T18:30:00+0000",
        endDate: "2024-12-15T18:29:59+0000",
        discount: {
          type: "by_percent",
          amount: 3,
          desc: "Flat 8% OFF | Applicable on payment via Credit Card, Debit Card, UPI, Net Banking & Amazon Pay Wallet | USE CODE: DM8",
        },
        coupon: {
          code: "ASV3",
        },
        priority: 1,
      },
      {
        startDate: "2023-11-16T18:30:00+0000",
        endDate: "2023-12-15T18:29:59+0000",
        discount: {
          type: "by_percent",
          amount: 2,
          desc: "Flat 2% Off | Applicable on payment via UPI, Debit Card, Credit Card & Net Banking ",
        },
        coupon: {
          code: "ASV2",
        },
        priority: 2,
      },
    ],
    relatedProducts: [],
    storeLocatorUrl: null,
    brandName: null,
    etaMessage: "",
    payout: {},
    createdAt: "",
    updatedAt: "",
    cpg: {},
  },
  {
    "id": 4,
    "sku": "EGCGBAMZSV001",
    "name": "AJIO E-Gift(Instant Voucher)",
    "description": "Flat 5% off. Applicable on payment via UPI. AJIO E-Gift Card – A Style Treat For Everyone! Welcome to AJIO - India’s favourite online shopping destination. Indulge in the world of fashion with the best of global brands, home-grown labels and the trendiest international styles, with just a click. ",
    "price": {
      "price": "10",
      "type": "",
      "min": "10",
      "max": "10000",
      "denominations": [],
      "currency": {
        "code": "INR",
        "symbol": "₹",
        "numericCode": "356"
      }
    },
    kycEnabled: null,
    allowed_fulfillments: [],
    additionalForm: null,
    metaInformation: {},
    type: "DIGITAL",
    schedulingEnabled: false,
    currency: "356",
    images: {
      thumbnail:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/3/1/312x200ajiob2c.png",
      mobile:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/cardimage/amazon_312x200_21092022_3110.png",
      base: "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png",
      small:
        "https://d1o7uku192uawx.cloudfront.net/mobile/media/catalog/product/a/m/amazon_312x200_21092022_2.png",
    },
    tnc: {},
    categories: [1],
    themes: [],
    handlingCharges: null,
    reloadCardNumber: false,
    expiry: null,
    formatExpiry: null,
    discounts: [
      {
        startDate: "2023-11-16T18:30:00+0000",
        endDate: "2024-12-15T18:29:59+0000",
        discount: {
          type: "by_percent",
          amount: 3,
          desc: "Flat 8% OFF | Applicable on payment via Credit Card, Debit Card, UPI, Net Banking & Amazon Pay Wallet | USE CODE: DM8",
        },
        coupon: {
          code: "ASV3",
        },
        priority: 1,
      },
      {
        startDate: "2023-11-16T18:30:00+0000",
        endDate: "2023-12-15T18:29:59+0000",
        discount: {
          type: "by_percent",
          amount: 2,
          desc: "Flat 2% Off | Applicable on payment via UPI, Debit Card, Credit Card & Net Banking ",
        },
        coupon: {
          code: "ASV2",
        },
        priority: 2,
      },
    ],
    relatedProducts: [],
    storeLocatorUrl: null,
    brandName: null,
    etaMessage: "",
    payout: {},
    createdAt: "",
    updatedAt: "",
    cpg: {},
  },
];

const Redeem = () => {
  const history = useHistory();
  const userDetails = sessionStorage.getItem("userData");
  const redeemPointsDetails = useSelector(
    (state) => state.storeState.userProfile
  );
  const [showGiftCardsAll, setShowGiftCardsAll] = useState(false);
  const [showModal, setShowModal] = useState({ type: null, message: null, isCelebration: true });
  const [searchUser, setSearchUser] = useState("");
  const [state, setState] = useState({
    data: [],
    product: [],
    model: false,
    isEdit: {},
    qty: 1,
    points: {}
  });

  const dispatch = useDispatch();

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Catalog",
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
    state['data'] = categoryCampleJson
    state['product'] = productSampleJson
    setState({ ...state })
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

  const getPointsValue = async () => {

    const obj = {
      url: URL_CONFIG.GET_POINTS_VALUE,
      method: "get"
    };
    const data = await httpHandler(obj)
    state['points'] = data?.data?.data ?? {}
    setState({ ...state });
  }

  useEffect(() => {
    fetchRedeem();
    getPointsValue()
  }, []);

  const redeemPonts = async (data) => {

    state.model = false
    setState({ ...state })
    await saveRedeemption(data);
    dispatch(userProfile.updateState(state ?? ''))
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }

  };

  const reedPointsModel = (data) => {

    state.model = true
    state.isEdit = data
    setState({ ...state })
  }

  const saveRedeemption = async (data) => {
    const obj = {
      url: URL_CONFIG.POST_REDEEM,
      method: "post",
      payload: {
        points: data?.price?.price,
        name: data?.name,
        image: data?.images?.thumbnail,
        coupon: data?.coupon,
        redeem_details: data ?? null,
      },
    };
    await httpHandler(obj);
    setShowModal({
      ...showModal, type: "success", message: <div>
        Your redeem coupon is attached below and also sent mail!. Please copy it and go to your account, then add it to use.<br />
        <div className="copy-button">
          <input id="copyvalue" type="text" disabled value="AVO0A090292" />
          <button onClick={() => copyIt()} className="copybtn">COPY</button>
        </div>
      </div>,
      celebrations: { isCelebration: true, celebrationItem: "partypapers.gif" }
    });
    fetchUserPermissions(dispatch);
  };

  const copyIt = () => {
    let copybtn = document.querySelector(".copybtn");
    let copyInput = document.querySelector('#copyvalue');
    copyInput.select();
    document.execCommand("copy");
    copybtn.textContent = "COPIED";
  }


  const handleChange = (value, price) => {

    if (!value) {
      state.qty = ''
      setState({ ...state })
      return
    }

    const user_points = (((JSON.parse(userDetails)?.allPoints ?? 0)) * parseInt(state?.points?.value_peer_points)) ?? 0;
    const multi = getCurrencyForCounty(
      JSON.parse(sessionStorage.getItem('userData'))?.countryDetails?.country_name ?? ''
      , user_points, parseInt(value))

    if (parseInt(price?.max) < multi) {
      return;
    } else {
      state.qty = value;
      setState({ ...state });
    }
  };

  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const openModal = () => {
    // window.location.href = "/app/my-redeem";
    window.location.reload();
  };


  const filterData = searchUser ?
    state?.product?.filter((item) => item?.name?.toLowerCase()?.includes(searchUser?.toLowerCase()))
    : state?.product

  return (
    <React.Fragment>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <div onClick={openModal}>
              <button className="eep-btn eep-btn-success">Close</button>
            </div>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          }
        ></EEPSubmitModal>
      )}

      {state?.model &&
        <RedomModalDetails qty={state?.qty ?? ''}
          userDetails={userDetails} data={state?.isEdit}
          value_peer_points={parseInt(state?.points?.value_peer_points)}
          handleChange={handleChange} redeemPonts={redeemPonts} />
      }

      <PageHeader title={`Redeem My Enlite Points`} />

      <div className="category">
        {state?.data?.map((item, i) => {
          return <div className={`category_button ${i == 0 && 'select'}`}>{item?.name}</div>;
        })}
      </div>

      <div className="search_input input-group custom-search-form" style={{
        border: '1px solid #d3d3d34f',
        borderRadius: '4px'
      }}>
        <input
          type="text"
          className="form-control search_users_b px-3"
          placeholder="search..."
          value={searchUser}
          onChange={(e) => setSearchUser(e.target.value)}
        />
        <span className="input-group-btn">
          <button className="btn btn-default" type="button">
            <img
              src={`${process.env.PUBLIC_URL}/images/icons/search.svg`}
              className="search_users_b_box c1"
              width="20"
              alt="Search Participants"
            />
          </button>
        </span>
      </div>

      <div className="row eep-content-start no-gutters">
        <div className="col-md-12 redeemCards_topdiv mb-3">

          {!showGiftCardsAll && (
            <div className="redeemCard_div_min">
              <div className="row" style={{ flexWrap: "wrap" }}>
                {filterData?.map((item) => {
                  const currentDate = new Date();
                  item?.discounts?.sort((a, b) => b.priority - a.priority);
                  const firstActiveDiscount = item?.discounts.find(
                    (discount) => {
                      const startDate = new Date(discount.startDate);
                      const endDate = new Date(discount.endDate);
                      return startDate <= currentDate && currentDate <= endDate;
                    }
                  );
                  return (
                    item?.price?.price <=
                      (((JSON.parse(userDetails)?.allPoints ?? 0))
                        * parseInt(state?.points?.value_peer_points)) ?
                      <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3">
                        <a
                          data-toggle="modal"
                          data-target="#RedomModalDetails"
                          className="list-item"
                          onClick={() => reedPointsModel({ ...item, coupon: firstActiveDiscount?.coupon?.code })}
                        >
                          <div className="list-content" style={{ cursor: 'pointer' }}>
                            <div className="redeem_icon_div">
                              <div class="ribbon-2">12% OFF</div>
                              <img
                                src={item?.images?.thumbnail}
                                className="redeem_icon"
                                alt="Google play"
                                title="Google play"
                                width={'100%'}
                                height={'100%'}
                              />
                            </div>
                            <div className="content">
                              <label className="redeemIcon_label font-helvetica-m titlesx">
                                {item?.name}
                              </label>
                              {/* <label className="redeemIcon_label font-helvetica-m discription">
                                {item?.description}
                              </label> */}
                            </div>
                          </div>
                        </a>  </div>
                      :
                      <div className="col-sm-6 col-xs-6 col-md-3 col-lg-3 col-xl-3 list-item">
                        <div className="list-content" style={{
                          opacity: '0.6',
                          background: '#80808052'
                        }}>
                          <div className="redeem_icon_div">
                            <div class="ribbon-2">12% OFF</div>
                            <img
                              src={item?.images?.thumbnail}
                              className="redeem_icon"
                              alt="Google play"
                              title="Google play"
                              width={'100%'}
                              height={'100%'}
                            />
                          </div>
                          <div className="content">
                            <label className="redeemIcon_label font-helvetica-m titlesx">
                              {item?.name}
                            </label>
                            {/* <label className="redeemIcon_label font-helvetica-m discription">
                                {item?.description}
                              </label> */}
                          </div>
                        </div>
                      </div>
                  );
                })}
              </div>
            </div>
          )}

          {filterData?.length === 0 && <div style={{ textAlign: "center" }}>No Data!.</div>}
        </div>
      </div>
    </React.Fragment >
  );
};

export default Redeem;
