import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../UI/PageHeader";
import ResponseInfo from "../../UI/ResponseInfo";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import CreateFeedbackModal from "../../modals/feed";
// import { BreadCrumbActions } from "../../store/breadcrumb-slice";
// import { TabsActions } from "../../store/tabs-slice";
import FeedbackDetailView from "./feedbackDetailView";
import FeedbackList from "./feedbackList";
// import MyFeedback from "./myFeedback";
import TypeBasedFilter from "../../UI/TypeBasedFilter";
import { TYPE_BASED_FILTER } from "../../constants/ui-config";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import "./style.scss";

const Feedback = () => {
  const yrDt = new Date().getFullYear();
  const dispatch = useDispatch();

  const [allfeedback, setFeedbacks] = useState([]);
  const [allSearchfeedback, setSearchFeedbacks] = useState([]);
  const [feedFilter, setFeedFilter] = useState({
    label: "All Post",
    value: 'allpost'
  });

  const [deptOptions, setDeptOptions] = useState([]);
  const [search, setsearch] = useState('');
  const [usersPic, setUsersPic] = useState([]);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [ideaData, setIdeaData] = useState(null);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [filterParams, setFilterParams] = useState({});

  const CloseFunction = () => {
    setCreateModalShow(!createModalShow)
  }
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const fetchDepartmentData = () => {
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS,
      method: "get",
      params: { active: true },
    };
    httpHandler(obj)
      .then((deptData) => {
        let optionsTemp = [];
        deptData.data.map((deptValue) => {
          return optionsTemp.push({ value: deptValue.id, label: deptValue.name });
        })
        setDeptOptions(optionsTemp);
      })
      .catch((error) => {
        console.log("fetchDepartmentData error", error);
      });
  }

  const fetchAllUsers = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: "get"
    };
    httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response.data.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push(
              {
                "id": item.id,
                "pic": item?.imageByte?.image
              }
            )
          }
          return item;
        });
        setUsersPic(userPicTempArry);
      })
      .catch((error) => {
        console.log("ALLUSERS API error => ", error);
      });
  };

  useEffect(() => {
    fetchDepartmentData();
    fetchAllUsers();
    fetchAllFeedbacks();
  }, []);

  const triggerCreateModal = () => {
    setCreateModalShow(true);
  }

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "COMMUNICATIONS",
      link: "app/communication",
    },
    {
      label: "FeedBack",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "FeedBack",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const fetchAllFeedbacks = (paramsInfo = {}) => {

    let obj;
    if (Object.getOwnPropertyNames(paramsInfo)) {
      obj = {
        url: URL_CONFIG.GET_ALL_FEEDBACKS,
        method: "get",
        params: paramsInfo
      };
    } else {
      obj = {
        url: URL_CONFIG.IDEA,
        method: "get"
      };
    }

    httpHandler(obj)
      .then((all_feed) => {
        setFeedbacks(all_feed?.data?.data);
        setSearchFeedbacks(all_feed?.data?.data);
      })
      .catch((error) => {
        console.log("fetchIdeas error", error);
      });
  }

  const markImportant = (iData, isImportant) => {
    let obj;
    let iImportantIndex = 0;
    if (isImportant) {
      obj = {
        url: URL_CONFIG.FEEDBACK_IMPORTANT_UNIMPORTANT,
        payload: { id: iData.id, favorite: isImportant },
        method: "post",
      };
    }
    if (!isImportant) {
      obj = {
        url: URL_CONFIG.FEEDBACK_IMPORTANT_UNIMPORTANT,
        payload: { id: iData.id, id_dlt: iData.feedbackFavorites[iImportantIndex].id, favorite: isImportant },
        method: "post",
      };
    }
    httpHandler(obj)
      .then(() => {
        fetchAllFeedbacks()
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
        setShowModal({
          ...showModal,
          type: "danger",
          message: errMsg,
        });
      });
  }

  const readIdeaData = (iData, isActive, isRead) => {

    if (iData) {
      let obj;
      let iReadIndex = 0;
      if (isRead) {
        obj = {
          url: URL_CONFIG.FEEDBACK_READ_UNREAD,
          payload: { id: iData.id, reed: isRead },
          method: "post",
        };
      }
      if (!isRead) {
        obj = {
          url: URL_CONFIG.FEEDBACK_READ_UNREAD,
          payload: { id: iData.id, id_dlt: iData.feedbackRead[iReadIndex].id, reed: isRead },
          method: "post",
        };
      }
      httpHandler(obj)
        .then(() => {
          fetchAllFeedbacks()
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: "danger",
            message: error?.response?.data?.message,
          });
        });
    }
  }

  const readAllIdeas = (isReadAll) => {

    if (isReadAll) {
      const obj = {
        url: URL_CONFIG.FEEDBACK_READ_ALL,
        method: "post"
      };
      httpHandler(obj)
        .then(() => {
          fetchAllFeedbacks()
        })
        .catch((error) => {
          const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
          setShowModal({
            ...showModal,
            type: "danger",
            message: errMsg,
          });
        });
    }
  }

  const dateReceived = (isSort) => {
    setFeedbacks([...allfeedback].reverse());
  }

  const viewIdeaData = (iData) => {
    if (!iData.feedBackIsRead) {
      readIdeaData(iData, true, true);
    } else {
      markIdeaAsActiveState(allfeedback, iData.id);
    }
    setIdeaData(iData);
  }

  const markIdeaAsActiveState = (loopData, feedBackIDData) => {
    let feedBackDataTemp = JSON.parse(JSON.stringify(loopData));
    feedBackDataTemp && feedBackDataTemp.length > 0 && feedBackDataTemp.map((item) => {
      if (item.id === feedBackIDData) {
        item.feedBackIsActive = true;
      } else {
        item.feedBackIsActive = false;
      }
      return item;
    });
    setFeedbacks(feedBackDataTemp);
  }

  const onChangeValues = (value) => {
    setFeedFilter(value);
    if (value?.value === "allpost") {
      fetchAllFeedbacks()
    } else {
      fetchMyFeedsData({ filterby: yrDt })
    }
    setIdeaData(null)
  }

  const fetchMyFeedsData = (paramData = {}) => {
    var obj = {
      url: URL_CONFIG.MY_FEEDBACK,
      method: "get",
    };
    if (paramData && Object.keys(paramData).length > 0 && paramData !== "") {
      obj["params"] = paramData;
    }
    httpHandler(obj)
      .then((myFeeds) => {
        setFeedbacks(myFeeds?.data);
        setSearchFeedbacks(myFeeds?.data);
      })
      .catch((error) => {
        console.log("error", error.response);
      });
  }

  const onChangeSearch = (v) => {
    setsearch(v)
    const value = (search || v) ?
      allSearchfeedback?.filter(c => c?.title?.toLowerCase()?.includes(v?.toLowerCase())) : allSearchfeedback;
    setFeedbacks([...value])
  };

  const succAllFeedbacks = () => {
    setCreateModalShow(!createModalShow)
    setShowModal({
      ...showModal,
      type: "success",
      message: "Feedback created successfully!",
    });
  };

  const deleteFeedback = (feedbackTempData) => {

    let httpObj = {
      url: URL_CONFIG.FEEDBACK_DELETE
        + "?id=" + feedbackTempData.id,
      method: "delete"
    };
    httpHandler(httpObj)
      .then(() => {
        fetchAllFeedbacks();
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Oops! Something went wrong. Please contact administrator.";
        setShowModal({
          ...showModal,
          type: "danger",
          message: errMsg,
        });
      });
  };

  const getFilterParams = (paramsData = {}) => {
    if (Object?.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    if (feedFilter?.value === "allpost") {
      fetchAllFeedbacks(paramsData);
    } else {
      fetchMyFeedsData(paramsData)
    }
  }

  return (
    <React.Fragment>

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

      <div className="row eep-content-section-data no-gutters">
        <div className="tab-content col-md-12 h-100 response-allign-middle">
          <div id="feedback" className="tab-pane active h-100">

            {createModalShow && <CreateFeedbackModal
              deptOptions={deptOptions}
              CloseFunction={CloseFunction}
              fetchAllFeedbacks={fetchAllFeedbacks}
              createModalShow={createModalShow}
              succAllFeedbacks={succAllFeedbacks}
            />}

            <PageHeader title="Feedback"
              navLinksRight={
                <a className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg c1" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }} onClick={triggerCreateModal} data-toggle="modal" data-target="#CreateFeedbackModal"></a>
              }
              filter={
                <TypeBasedFilter config={TYPE_BASED_FILTER} getFilterParams={getFilterParams} />
              }
            />
            {allSearchfeedback && allSearchfeedback?.length > 0 &&
              <React.Fragment>
                <div className="row mx-0 ideaaboxContainer">
                  <div className="col-md-4 eep-content-section-data eep_scroll_y pl-0">
                    <FeedbackList
                      feedbackListsData={allfeedback}
                      usersPic={usersPic}
                      viewIdeaData={viewIdeaData}
                      readIdeaData={readIdeaData}
                      markImportant={markImportant}
                      readAllIdeas={readAllIdeas}
                      dateReceived={dateReceived}
                      onChangeValues={onChangeValues}
                      feedFilter={feedFilter}
                      onChangeSearch={onChangeSearch}
                      search={search}
                      deleteFeedback={deleteFeedback}
                    />

                  </div>
                  <div className="col-md-8 idea_detail_view eep-content-section-data ideabox-border-main eep_scroll_y px-0">
                    {ideaData &&

                      <FeedbackDetailView
                        ideaData={ideaData}
                        usersPic={usersPic} />
                    }

                    {!ideaData &&
                      <div className="row eep-content-section-data no-gutters">
                        <div className="eep_blank_div">
                          <img src={`${process.env.PUBLIC_URL}/images/icons/static/readData.png`} alt="Read Data" />
                          <p className="eep_blank_message">Select an item to read</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </React.Fragment>
            }
            {allfeedback && allfeedback?.length <= 0 &&
              <ResponseInfo
                title="Nothing to show yet."
                responseImg="noIdeaShare"
                responseClass="response-info"
                messageInfo="Nothing is really ours until we share it"
                subMessageInfo="C. S. Lewis"
              />
            }
          </div>
          {/* <div id="myfeedback" className="tab-pane h-100">
            {activeTab && activeTab.id === 'myfeedback' && <MyFeedback fetchAllFeedbacks={fetchAllFeedbacks} usersPic={usersPic} deptOptions={deptOptions} />}
          </div> */}
        </div>
      </div>
    </React.Fragment>
  );
}

export default Feedback;