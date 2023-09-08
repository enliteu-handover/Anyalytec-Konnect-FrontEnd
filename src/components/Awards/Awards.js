import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { TabsActions } from "../../store/tabs-slice";
import { HIDE_SHOW_FILTER_CONFIG, BULK_ACTION } from "../../constants/ui-config";
import PageHeader from "../../UI/PageHeader";
import Filter from "../../UI/Filter";
import AssignAwards from "./AssignAwards";
import AwardRecognition from "./AwardRecognition";
import AwardNominationList from "./AwardNominationList";
import Nominations from "./Nominations";
import AwardApprovalList from "./AwardApprovalList";
import MyAwards from "./MyAwards";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import BulkAction from "../../UI/BulkAction";
import ManageAwards from "./ManageAwards";

const Awards = () => {
  const [filterBy, setFilterBy] = useState({ filter: true });
  const [bulkUpdateBy, setBulkUpdateBy] = useState({ updateBy: null });
  const [enableBulkState, setEnableBulkState] = useState({ bulkState: false });
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const [awardData, setAwardData] = useState({});
  const [selectedRecords, setSelectedRecords] = useState([]);
  const [nominateTypeData, setNominateTypeData] = useState({});

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const location = useLocation();
  const history = useHistory();
  const routerData = location.state || { activeTab: (window.location.hash.substring(1)?.split('?')?.[0]) || 'awardTab' };
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

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
      label: "AWARDS",
      link: "app/awards",
    },
  ];

  const tabConfig = [
    {
      title: "My Awards",
      id: "MyAwardsTab",
    },
    {
      title: "Nominations",
      id: "NominationsTab",
    }
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Awards",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  useEffect(() => {

    if (userRolePermission?.awardNominatorAssignee) {
      tabConfig.push(
        { title: "Nominator View", id: "NominatorTab" },
        { title: "My Nominations", id: "MyNominationsTab" },
        { title: "Approval", id: "ApprovalTab" }
      );
    }
    if (userRolePermission?.awardCategorisation) {
      tabConfig.splice(2, 0, { title: "Awards", id: "awardTab" });
      tabConfig.push(
        { title: "Manage", id: "ManageTab" }
      );
    }

    if (!userRolePermission?.awardNominatorAssignee && !userRolePermission?.awardCategorisation) {
      tabConfig.splice((tabConfig.length - 1), 0, { title: "Approval", id: "ApprovalTab" });
    }

    if (routerData?.activeTab) {
      const activeTabId = routerData.activeTab;
      tabConfig.map((res) => {
        if (res.id === activeTabId) {
          return res.active = true
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
  }, [userRolePermission]);

  useEffect(() => {
    fetchAwardData(filterBy.filter);
  }, []);

  const fetchNominationTypeData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/awardNominationTypes.json`)
      .then((response) => response.json())
      .then((data) => {
        setNominateTypeData(data);
      }).catch((error) => console.log(error));;
  };

  useEffect(() => {
    fetchNominationTypeData();
  }, []);

  const fetchAwardData = (arg) => {
    const obj = {
      url: URL_CONFIG.ALLAWARDS,
      method: "get",
      params: { active: arg },
    };
    httpHandler(obj)
      .then((awardData) => {
        setAwardData(awardData.data);
      })
      .catch((error) => {
        console.log("error", error.response?.data?.message);
        //const errMsg = error.response?.data?.message;
      });
  };

  const filterOnChangeHandler = (arg) => {
    if (arg) {
      setFilterBy({ filter: arg.value });
      fetchAwardData(arg.value);
      resetCheckBox();
    }
  };

  const onBulkActionChangeHandler = (arg) => {
    if (arg) {
      setBulkUpdateBy({ updateBy: arg.value });
    }
  };

  const enableFilterOptions = (e) => {
    const { checked } = e.target;
    setEnableBulkState({ bulkState: false });
    if (checked) {
      setEnableBulkState({ bulkState: true });
    }
  };

  const getSelectedAwards = (arg) => {
    const selectedArray = arg.map((i) => Number(i));
    setSelectedRecords(selectedArray);
  };

  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const bulkSubmitHandler = () => {

    if (selectedRecords.length > 0 && bulkUpdateBy.updateBy !== null) {
      const obj = {
        url: URL_CONFIG.AWARD_BULK_UPDATE,
        // + "?award=" + selectedRecords + "&active=" + bulkUpdateBy.updateBy,
        method: "put",
        payload: {
          award: selectedRecords, active: bulkUpdateBy.updateBy
        }
      };
      httpHandler(obj)
        .then((response) => {
          setShowModal({
            ...showModal,
            type: "success",
            message: response?.data?.message,
          });
          fetchAwardData(filterBy.filter);
          resetCheckBox();
        })
        .catch((error) => {
          console.log("error", error.response);
          setShowModal({
            ...showModal,
            type: "danger",
            message: error?.response?.data?.message,
          });
        });
    }
  };

  const resetCheckBox = () => {
    const badgeList = document.getElementsByClassName("badge-list");
    setSelectedRecords([]);
    for (let i = 0; i < badgeList.length; i++) {
      if (badgeList[i]) {
        badgeList[i].checked = false;
      }
    }
  };
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
        <div className="tab-content col-md-12 h-100">
          <div id="MyAwardsTab" className="tab-pane active h-100">
            <MyAwards />
          </div>
          <div id="NominationsTab" className="tab-pane h-100">
            {activeTab && activeTab.id === 'NominationsTab' && <Nominations />}
          </div>
          <div id="awardTab" className="tab-pane h-100">
            {!userRolePermission.awardCreate && !userRolePermission.awardModify &&
              <PageHeader title="Awards and Nomination"
                filter={<Filter config={HIDE_SHOW_FILTER_CONFIG} onFilterChange={filterOnChangeHandler} />}
              ></PageHeader>
            }
            {userRolePermission.awardCreate && !userRolePermission.awardModify &&
              <PageHeader title="Awards and Nomination"
                navLinksRight={
                  <Link
                    className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                    to="createaward"
                    dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }}
                  ></Link>
                }
                filter={<Filter config={HIDE_SHOW_FILTER_CONFIG} onFilterChange={filterOnChangeHandler} />}
              ></PageHeader>
            }
            {!userRolePermission.awardCreate && userRolePermission.awardModify &&
              <PageHeader title="Awards and Nomination"
                filter={<Filter config={HIDE_SHOW_FILTER_CONFIG} onFilterChange={filterOnChangeHandler} />}
                BulkAction={
                  <BulkAction config={BULK_ACTION} onClickCheckbox={enableFilterOptions} onFilterChange={onBulkActionChangeHandler} checkBoxInfo={enableBulkState} bulkSubmitHandler={bulkSubmitHandler} />
                }
              ></PageHeader>
            }
            {userRolePermission.awardCreate && userRolePermission.awardModify &&
              <PageHeader title="Awards and Nomination"
                navLinksRight={
                  <Link
                    className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                    to="createaward"
                    dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }}
                  ></Link>
                }
                filter={<Filter config={HIDE_SHOW_FILTER_CONFIG} onFilterChange={filterOnChangeHandler} />}
                BulkAction={
                  <BulkAction config={BULK_ACTION} onClickCheckbox={enableFilterOptions} onFilterChange={onBulkActionChangeHandler} checkBoxInfo={enableBulkState} bulkSubmitHandler={bulkSubmitHandler} />
                }
              ></PageHeader>
            }
            {activeTab && activeTab.id === 'awardTab' &&
              <AssignAwards
                filterBy={filterBy}
                awardData={awardData}
                bulkUpdateBy={bulkUpdateBy}
                bulkUpdateState={enableBulkState}
                getSelectedAwards={getSelectedAwards}
                nominateTypeData={nominateTypeData}
              />
            }
          </div>
          <div id="NominatorTab" className="tab-pane h-100">
            <PageHeader title="Award Nominator" />
            {activeTab && activeTab.id === 'NominatorTab' && <AwardRecognition />}
          </div>
          <div id="MyNominationsTab" className="tab-pane h-100">
            {activeTab && activeTab.id === 'MyNominationsTab' && <AwardNominationList />}
          </div>
          <div id="ApprovalTab" className="tab-pane h-100">
            {activeTab && activeTab.id === 'ApprovalTab' && <AwardApprovalList />}
          </div>
          <div id="ManageTab" className="tab-pane h-100">
            {activeTab && activeTab.id === 'ManageTab' && <ManageAwards />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Awards;
