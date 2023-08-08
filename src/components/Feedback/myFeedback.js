import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import DateFormatDisplay from "../../UI/CustomComponents/DateFormatDisplay";
import IconWithLength from "../../UI/CustomComponents/IconWithLength";
import MyFeedActions from "../../UI/CustomComponents/MyFeedActions";
import PageHeader from "../../UI/PageHeader";
import Table from "../../UI/Table";
import YearFilter from "../../UI/YearFilter";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import ConfirmStateModal from "../../modals/ConfirmStateModal";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";

function MyFeedback(props) {
  const { fetchAllFeedbacks } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const yrDt = new Date().getFullYear();
  const [yearFilterValue, setYearFilterValue] = useState({ filterby: yrDt });
  const [myfeedbackList, setMyfeedbackList] = useState([]);
  const [feedbackTempData, setfeedbackTempData] = useState({});
  const [confirmModalState, setConfirmModalState] = useState(false);
  const [confirmStateModalObj, setConfirmStateModalObj] = useState({ confirmTitle: null, confirmMessage: null });
  const [showModal, setShowModal] = useState({ type: null, message: null });

  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
    setConfirmModalState(false);
    setfeedbackTempData({});
  };

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "MY FEEDBACK",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "My Feedback",
      })
    );
  }, [breadcrumbArr, dispatch]);

  const IconWithLengthSettings = {
    favourites: {
      title: "Favourites",
      default: "StarDefault.svg",
      isValue: "StarFavourite.svg",
      classnames: "eep-rotate-animation mr-2",
      objReference: "feedbackFavorite"
    },
    likes: {
      title: "Likes",
      default: "HeartDefault.svg",
      isValue: "Heart.svg",
      classnames: "eep-pulsess-animation mr-2",
      objReference: "feedbackLikes"
    },
    comments: {
      title: "Comments",
      default: "MessageDefault.svg",
      isValue: "Message.svg",
      classnames: "eep-stretch-animation mr-2",
      objReference: "feedbackComments"
    },
    createdAt: {
      classnames: "",
      objReference: "createdAt"
    }
  };

  const disableExistModal = () => {
    setConfirmModalState(false);
  }

  const deleteFeeds = (iData) => {
    disableExistModal();
    let iDataTemp = JSON.parse(JSON.stringify(iData));
    iDataTemp["actionType"] = "delete";
    setfeedbackTempData(iDataTemp);
    setConfirmStateModalObj({ confirmTitle: "Are you sure?", confirmMessage: "Do you really want to delete this Feedback?" });
    setConfirmModalState(true);
  };

  const myFeedbackTableHeaders = [
    {
      fieldLabel: "Title",
      fieldValue: "title",
    },
    {
      fieldLabel: "Favourites",
      fieldValue: "action",
      component: <IconWithLength cSettings={IconWithLengthSettings.favourites} />,
    },
    {
      fieldLabel: "Likes",
      fieldValue: "action",
      component: <IconWithLength cSettings={IconWithLengthSettings.likes} />,
    },
    {
      fieldLabel: "Comments",
      fieldValue: "action",
      component: <IconWithLength cSettings={IconWithLengthSettings.comments} />,
    },
    {
      fieldLabel: "Date",
      fieldValue: "action",
      component: <DateFormatDisplay cSettings={IconWithLengthSettings.createdAt} />,
    },
    {
      fieldLabel: "Action",
      fieldValue: "action",
      component: <MyFeedActions deleteFeeds={deleteFeeds} />,
    },
  ];

  const fetchMyFeedsData = (paramData = {}) => {
    const obj = {
      url: URL_CONFIG.MY_FEEDBACK,
      method: "get",
    };
    if (paramData && Object.keys(paramData).length > 0 && paramData !== "") {
      obj["params"] = paramData;
    }
    httpHandler(obj)
      .then((myFeeds) => {
        setMyfeedbackList([...myFeeds?.data?.map(v => { return { ...v, name: v?.title } })]);
      })
      .catch((error) => {
        console.log("error", error.response);
      });
  }

  useEffect(() => {
    fetchMyFeedsData(yearFilterValue);
  }, []);

  const confirmState = (isConfirmed) => {

    disableExistModal();
    if (isConfirmed) {
      let httpObj;
      if (feedbackTempData.actionType === "delete") {
        httpObj = {
          url: URL_CONFIG.FEEDBACK_DELETE
            + "?id=" + feedbackTempData.id,
          method: "delete"
        };
      }
      httpHandler(httpObj)
        .then(() => {
          fetchMyFeedsData(yearFilterValue);
          fetchAllFeedbacks()
        })
        .catch((error) => {
          const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Oops! Something went wrong. Please contact administrator.";
          setShowModal({
            ...showModal,
            type: "danger",
            message: errMsg,
          });
        });
    } else {
      setfeedbackTempData({});
    }
  }

  const onFilterChange = (filterValue) => {
    setYearFilterValue({ filterby: filterValue.value });
    fetchMyFeedsData({ filterby: filterValue.value });
  }

  return (
    <React.Fragment>
      <PageHeader title="My Feedback" navLinksLeft={<Link to="feedback" className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.lessthan_circle }}></Link>}
        filter={
          <YearFilter onFilterChange={onFilterChange} />
        }
      />
      {confirmModalState &&
        <ConfirmStateModal
          hideModal={hideModal}
          confirmState={confirmState}
          confirmTitle={confirmStateModalObj.confirmTitle ? confirmStateModalObj.confirmTitle : "Are you sure?"}
          confirmMessage={confirmStateModalObj.confirmMessage ? confirmStateModalObj.confirmMessage : ""}
        />
      }

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
      <div className="eep-user-management eep-content-start" id="content-start">
        <div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }} >
          <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }} >
            {myfeedbackList && (
              <Table
                component="userManagement"
                headers={myFeedbackTableHeaders}
                data={myfeedbackList}
                tableProps={{
                  classes: "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
                  id: "user_dataTable", "aria-describedby": "user_dataTable_info",
                }}
                action={null}
              ></Table>
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default MyFeedback;
