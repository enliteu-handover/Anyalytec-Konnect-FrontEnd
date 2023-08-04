import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { TabsActions } from "../../store/tabs-slice";
import PageHeader from "../../UI/PageHeader";
import TypeBasedFilter from "../../UI/TypeBasedFilter";
import { TYPE_BASED_FILTER } from "../../constants/ui-config";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import MyFeedback from "./myFeedback";
import FeedbackList from "./feedbackList";
import FeedbackDetailView from "./feedbackDetailView";
import ResponseInfo from "../../UI/ResponseInfo";
import CreateEditCommunicationModal from "../../modals/feed"
import EEPSubmitModal from "../../modals/EEPSubmitModal";

const Feedback = () => {

  const [allfeedback, setFeedbacks] = useState([]);



  const [deptOptions, setDeptOptions] = useState([]);
  const [ideaLists, setIdeaLists] = useState([]);
  const [usersPic, setUsersPic] = useState([]);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [ideaData, setIdeaData] = useState(null);
  const [ideaDataState, setIdeaDataState] = useState(false);
  const [ideaListsReverse, setIdeaListsReverse] = useState(false);
  const [createModalErr, setCreateModalErr] = useState("");
  const [filterParams, setFilterParams] = useState({});
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const loggedUserData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const location = useLocation();
  const history = useHistory();
  // const routerData = location.state;
  const routerData = location.state || { activeTab: window.location.hash.substring(1)?.split('?')?.[0] };

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
      label: "Feedback",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Feedback",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const tabConfig = [
    {
      title: "Feedback",
      id: "feedback",
    },
    {
      title: "My Feedback",
      id: "myfeedback",
    }
  ];

  useEffect(() => {
    if (routerData) {
      const activeTabId = routerData.activeTab;
      tabConfig.map((res) => {
        if (res.id === activeTabId) {
          res.active = true
        }
      });

      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
      // history.replace({ pathname: history.location.pathname, state: {} });
    } else {
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
    }

    return () => {
      dispatch(
        TabsActions.updateTabsconfig({
          config: [],
        })
      );
    };
  }, []);

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
        //const errMsg = error.response?.data?.message;
      });
  }

  const getFilterParams = (paramsData) => {
    console.log("paramsData", paramsData);
    if (Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    fetchIdeas(false, null, paramsData);
  }

  const fetchIdeas = (isIdeaActive, ideaID = null, paramsInfo = {}) => {
    let obj;
    if (Object.getOwnPropertyNames(paramsInfo)) {
      obj = {
        url: URL_CONFIG.IDEA,
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
      .then((ideaData) => {
        if (!isIdeaActive) {
          if (ideaListsReverse) {
            setIdeaLists([...ideaData.data].reverse());
          } else {
            setIdeaLists(ideaData.data);
          }
          setIdeaData(null);
          setIdeaDataState(false);
        } else {
          if (ideaListsReverse) {
            markIdeaAsActiveState([...ideaData.data].reverse(), ideaID);
          } else {
            markIdeaAsActiveState(ideaData.data, ideaID);
          }
        }
      })
      .catch((error) => {
        console.log("fetchIdeas error", error);
        //const errMsg = error.response?.data?.message;
      });
  }

  const fetchAllUsers = () => {
    const obj = {
      url: URL_CONFIG.ALLUSERS,
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

  useEffect(() => {
    if (activeTab?.id === "feedback") {
      fetchIdeas(false);
    }
  }, [activeTab]);

  const markIdeaAsActiveState = (loopData, ideaIDData) => {
    let ideaDataTemp = JSON.parse(JSON.stringify(loopData));
    ideaDataTemp && ideaDataTemp.length > 0 && ideaDataTemp.map((item) => {
      if (item.id === ideaIDData) {
        item.ideaIsActive = true;
      } else {
        item.ideaIsActive = false;
      }
      return item;
    });
    setIdeaLists(ideaDataTemp);
  }

  const createCommunicationPost = (arg) => {
    let formData = new FormData();
    if (arg.files && arg.files.length > 0) {
      arg.files.map((item) => {
        formData.append('file', item);
        return item;
      });
    }
    const ideaRequestObj = {
      title: arg.title,
      description: arg.description,
      active: true,
      dept: arg.dept,
      existIdeaDept: null,
      existIdeaAttach: null
    }

    formData.append('ideaRequest', JSON.stringify(ideaRequestObj)
      //  new Blob([JSON.stringify(ideaRequestObj)], { type: 'application/json' })
    );

    const obj = {
      url: URL_CONFIG.IDEA,
      method: "post",
      formData: formData,
    };
    httpHandler(obj)
      .then((response) => {
        fetchIdeas(false);
        setCreateModalShow(false);
        setShowModal({
          ...showModal,
          type: "success",
          message: response?.data?.message,
        });
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Oops! Something went wrong. Please contact administrator.";
        setCreateModalErr(errMsg);
      });
  }

  const viewIdeaData = (iData) => {
    if (!iData.ideaIsRead) {
      readIdeaData(iData, true, true);
    } else {
      markIdeaAsActiveState(ideaLists, iData.id);
    }
    setIdeaData(iData);
    setIdeaDataState(true);
  }

  const triggerCreateModal = () => {
    setCreateModalShow(true);
  }

  const fetchAllFeedbacks = () => {

    let obj = {
      url: URL_CONFIG.GET_ALL_FEEDBACKS,
      method: "get"
    };
    httpHandler(obj)
      .then((all_feed) => {
        setFeedbacks(all_feed?.data?.data);

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
          //const errMsg = error.response?.data?.message;
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

            {createModalShow && <CreateEditCommunicationModal
              deptOptions={deptOptions} fetchAllFeedbacks={fetchAllFeedbacks} />}

            <PageHeader title="Feedback"
              navLinksRight={
                <Link to="#" className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }} onClick={triggerCreateModal} data-toggle="modal" data-target="#CreateEditCommunicationModal"></Link>
              }
            />
            {allfeedback && allfeedback?.length > 0 &&
              <React.Fragment>
                <div className="row mx-0 ideaaboxContainer">
                  <div className="col-md-4 eep-content-section-data eep_scroll_y pl-0">
                    {activeTab && activeTab.id === 'feedback' &&

                      <FeedbackList
                        feedbackListsData={allfeedback}
                        usersPic={usersPic}
                        viewIdeaData={viewIdeaData}
                        readIdeaData={readIdeaData}
                        markImportant={markImportant}
                        readAllIdeas={readAllIdeas}
                        dateReceived={dateReceived} />}

                  </div>
                  <div className="col-md-8 idea_detail_view eep-content-section-data ideabox-border-main eep_scroll_y px-0">
                    {ideaDataState && <FeedbackDetailView ideaData={ideaData} usersPic={usersPic} />}
                    {!ideaDataState &&
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
            {ideaLists && ideaLists?.length <= 0 &&
              <ResponseInfo
                title="Nothing to show yet."
                responseImg="noIdeaShare"
                responseClass="response-info"
                messageInfo="Nothing is really ours until we share it"
                subMessageInfo="C. S. Lewis"
              />
            }
          </div>
          <div id="myfeedback" className="tab-pane h-100">
            {activeTab && activeTab.id === 'myfeedback' && <MyFeedback usersPic={usersPic} deptOptions={deptOptions} />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}

export default Feedback;