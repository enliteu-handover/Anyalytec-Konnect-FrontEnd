import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ResponseInfo from "../../UI/ResponseInfo";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import ComposeCardModal from "../../modals/ComposeCardModal";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { clearModalBackdrop } from "../../shared/SharedService";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import AddEcard from "../FormElements/AddEcard";
import ImagePreloader from "./ImagePreloader";

const ECards = ({ isDashbaord, isDashbaordData }) => {

  const [isComposeCardModal, setIsComposeCardModal] = useState(false);
  const userSessionData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};
  const [isLoading, setIsLoading] = useState(true);
  const [composeCardData, setComposeCardData] = useState({
    isSlider: null,
    sliderData: {},
    sliderPostn: 0
  });
  const [cardTemplates, setcardTemplates] = useState([]);
  const [composeCardMessages, setComposeCardMessages] = useState([]);
  const [composeCardCategory, setComposeCardCategory] = useState({});
  const addECardStateObj = {
    birthday: true,
    anniversary: false,
    appreciation: false,
    seasonal: false
  }
  const [addECardState, setAddECardState] = useState(addECardStateObj);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  //const [showModal, setShowModal] = useState({ type: "success", message: "null", celebrations: {isCelebration: true, celebrationItem: "baloon.gif"} });
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "RECOGNITION",
      link: "app/recognition",
    },
    {
      label: "Ecards",
      link: "",
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Recognition",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  });

  var settings = {
    // dots: false,
    // arrows: false,
    // infinite: false,
    // // infinite: true,
    // speed: 500,
    // slidesToShow: 3.5,
    // adaptiveHeight: true,
    // slidesToScroll: 4,
    // padSlides: false,
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3.5,
    slidesToScroll: 4,
    initialSlide: 0,
  };

  const selectImageHandler = (e, carddataa, cat, item) => {
    let obj = {
      isSlider: true,
      sliderData: carddataa,
      sliderPostn: e.target.id,
      selectedCard: item,
    };
    setComposeCardData(obj);
    setIsComposeCardModal(true);
    let ComposeCardCategoryTemp = JSON.parse(JSON.stringify(composeCardCategory));
    ComposeCardCategoryTemp.category = cat;
    setComposeCardCategory(ComposeCardCategoryTemp);
  };

  const getImageData = (arg) => {
    if (arg) {
      let obj = {
        isSlider: false,
        sliderData: arg,
        sliderPostn: 0,
      };
      setComposeCardData(obj);
      setIsComposeCardModal(true);
      let ComposeCardCategoryTemp = JSON.parse(JSON.stringify(composeCardCategory));
      ComposeCardCategoryTemp.category = obj.sliderData.cat;
      setComposeCardCategory(ComposeCardCategoryTemp);
      document.getElementById("trigger-compose-card").click();
    }
  };

  const fetchCardData = async () => {
    setIsLoading(true);
    var groupByCategory;
    const obj = {
      url: URL_CONFIG.ALL_ECARDS,
      method: "get",
    };
    await httpHandler(obj)
      .then((response) => {
        groupByCategory = response?.data?.reduce((group, card) => {
          const { category } = card;
          group[category] = group[category] ?? [];
          group[category].push(card);
          return group;
        }, {});
        setcardTemplates(groupByCategory);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
      });
    return groupByCategory;
  };

  const fetchComposeMessageData = () => {
    const obj = {
      url: URL_CONFIG.ALL_MESSAGES,
      method: "get",
    };
    httpHandler(obj)
      .then((response) => {
        const groupByCategory = response.data.reduce((group, card) => {
          const { category } = card;
          group[category] = group[category] ?? [];
          group[category].push(card);
          return group;
        }, {});
        setComposeCardMessages(groupByCategory);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const fetchUserData = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: "get",
      params: {
        active: true
      }
    };
    httpHandler(obj)
      .then((userData) => {
        let ComposeCardCategoryTemp = JSON.parse(JSON.stringify(composeCardCategory));
        let uDataTemp = [];
        let uEmailDataTemp = [];
        userData.data.length > 0 && userData.data.map((item) => {
          if (userSessionData.id !== item.user_id) {
            uDataTemp.push({ value: item.id, label: item.fullName + " - " + item.department.name });
          }
          return uDataTemp;
        });
        userData.data.length > 0 && userData.data.map((item) => {
          uEmailDataTemp.push({ value: item.id, label: item.email });
          return uEmailDataTemp;
        });
        ComposeCardCategoryTemp.userData = uDataTemp;
        ComposeCardCategoryTemp.userEmailData = uEmailDataTemp;
        setComposeCardCategory(ComposeCardCategoryTemp);
      })
      .catch((error) => {
        console.log("error", error);
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchCardData();
    fetchComposeMessageData();
    fetchUserData();
  }, []);

  useEffect(() => {
    if (isDashbaord) {
      fetchComposeMessageData();
      fetchUserData();
      fetchCardData().then((groupByCategory) => {
        if (isDashbaord === "anniversary") {
          var collapseBirthday = document.getElementById("collapseAnniversary");
          collapseBirthday.classList.add("collapse", "show");
          var collapseBirthday = document.getElementById("collapseBirthday");
          collapseBirthday.classList.remove("show");
          var linkElement = document.querySelector('#headingOne .collapsed');
          linkElement.setAttribute('aria-expanded', 'false');
          cardHeadClick(isDashbaord)
          if (groupByCategory?.anniversary?.length > 0) {
            selectImageHandler({
              target: {
                id: "0"
              }
            }, groupByCategory?.anniversary, 'anniversary', groupByCategory?.anniversary?.[0]);

            // Find the element that triggers the modal
            var modalTriggerElement = document.querySelector('[data-target="#ComposeCardModal"]');
            // Simulate a click event on the element
            if (modalTriggerElement) {
              modalTriggerElement.click();
            }

          }
        } else if (isDashbaord === "birthday") {
          cardHeadClick(isDashbaord)
          if (groupByCategory?.birthday?.length > 0) {
            selectImageHandler({
              target: {
                id: "0"
              }
            }, groupByCategory?.birthday, 'birthday', groupByCategory?.birthday?.[0]);

            // Find the element that triggers the modal
            var modalTriggerElement = document.querySelector('[data-target="#ComposeCardModal"]');
            // Simulate a click event on the element
            if (modalTriggerElement) {
              modalTriggerElement.click();
            }

          }
        }
      })
    }
  }, [])

  const modalSubmitInfo = (arg) => {
    if (arg.status) {
      clearModalBackdrop();
      setIsComposeCardModal(false);
      setShowModal({
        ...showModal,
        type: "success", message: arg.message, celebrations: { isCelebration: true, celebrationItem: "baloon.gif" }
      });
    }
  }

  const cardHeadClick = (arg) => {
    const addCardObj = {
      birthday: true,
      anniversary: false,
      appreciation: false,
      seasonal: false
    }
    const addCardObjTemp = JSON.parse(JSON.stringify(addCardObj));
    addCardObjTemp && Object.keys(addCardObjTemp).map((key) => {
      if (key === arg) {
        addCardObjTemp[key] = true;
      } else {
        addCardObjTemp[key] = false;
      }
      return addCardObjTemp;
    });
    setAddECardState(addCardObjTemp);
  }

  return (
    <React.Fragment>
      {isComposeCardModal && (
        <ComposeCardModal composeCardData={composeCardData} composeCardMessages={composeCardMessages}
          composeCardCategory={composeCardCategory} modalSubmitInfo={modalSubmitInfo} isDashbaord={isDashbaord}
          isDashbaordData={isDashbaordData} />
      )}
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Ok
            </button>
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
      <div className="eep-inner-tasks-div">
        <div id="accordion">
          <div className="card eep-card birthday-card">
            <div className="card-header" id="headingOne" onClick={() => cardHeadClick("birthday")}>
              <h5 className="mb-0">
                <Link
                  to="#"
                  className="collapsed pb-1"//btn btn-link 
                  data-toggle="collapse"
                  data-target="#collapseBirthday"
                  aria-expanded="true"
                  aria-controls="collapseBirthday"
                >
                  Birthday
                </Link>
              </h5>
            </div>
            <div
              id="collapseBirthday"
              className="collapse show"
              aria-labelledby="headingOne"
              data-parent="#accordion"
            >
              <div className="card-body">
                <div className="row birthdy_div">
                  <div className="col-md-9" style={{ paddingRight: "6px" }}>
                    {cardTemplates && cardTemplates.birthday && cardTemplates.birthday.length > 0 && (
                      // <Slider {...settings}>
                      <div className="ecard_sliders">
                        {
                          cardTemplates?.birthday.map((item, index) => {
                            return (
                              <div
                                className="parent_slider_img c1"
                                key={"birthdayTemplate_" + index}
                                data-toggle="modal"
                                data-target="#ComposeCardModal"
                                onClick={(e) =>
                                  selectImageHandler(e, cardTemplates.birthday, 'birthday', item)
                                }
                              >
                                <img
                                  src={item?.imageByte?.image}
                                  className="slider_image"
                                  id={index}
                                  alt="E-Card"
                                  title={item.name}
                                  style={{ height: "180px" }}
                                />
                              </div>
                            );
                          })
                        }
                      </div>
                      // </Slider>
                    )}
                    {isLoading && cardTemplates && !cardTemplates.birthday && (
                      <ImagePreloader />
                    )}
                    {!isLoading && cardTemplates && !cardTemplates.birthday && (
                      <ResponseInfo title="No record found." responseImg="noRecord" responseClass="response-info" />
                    )}
                  </div>
                  <div className="col-md-3" style={{ padding: "0px" }}>
                    {addECardState && addECardState.birthday && (
                      <React.Fragment>
                        <AddEcard getImageData={getImageData} eCardCategory="birthday" />
                        <div id="trigger-compose-card" className="invisible" data-toggle="modal" data-target="#ComposeCardModal"></div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card  eep-card anniversary-card">
            <div className="card-header" id="headingTwo" onClick={() => cardHeadClick("anniversary")}>
              <h5 className="mb-0">
                <Link
                  to="#"
                  className="collapsed pb-1"
                  data-toggle="collapse"
                  data-target="#collapseAnniversary"
                  aria-expanded="false"
                  aria-controls="collapseAnniversary"
                >
                  Work Anniversary
                </Link>
              </h5>
            </div>
            <div
              id="collapseAnniversary"
              className="collapse"
              aria-labelledby="headingTwo"
              data-parent="#accordion"
            >
              <div className="card-body">
                <div className="row annivdy_div">
                  <div className="col-md-9">
                    {cardTemplates && cardTemplates.anniversary && cardTemplates.anniversary.length > 0 && (
                      // <Slider {...settings}>
                      <div className="ecard_sliders">
                        {cardTemplates.anniversary.map((item, index) => {
                          return (
                            <div
                              className="parent_slider_img c1"
                              key={"anniversTemplate_" + index}
                              data-toggle="modal"
                              data-target="#ComposeCardModal"
                              onClick={(e) =>
                                selectImageHandler(e, cardTemplates.anniversary, 'anniversary', item)
                              }
                            >
                              <img
                                src={item?.imageByte?.image}
                                className="slider_image"
                                id={index}
                                alt="E-Card"
                                title={item.name}
                                style={{ height: "180px" }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      // {/* </Slider> */}
                    )}
                    {isLoading && cardTemplates && !cardTemplates.anniversary && (
                      <ImagePreloader />
                    )}
                    {!isLoading && cardTemplates && !cardTemplates.hasOwnProperty("anniversary") && (
                      <ResponseInfo title="No record found." responseImg="noRecord" responseClass="response-info" />
                    )}
                  </div>
                  <div className="col-md-3">
                    {addECardState && addECardState.anniversary && (
                      <React.Fragment>
                        <AddEcard getImageData={getImageData} eCardCategory="anniversary" />
                        <div id="trigger-compose-card" className="invisible" data-toggle="modal" data-target="#ComposeCardModal"></div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card eep-card appreciation-card">
            <div className="card-header" id="headingThree" onClick={() => cardHeadClick("appreciation")}>
              <h5 className="mb-0">
                <Link
                  to="#"
                  className="collapsed pb-1"
                  data-toggle="collapse"
                  data-target="#collapseAppreciation"
                  aria-expanded="false"
                  aria-controls="collapseSeason"
                >
                  Appreciation
                </Link>
              </h5>
            </div>
            <div
              id="collapseAppreciation"
              className="collapse"
              aria-labelledby="headingThree"
              data-parent="#accordion"
              style={{}}
            >
              <div className="card-body">
                <div className="row appreciation_div" style={{}}>
                  <div className="col-md-9">
                    {cardTemplates && cardTemplates.appreciation && cardTemplates.appreciation.length > 0 && (
                      // <Slider {...settings}>
                      <div className="ecard_sliders">
                        {cardTemplates.appreciation.map((item, index) => {
                          return (
                            <div
                              className="parent_slider_img c1"
                              key={"appreciationTemplate_" + index}
                              data-toggle="modal"
                              data-target="#ComposeCardModal"
                              onClick={(e) =>
                                selectImageHandler(e, cardTemplates.appreciation, 'appreciation', item)
                              }
                            >
                              <img
                                src={item?.imageByte?.image}
                                className="slider_image"
                                id={index}
                                alt="E-Card"
                                title={item.name}
                                style={{ height: "180px" }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      // </Slider>
                    )}
                    {isLoading && cardTemplates && !cardTemplates.appreciation && (
                      <ImagePreloader />
                    )}
                    {!isLoading && cardTemplates && !cardTemplates.hasOwnProperty("appreciation") && (
                      <ResponseInfo title="No record found." responseImg="noRecord" responseClass="response-info" />
                    )}
                  </div>
                  <div className="col-md-3">
                    {addECardState && addECardState.appreciation && (
                      <React.Fragment>
                        <AddEcard getImageData={getImageData} eCardCategory="appreciation" />
                        <div id="trigger-compose-card" className="invisible" data-toggle="modal" data-target="#ComposeCardModal"></div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="card eep-card seasonal-card">
            <div className="card-header" id="headingFour" onClick={() => cardHeadClick("seasonal")}>
              <h5 className="mb-0">
                <Link
                  to="#"
                  className="collapsed pb-1"
                  data-toggle="collapse"
                  data-target="#collapseSeason"
                  aria-expanded="false"
                  aria-controls="collapseSeason"
                >
                  Seasonal Greetings
                </Link>
              </h5>
            </div>
            <div
              id="collapseSeason"
              className="collapse"
              aria-labelledby="headingFour"
              data-parent="#accordion"
            >
              <div className="card-body">
                <div className="row seasonal_div">
                  <div className="col-md-9">
                    {cardTemplates && cardTemplates.seasonal && cardTemplates.seasonal.length > 0 && (
                      // <Slider {...settings}>
                      <div className="ecard_sliders">
                        {cardTemplates.seasonal.map((item, index) => {
                          return (
                            <div
                              className="parent_slider_img c1"
                              key={"seasonalTemplate_" + index}
                              data-toggle="modal"
                              data-target="#ComposeCardModal"
                              onClick={(e) =>
                                selectImageHandler(e, cardTemplates.seasonal, "seasonal", item)
                              }
                            >
                              <img
                                src={item?.imageByte?.image}
                                className="slider_image"
                                id={index}
                                alt="E-Card"
                                title={item.name}
                                style={{ height: "180px" }}
                              />
                            </div>
                          );
                        })}
                      </div>
                      // {/* </Slider> */}
                    )}
                    {isLoading && cardTemplates && !cardTemplates.appreciation && (
                      <ImagePreloader />
                    )}
                    {!isLoading && cardTemplates && !cardTemplates.hasOwnProperty("seasonal") && (
                      <ResponseInfo title="No record found." responseImg="noRecord" responseClass="response-info" />
                    )}
                  </div>
                  <div className="col-md-3">
                    {addECardState && addECardState.seasonal && (
                      <React.Fragment>
                        <AddEcard getImageData={getImageData} eCardCategory="seasonal" />
                        <div id="trigger-compose-card" className="invisible" data-toggle="modal" data-target="#ComposeCardModal"></div>
                      </React.Fragment>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ECards;
