import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import PageHeader from "../../UI/PageHeader";
import Table from "../../UI/Table";
import ManageAwardActions from "../../UI/CustomComponents/ManageAwardActions"
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import StopAllotedAwardModal from "../../modals/StopAllotedAwardModal";
import DateFormatDisplay from "../../UI/CustomComponents/DateFormatDisplay";

const ManageAwards = () => {

  const [awardManage, setAwardManage] = useState([]);
  const [deletionState, setDeletionState] = useState(false);
  const [deletionData, setDeletionData] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
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
      label: "AWARDS",
      link: "app/awards",
    },
  ];

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Manage Awards",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const triggerModal = (isTrigger) => {
    
    if (isTrigger) {
      if (isTrigger.handleState) {
        setDeletionData(isTrigger.data);
        setDeletionState(isTrigger.handleState);
      } else {
        setDeletionData([]);
        setDeletionState(false);
      }
    }
  }

  const tableSettings = {
    createdAt: {
      classnames: "",
      objReference: "createdAt"
    },
    lastRun: {
      classnames: "",
      objReference: "lastRun"
    },
    nextRun: {
      classnames: "",
      objReference: "nextRun"
    }
  };

  const manageNominationSchedulesTableHeaders = [
    {
      fieldLabel: "Award Name",
      fieldValue: "award.name",
    },
    {
      fieldLabel: "Type",
      fieldValue: "type",
    },
    {
      fieldLabel: "Date",
      fieldValue: "created_at",
      component: <DateFormatDisplay cSettings={tableSettings.createdAt} />,
    },
    {
      fieldLabel: "Last Run",
      fieldValue: "last_run",
      component: <DateFormatDisplay cSettings={tableSettings.lastRun} />,
    },
    {
      fieldLabel: "Next Run",
      fieldValue: "next_run",
      component: <DateFormatDisplay cSettings={tableSettings.nextRun} />,
    },
    {
      fieldLabel: "Action",
      fieldValue: "action",
      component: <ManageAwardActions triggerModal={triggerModal} />,
    },
  ];

  const manageSpotTableHeaders = [
    {
      fieldLabel: "Award Name",
      fieldValue: "award.name",
    },
    {
      fieldLabel: "Department",
      fieldValue: "departmentId.name",
    },
    {
      fieldLabel: "Date",
      fieldValue: "createdAt",
    },
    {
      fieldLabel: "Actions",
      fieldValue: "action",
      component: <ManageAwardActions triggerModal={triggerModal} />,
    },
  ];

  const clickHandler = (arg) => {
    fetchManageAwardData(arg);
  }

  const fetchManageAwardData = (arg) => {
    let obj;
    if (arg === "nomi_award") {
      obj = {
        url: URL_CONFIG.MANAGE_AWARDS,
        method: "get",
        params: { type: arg },
      };
    }
    if (arg === "spot_award") {
      obj = {
        url: URL_CONFIG.MANAGE_AWARDS,
        method: "get",
        params: { type: arg },
      };
    }
    httpHandler(obj)
      .then((response) => {
        setAwardManage(response?.data?.map(v => { return { ...v, name: v?.award?.name ?? "" } }));
      })
      .catch((error) => {
        console.log("error", error);
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchManageAwardData("nomi_award");
  }, []);

  const confirmState = (arg) => {
    
    if (arg) {
      //if(deletionData.entityType === "nomi_award") {
      const obj = {
        url: URL_CONFIG.MANAGE_AWARDS + "?id=" + deletionData.id + "&type=" + deletionData.entityType,
        method: "delete"
      };
      httpHandler(obj)
        .then(() => {
          fetchManageAwardData(deletionData.entityType);
        })
        .catch((error) => {
          setShowModal({
            ...showModal,
            type: "danger",
            message: error?.response?.data?.message,
          });
        });
      //}
    } else {
      setDeletionData([]);
      setDeletionState(false);
    }
  }

  return (
    <React.Fragment>
      <PageHeader title="Manage Awards"></PageHeader>
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
      {deletionState && <StopAllotedAwardModal deleteMessage={{ msg: "Are you sure?", subMsg: "Do you really want to delete this?" }} confirmState={confirmState} />}
      <div className="py-4">
        <div className="row award_manage_div" id="content-start">
          <div className="col-md-12 mb-4">
            <ul className="nav nav-pills eep-nav-pills justify-content-end" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <a className="nav-link active" id="pills-nomination-schedule-tab" href="#pills-spot" role="tab" data-toggle="pill" aria-controls="pills-nomination-schedule" aria-selected="true" onClick={() => clickHandler("nomi_award")}>Nomination Schedules</a>
              </li>
              <li className="nav-item" role="presentation">
                <a className="nav-link" id="pills-spot-tab" href="#pills-nomination-schedule" role="tab" data-toggle="pill" aria-controls="pills-spot" aria-selected="false" onClick={() => clickHandler("spot_award")}>Spot</a>
              </li>
            </ul>
          </div>
          <div className="col-md-12 tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="pills-spot" role="tabpanel" aria-labelledby="pills-spot-tab">
              <Table
                component="ManageAwards"
                headers={manageNominationSchedulesTableHeaders}
                data={awardManage}
                tableProps={{
                  classes:
                    "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
                  id: "user_dataTable",
                  "aria-describedby": "user_dataTable_info",
                }}
                action={null}
              >
              </Table>
            </div>
            <div className="tab-pane fade" id="pills-nomination-schedule" role="tabpanel" aria-labelledby="pills-nomination-schedule-tab">
              <Table
                component="ManageAwards"
                headers={manageSpotTableHeaders}
                data={awardManage}
                tableProps={{
                  classes:
                    "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
                  id: "user_dataTable",
                  "aria-describedby": "user_dataTable_info",
                }}
                action={null}
              >
              </Table>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default ManageAwards;