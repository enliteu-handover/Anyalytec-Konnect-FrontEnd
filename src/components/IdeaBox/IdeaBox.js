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
import MyIdeas from "./MyIdeas";
import IdeaList from "./IdeaList";
import IdeaDetailView from "./IdeaDetailView";
import ResponseInfo from "../../UI/ResponseInfo";
import CreateEditCommunicationModal from "../../modals/CreateEditCommunicationModal"
import EEPSubmitModal from "../../modals/EEPSubmitModal";

const IdeaBox = () => {

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
  const routerData = location.state;

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
			label: "IDEA BOX",
			link: "",
		},
	];

	useEffect(() => {
		dispatch(
			BreadCrumbActions.updateBreadCrumb({
				breadcrumbArr,
				title: "Idea Box",
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
			title: "Ideas",
			id: "ideas",
		},
		{
			title: "My Ideas",
			id: "myideas",
		}
	];

  useEffect(() => {
    if(routerData) {
      const activeTabId = routerData.activeTab;
      tabConfig.map((res) => {
        if(res.id === activeTabId){
          res.active = true
        }
      });

      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
      history.replace({pathname: history.location.pathname, state: {}});
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
			params: { active:true },
    };
    httpHandler(obj)
    .then((deptData) => {
      let optionsTemp = [];
      deptData.data.map((deptValue) => {
        return optionsTemp.push({value: deptValue.id, label: deptValue.name});
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
    if(Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({...paramsData});
    } else {
      setFilterParams({});
    }
    fetchIdeas(false, null, paramsData);
  }

  const fetchIdeas = (isIdeaActive, ideaID = null, paramsInfo = {}) => {
    let obj;
    if(Object.getOwnPropertyNames(paramsInfo)) {
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
    /*
    const obj = {
			url: URL_CONFIG.IDEA,
			method: "get"
    };
    */
    httpHandler(obj)
    .then((ideaData) => {
      if(!isIdeaActive) {
        //setIdeaLists(ideaData.data);
        if(ideaListsReverse) {
          setIdeaLists([...ideaData.data].reverse());
        } else {
          setIdeaLists(ideaData.data);
        }
        setIdeaData(null);
        setIdeaDataState(false);    
      } else {
        if(ideaListsReverse) {
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
          if(item?.imageByte?.image) {
            userPicTempArry.push(
              {
                "id":item.id,
                "pic":item?.imageByte?.image
              }
            )
          }
          return item;
        });
        setUsersPic(userPicTempArry);
      })
      .catch((error) => {
        console.log("ALLUSERS API error => ",error);   
      });
  };

	useEffect(() => {
		fetchDepartmentData();
    fetchAllUsers();
	}, []);

  useEffect(() => {
    if(activeTab?.id === "ideas") {
      fetchIdeas(false);
    }
  }, [activeTab]);

  const markIdeaAsActiveState = (loopData, ideaIDData) => {
    let ideaDataTemp = JSON.parse(JSON.stringify(loopData));
    ideaDataTemp && ideaDataTemp.length > 0 && ideaDataTemp.map((item) => {
      if(item.id === ideaIDData) {
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
    if(arg.files && arg.files.length > 0) {
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
    formData.append('ideaRequest', new Blob([JSON.stringify(ideaRequestObj)], { type: 'application/json'}));

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
    if(!iData.ideaIsRead) {
      readIdeaData(iData,true,true);
    } else {
      markIdeaAsActiveState(ideaLists, iData.id);
    }
    setIdeaData(iData);
    setIdeaDataState(true);
  }

  const readIdeaData = (iData, isActive, isRead) => {
    if(iData) {
      let obj;
      let iReadIndex;
      if(isRead) {
        obj = {
          url: URL_CONFIG.IDEA_READ_UNREAD + "?id=" +iData.id,
          method: "post",
        };
      }
      if(!isRead) {
        iReadIndex = iData.ideaRead.findIndex(x => x.userId.id === loggedUserData.id);
        obj = {
          url: URL_CONFIG.IDEA_READ_UNREAD + "?id=" +iData.ideaRead[iReadIndex].id,
          method: "delete",
        };
      }
      httpHandler(obj)
      .then(() => {
        if(isRead) {
          fetchIdeas(true, iData.id, filterParams);
        }
        if(!isRead) {
          let ideaListsTemp = JSON.parse(JSON.stringify(ideaLists));
          if(ideaListsTemp && ideaListsTemp.length > 0) {
            ideaListsTemp.map((idea) => {
              if(idea.id === iData.id) {
                idea.ideaIsRead = false;
                idea.ideaRead.splice(iReadIndex, 1);
                if(isActive) {
                  idea.ideaIsActive = true;
                }
              } else {
                if(isActive) {
                  idea.ideaIsActive = false;
                }
              }
              return idea;
            });
            setIdeaLists(ideaListsTemp);
          }
        }
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

  const markImportant = (iData, isImportant) => {
    let obj;
    let iImportantIndex;
    if(isImportant) {
      obj = {
        url: URL_CONFIG.IDEA_IMPORTANT_UNIMPORTANT + "?id=" +iData.id,
        method: "post",
      };
    }
    if(!isImportant) {
      iImportantIndex = iData.ideaFavorite.findIndex(x => x.userId.id === loggedUserData.id);
      obj = {
        url: URL_CONFIG.IDEA_IMPORTANT_UNIMPORTANT + "?id=" +iData.ideaFavorite[iImportantIndex].id,
        method: "delete",
      };
    }
    httpHandler(obj)
      .then(() => {
        if(isImportant) {
          if(iData.ideaIsActive) {
            fetchIdeas(true, iData.id, filterParams);
          } else {
            fetchIdeas(false);
          }
        } 
        if(!isImportant) {
          let ideaDataTemp = JSON.parse(JSON.stringify(ideaLists))
          ideaDataTemp && ideaDataTemp.length > 0 && ideaDataTemp.map((item) => {
            if(item.ideaIsActive) {
              item.ideaIsActive = true;
            } else {
              item.ideaIsActive = false;
            }
            if(item.id === iData.id) {
              if(item.ideaFavorite && item.ideaFavorite.length > 0) {
                item.ideaIsImportant = false;
                item.ideaFavorite.splice(iImportantIndex, 1);
              }
            }
            return item;
          });
          setIdeaLists(ideaDataTemp);
        }
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

  const readAllIdeas = (isReadAll) => {
    if(isReadAll) {
      const obj = {
        url: URL_CONFIG.IDEA_READ_ALL,
        method: "post"
      };
      httpHandler(obj)
        .then(() => { 
          fetchIdeas(false);
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

  const triggerCreateModal = () => {
    setCreateModalShow(true);
  }

  const dateReceived = (isSort) => {
    setIdeaListsReverse(isSort);
    setIdeaLists([...ideaLists].reverse());
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
					<div id="ideas" className="tab-pane active h-100">
						{createModalShow && <CreateEditCommunicationModal deptOptions={deptOptions} createModalShow={createModalShow} createCommunicationPost={createCommunicationPost} communicationModalErr={createModalErr} communicationType="idea" communicationData={null} /> }
						<PageHeader title="Idea Box"
							navLinksRight={
								<Link to="#" className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }} onClick={triggerCreateModal} data-toggle="modal" data-target="#CreateEditCommunicationModal"></Link>
							}
							filter={
								<TypeBasedFilter config={TYPE_BASED_FILTER} getFilterParams={getFilterParams} />
							}
						/>
            {ideaLists && ideaLists.length > 0 &&
              <React.Fragment>
    						<div className="row mx-0 ideaaboxContainer">
                  <div className="col-md-6 eep-content-section-data eep_scroll_y pl-0">
                    {/* <IdeaList ideaListsData={ideaLists} usersPic={usersPic} viewIdeaData={viewIdeaData} readIdeaData={readIdeaData} markImportant={markImportant} readAllIdeas={readAllIdeas} dateReceived={dateReceived} /> */}
                    {activeTab && activeTab.id === 'ideas' && <IdeaList ideaListsData={ideaLists} usersPic={usersPic} viewIdeaData={viewIdeaData} readIdeaData={readIdeaData} markImportant={markImportant} readAllIdeas={readAllIdeas} dateReceived={dateReceived} /> }
                  </div>
                  <div className="col-md-6 idea_detail_view eep-content-section-data ideabox-border-main eep_scroll_y px-0">
                    {ideaDataState && <IdeaDetailView ideaData={ideaData} usersPic={usersPic} /> }
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
						{ideaLists && ideaLists.length <= 0 &&
              <ResponseInfo
                title="Nothing to show yet."
                responseImg="noIdeaShare"
                responseClass="response-info"
                messageInfo="Nothing is really ours until we share it"
                subMessageInfo="C. S. Lewis"
              />
						}
					</div>
					<div id="myideas" className="tab-pane h-100">
						{/* <PageHeader title="My Idea"
							navLinksLeft={
								<Link 
                  to={{
                    pathname: "/app/ideabox",
                    state: {
                      activeTab: 'ideas'
                    },
                  }}
                  className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg" 
                  dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.lessthan_circle }}
                ></Link>
							}
							filter={
								<Filter config={HIDE_SHOW_FILTER_CONFIG} />
							}
						/> */}
            {activeTab && activeTab.id === 'myideas' && <MyIdeas usersPic={usersPic} deptOptions={deptOptions} /> }
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default IdeaBox;