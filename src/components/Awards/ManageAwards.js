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
import TableComponent from "../../UI/tableComponent";
import moment from "moment";

const ManageAwards = () => {

  const [awardManage, setAwardManage] = useState([]);
  const [deletionState, setDeletionState] = useState(false);
  const [tab, setTab] = useState('');
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
      header: "Award Name",
      accessorKey: "award.name",
    },
    {
      header: "Type",
      accessorKey: "type",
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      accessorFn: (row) => row?.createdAt ? moment(row.createdAt).format('l') : '--',

      // component: <DateFormatDisplay cSettings={tableSettings.createdAt} />,
    },
    {
      header: "Last Run",
      accessorKey: "lastRun",
      // component: <DateFormatDisplay cSettings={tableSettings.lastRun} />,
      accessorFn: (row) =>row?.lastRun ?  moment(row.lastRun).format('l') : '--',

    },
    {
      header: "Next Run",
      accessorKey: "nextRun",
      // component: <DateFormatDisplay cSettings={tableSettings.nextRun} />,
      accessorFn: (row) => row.nextRun ?  moment(row.nextRun).format('l') : '--',

    },
    // {
    //   header: "Action",
    //   accessorKey: "action",
    //   component: <ManageAwardActions triggerModal={triggerModal} />,
    // },
  ];

  const manageSpotTableHeaders = [
    {
      header: "Award Name",
      accessorKey: "award.name",
    },
    {
      header: "Department",
      accessorKey: "departmentId.name",
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      accessorFn: (row) => row?.createdAt ? moment(row.createdAt).format('l') : '--',
    },
    // {
    //   header: "Actions",
    //   accessorKey: "action",
    //   component: <ManageAwardActions triggerModal={triggerModal} />,
    // },
  ];

  const clickHandler = (arg) => {
    setTab(arg)
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
        setAwardManage(response?.data?.map(v => {
          return {
            ...v, name: v?.award?.name ?? "",
            // createdAt: v?.created_at,
            // nextRun: v?.next_run,
            // lastRun: v?.last_run,
            // type: v?.entity_type || v?.type || ''
          }
        }));
      })
      .catch((error) => {
        console.log("error", error);
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    setTab('nomi_award')
    fetchManageAwardData("nomi_award");
  }, []);

  const confirmState = (arg) => {
    
    if (arg) {
      //if(deletionData.entityType === "nomi_award") {
      const obj = {
        url: URL_CONFIG.MANAGE_AWARDS + "?id=" + deletionData.id + "&type=" + (deletionData?.entityType || deletionData?.type),
        method: "delete"
      };
      httpHandler(obj)
        .then(() => {
          fetchManageAwardData((deletionData?.entityType || deletionData?.type));
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
      <div className="py-1" style={{position:'relative'}}>
      <div className="tabSwitch">
      <button
        onClick={() => clickHandler("nomi_award")}
        className={tab === "nomi_award" ? "tabButtonActive" : "tabButton"}
      >
        Nomination Schedules
      </button>
      <button
        onClick={() => clickHandler("spot_award")}
        className={tab === "spot_award" ? "tabButtonActive" : "tabButton"}
      >
        Spot
      </button>
     </div>

      <div className="award_manage_div">
     { tab === "nomi_award" && <div className="table-responsive eep_datatable_table_div" style={{ visibility: "visible", overflowX: "hidden" }}>

              <TableComponent
              data={awardManage ?? []}
              columns={manageNominationSchedulesTableHeaders}
              action={<ManageAwardActions triggerModal={triggerModal} />}
              />
              </div>}

               { tab === "spot_award" && <div className="table-responsive eep_datatable_table_div p-2 mt-3" style={{ visibility: "visible", overflowX: "hidden" }}>
              <TableComponent
              data={awardManage ?? []}
              columns={manageSpotTableHeaders}
              action={<ManageAwardActions triggerModal={triggerModal} />}
              />
              </div>}
      </div>

        {/* <div className="row award_manage_div" id="content-start">
          <div className="col-md-12">
            <ul className="nav nav-pills eep-nav-pills justify-content-end" id="pills-tab" role="tablist">
              <li className="nav-item" role="presentation">
                <a className="nav-link active c1" id="pills-nomination-schedule-tab" href="#pills-spot" role="tab" data-toggle="pill" aria-controls="pills-nomination-schedule" aria-selected="true" onClick={() => clickHandler("nomi_award")}>Nomination Schedules</a>
              </li>
              <li className="nav-item" role="presentation">
                <a className="nav-link c1" id="pills-spot-tab" href="#pills-nomination-schedule" role="tab" data-toggle="pill" aria-controls="pills-spot" aria-selected="false" onClick={() => clickHandler("spot_award")}>Spot</a>
              </li>
            </ul>
          </div>
          <div className="col-md-12 tab-content" id="pills-tabContent">
            <div className="tab-pane fade show active" id="pills-spot" role="tabpanel" aria-labelledby="pills-spot-tab">
              
             <div className="table-responsive eep_datatable_table_div" style={{ visibility: "visible", overflowX: "hidden" }}>

              <TableComponent
              data={awardManage ?? []}
              columns={manageNominationSchedulesTableHeaders}
              action={<ManageAwardActions triggerModal={triggerModal} />}
              />
              </div>
            </div>
            <div className="tab-pane fade" id="pills-nomination-schedule" role="tabpanel" aria-labelledby="pills-nomination-schedule-tab">
              
              <div className="table-responsive eep_datatable_table_div p-2 mt-3" style={{ visibility: "visible", overflowX: "hidden" }}>
              <TableComponent
              data={awardManage ?? []}
              columns={manageSpotTableHeaders}
              action={<ManageAwardActions triggerModal={triggerModal} />}
              />
              </div>
     
            </div>
          </div>
        </div> */}
      </div>
    </React.Fragment>
  );
}
export default ManageAwards;