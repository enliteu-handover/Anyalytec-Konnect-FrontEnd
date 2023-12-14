import React, { useEffect, useState } from "react";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../../UI/PageHeader";
import Table from "../../UI/Table";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import { FILTER_LIST_CONFIG } from "../../constants/ui-config";
import ApprovalActions from "../../UI/CustomComponents/ApprovalActions";
import NominationStatus from "../../UI/CustomComponents/NominationStatus";
import Filter from "../../UI/Filter";
import DateFormatDisplay from "../../UI/CustomComponents/DateFormatDisplay";
import TableComponent from "../../UI/tableComponent";
import moment from "moment";

function AwardNominationList() {
  const [awardNomination, setAwardNomination] = useState([]);

  const cSettings = {
		createdAt: {
			classnames: "",
			objReference: "createdAt"
		}
	};

  const awardNominationTableHeaders = [
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
      accessorFn: (row) =>row.createdAt? moment(row.createdAt).format('l'):'--',
    },
    {
      header: "Status",
      accessorKey: "action",
      accessorFn: (row) => <NominationStatus data={row} />,

    },
   
  ];

  const fetchAwardNominationData = (arg = {}) => {
    const obj = {
      url: URL_CONFIG.MY_NOMINATIONS,
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
      .then((awardNomination) => {
        setAwardNomination(awardNomination.data);
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
    fetchAwardNominationData(obj);
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
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const filterOnChangeHandler = (arg) => {
    fetchAwardNominationData({ filterValue: arg });
  };

  return (
    <React.Fragment>
      <PageHeader
        title="Awards and Nominated"
        filter={
          <Filter
            config={FILTER_LIST_CONFIG}
            onFilterChange={filterOnChangeHandler}
          />
        }
      ></PageHeader>

      <div className="eep-user-management eep-content-start" id="content-start">
        <div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }} >
          <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }} >
            {awardNomination && (
            
             
              <TableComponent
              data={awardNomination ?? []}
              columns={awardNominationTableHeaders}
              action={<ApprovalActions isApprovalState={false} isView={true} />}
              />
            )}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
export default AwardNominationList;
