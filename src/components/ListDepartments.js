import React, { useEffect, useState } from "react";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../UI/PageHeader";
import CreateDepartmentModal from "../modals/CreateDepartmentModal";
import DeptActionsModal from "../modals/DeptActionsModal";
import { Link } from "react-router-dom";
import Table from "../UI/Table";
import { httpHandler } from "../http/http-interceptor";
import { URL_CONFIG } from "../constants/rest-config";
import { FILTER_CONFIG } from "../constants/ui-config";
import DeptMasterActions from "../UI/CustomComponents/DeptMasterActions";
import Filter from "../UI/Filter";
import DateFormatDisplay from "../UI/CustomComponents/DateFormatDisplay";
import ResponseInfo from "../UI/ResponseInfo";
import TableComponent from "../UI/tableComponent";
import moment from "moment";
import * as XLSX from 'xlsx';
import { downloadXlsx } from "../helpers";

function ListDepartments() {
  const [userData, setUserData] = useState([]);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);
  const [deptData, setDeptData] = useState({});

  const getDeptData = (argu) => {
    setDeptData(argu);
  };

  const tableSettings = {
    createdAt: {
      classnames: "",
      objReference: "createdAt"
    },
    updatedAt: {
      classnames: "",
      objReference: "updatedAt"
    }
  };

  const userDataTableHeaders = [
    {
      header: "Department Name",
      accessorKey: "name",
    },
    {
      header: "Created By",
      accessorKey: "createdBy.username",
    },
    {
      header: "Created On",
      accessorKey: "createdAt",
      // component: <DateFormatDisplay cSettings={tableSettings.createdAt} />,
    },
    {
      header: "Updated By",
      accessorKey: "updatedBy.username",
    },
    {
      header: "Updated On",
      accessorKey: "updatedAt",
      // component: <DateFormatDisplay cSettings={tableSettings.updatedAt} />,
    },
    // {
    //   header: "Action",
    //   accessorKey: "action",
    //   // component: <DeptMasterActions getDeptData={getDeptData} />,
    // },
  ];

  const fetchDepartmentData = async (arg = {}) => {
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS,
      method: "get",
    };

    if (
      arg.filterValue &&
      Object.keys(arg.filterValue).length &&
      arg.filterValue.value !== ""
    ) {
      obj["params"] = {
        active: arg.filterValue.value
      };
    }
    await httpHandler(obj)
      .then((userData) => {
        
        const getData = userData?.data.map(item => ({
          ...item,
          createdAt: moment(item.createdAt).format('MM/DD/YYYY'),
          updatedAt: moment(item.updatedAt).format('MM/DD/YYYY'),
        }));
        setUserData(getData);
      })
      .catch((error) => {
        console.log("ALLDEPARTMENTS", error.response);
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    
    const obj = {
      filterValue: { label: "Active", value: true }
    }
    fetchDepartmentData(obj);
  }, []);

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "dashboard",
    },
    {
      label: "Admin Panel",
      link: "app/adminpanel",
    },
    {
      label: "Department Master",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Department Master",
      })
    );
  }, [breadcrumbArr, dispatch]);

  const filterOnChangeHandler = (arg) => {

    fetchDepartmentData({ filterValue: arg });
  };

  const handleExportDownload = () => {
    let xlData = userData?.map(v => {
      return {
        id: v?.id,
        name: v?.name,
        createdBy: v?.createdBy?.username,
        createdOn: v?.createdAt,
        updatedBy: v?.updatedBy?.username,
        updatedOn: v?.updatedAt,
      }
    })
    downloadXlsx("DepartmentMasters.xlsx", xlData);
  };

  return (
    <React.Fragment>
      {userRolePermission.adminPanel &&
        <React.Fragment>
          <CreateDepartmentModal fetchDeptData={fetchDepartmentData} />
          {deptData && Object.keys(deptData).length > 0 &&
            <DeptActionsModal
              viewDepartment={deptData}
              fetchDeptData={fetchDepartmentData}
            />
          }
          <PageHeader
            title="Department Masters"
            navLinksRight={
              <a
                className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg c1"
                data-toggle="modal"
                data-target="#CreateDepartmentModal"
                dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }}
              ></a>
            }
            filter={
              <Filter
                config={FILTER_CONFIG}
                onFilterChange={filterOnChangeHandler}
              />
            }
          ></PageHeader>

          <div className="eep-user-management eep-content-start" id="content-start">
            <div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }}>
              <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>
                {/* {userData && (
                  <Table
                    component="userManagement"
                    headers={userDataTableHeaders}
                    data={userData}
                    tableProps={{
                      classes:
                        "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
                      id: "user_dataTable",
                      "aria-describedby": "user_dataTable_info",
                    }}
                    action={null}
                  ></Table>
                )} */}

                <button
                  className="btn btn-secondary"
                  aria-controls="user_dataTable"
                  type="button"
                  style={{
                    position: 'absolute',
                    zIndex: '100'
                  }}
                  onClick={() => handleExportDownload()}
                >
                  <span>Excel</span>
                </button>

                {userData?.length > 0 &&
                  <TableComponent
                    data={userData ?? []}
                    columns={userDataTableHeaders}
                    action={
                      <DeptMasterActions getDeptData={getDeptData} />
                      // <BranchMasterActions setisOpen={setisOpen} isDelete={isDelete} getDeptData={getDeptData} />
                    }
                  />}
              </div>
            </div>
          </div>
        </React.Fragment>
      }
      {!userRolePermission.adminPanel &&
        <div className="row eep-content-section-data no-gutters">
          <ResponseInfo
            title="Oops! Looks illigal way."
            responseImg="accessDenied"
            responseClass="response-info"
            messageInfo="Contact Administrator."
          />
        </div>
      }
    </React.Fragment>
  );
}
export default ListDepartments;
