import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ApprovalActions from "../../UI/CustomComponents/ApprovalActions";
import ApprovalStatus from "../../UI/CustomComponents/ApprovalStatus";
import DateFormatDisplay from "../../UI/CustomComponents/DateFormatDisplay";
import Filter from "../../UI/Filter";
import PageHeader from "../../UI/PageHeader";
import Table from "../../UI/Table";
import { URL_CONFIG } from "../../constants/rest-config";
import { FILTER_LIST_CONFIG } from "../../constants/ui-config";
import { httpHandler } from "../../http/http-interceptor";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import TableComponent from "../../UI/tableComponent";
import moment from "moment";
import { pageLoaderHandler } from "../../helpers";

function AwardApprovalList() {
  const [awardApproval, setAwardApproval] = useState([]);
  const [isLoading,setIsLoading] =useState(false)

  const cSettings = {
    createdAt: {
      classnames: "",
      objReference: "createdAt"
    }
  };

  const awardApprovalTableHeaders = [
    {
      header: "Award Name",
      accessorKey: "award.name",
    },
    {
      header: "Team",
      accessorKey: "judgeId.department.name",
    },
    {
      header: "Nominees",
      accessorKey: "nominations.length",
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      accessorFn: (row) => row.createdAt?moment(row.createdAt).format('l') :'--',
    },
    {
      header: "Status",
      accessorKey: "updatedAt",
      accessorFn: (row) => <ApprovalStatus data={row} />,
      // component: <ApprovalStatus />,
    },
    // {
    //   header: "Action",
    //   accessorKey: "action",
    //   component: <ApprovalActions isApprovalState={true} isView={false} />,
    // },
  ];

  const fetchAwardApprovalData = (arg = {}) => {
    setIsLoading(true)
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
        rec: arg.filterValue.value
      };
    }
    httpHandler(obj)
      .then((awardApproval) => {
        setAwardApproval(awardApproval.data);
    setIsLoading(false)

      })
      .catch((error) => {
        console.log("error", error.response);
    setIsLoading(false)

      });
  };

  useEffect(() => {
    const obj = {
      filterValue: { label: "Pending", value: false }
    }
    fetchAwardApprovalData(obj);
    pageLoaderHandler(isLoading ? 'show':'hide')

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
      link: "",
    },
    // {
    //   label: "Awards and Approvals",
    //   link: "",
    // },
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

      <div className="eep-user-management eepcontent-start" id="content-start">
        <div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }}>
          <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>
              {/* // <Table
              //   component="userManagement"
              //   headers={awardApprovalTableHeaders}
              //   data={awardApproval}
              //   tableProps={{
              //     classes:
              //       "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
              //     id: "user_dataTable",
              //     "aria-describedby": "user_dataTable_info",
              //   }}
              //   action={null}
              // ></Table> */}
             { !isLoading&&<TableComponent
									data={awardApproval ?? []}
									columns={awardApprovalTableHeaders}
									action={<ApprovalActions isApprovalState={true} isView={false} />}
								  />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default AwardApprovalList;
