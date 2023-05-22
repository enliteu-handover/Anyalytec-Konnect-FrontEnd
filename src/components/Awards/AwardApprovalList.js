import React, { useEffect, useState } from "react";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../UI/PageHeader";
import Table from "../../UI/Table";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import { FILTER_LIST_CONFIG } from "../../constants/ui-config";
import ApprovalActions from "../../UI/CustomComponents/ApprovalActions";
import ApprovalStatus from "../../UI/CustomComponents/ApprovalStatus";
import DateFormatDisplay from "../../UI/CustomComponents/DateFormatDisplay";
import Filter from "../../UI/Filter";

function AwardApprovalList() {
  const [awardApproval, setAwardApproval] = useState([]);
  const cSettings = {
		createdAt: {
			classnames: "",
			objReference: "createdAt"
		}
	};

  const awardApprovalTableHeaders = [
    {
      fieldLabel: "Award Name",
      fieldValue: "award.name",
    },
    {
      fieldLabel: "Team",
      fieldValue: "judgeId.department.name",
    },
    {
      fieldLabel: "Nominees",
      fieldValue: "nominations.length",
    },
    {
      fieldLabel: "Date",
      fieldValue: "createdAt",
      component: <DateFormatDisplay cSettings={cSettings.createdAt} />,
    },
    {
      fieldLabel: "Status",
      fieldValue: "updatedAt",
      component: <ApprovalStatus />,
    },
    {
      fieldLabel: "Action",
      fieldValue: "action",
      component: <ApprovalActions isApprovalState={true} isView={false} />,
    },
  ];

  const fetchAwardApprovalData = (arg = {}) => {
    const obj = {
      url: URL_CONFIG.MY_APPROVALS,
      method: "get",
    };
    if (
      arg.filterValue &&
      Object.keys(arg.filterValue).length &&
      arg.filterValue.value !== ""
    ) {
      obj["params"] = {
        rec:arg.filterValue.value
      };
    }
    httpHandler(obj)
      .then((awardApproval) => {
        setAwardApproval(awardApproval.data);
      })
      .catch((error) => {
        console.log("error", error.response);
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    const obj = { 
      filterValue: { label: "Pending", value: false } 
    }
    fetchAwardApprovalData(obj);
  }, []);

  const dispatch = useDispatch();
  
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
    {
      label: "Awards and Approvals",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Awards and Approvals",
      })
    );
  }, [breadcrumbArr, dispatch]);

  const filterOnChangeHandler = (arg) => {
    fetchAwardApprovalData({ filterValue: arg });
  };

  return (
    <React.Fragment>
      <PageHeader
        title="Award and Approvals"
        filter={
          <Filter
            config={FILTER_LIST_CONFIG}
            onFilterChange={filterOnChangeHandler}
          />
        }
      ></PageHeader>

      <div className="eep-user-management eep-content-start" id="content-start">
        <div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }}>
          <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>
            {awardApproval && (
              <Table
                component="userManagement"
                headers={awardApprovalTableHeaders}
                data={awardApproval}
                tableProps={{
                  classes:
                    "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
                  id: "user_dataTable",
                  "aria-describedby": "user_dataTable_info",
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
export default AwardApprovalList;
