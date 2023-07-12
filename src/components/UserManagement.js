import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import * as XLSX from 'xlsx';
import UserManagementActionDropdown from "../UI/CustomComponents/UserManagementActionDropdown";
import Filter from "../UI/Filter";
import PageHeader from "../UI/PageHeader";
import ResponseInfo from "../UI/ResponseInfo";
import Table from "../UI/Table";
import { URL_CONFIG } from "../constants/rest-config";
import { FILTER_CONFIG } from "../constants/ui-config";
import { httpHandler } from "../http/http-interceptor";
import CreateBulkUploadModal from "../modals/CreateBulkUserModal";
import { BreadCrumbActions } from "../store/breadcrumb-slice";

const UserManagement = () => {

  const [isUpload, setIsUpload] = useState(true);
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState([{ username: "tester", email: "test@gmail.com" }]);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

  const userDataTableHeaders = [
    {
      fieldLabel: "USER NAME",
      fieldValue: "username",
    },
    {
      fieldLabel: "FIRST NAME",
      fieldValue: "firstname",
    },
    {
      fieldLabel: "LAST NAME",
      fieldValue: "lastname",
    },
    {
      fieldLabel: "DEPT",
      fieldValue: "department.name",
    },
    {
      fieldLabel: "DESGN",
      fieldValue: "designation",
    },
    {
      fieldLabel: "EMAIL",
      fieldValue: "email",
    },
    {
      fieldLabel: "CONTACT",
      fieldValue: "telephoneNumber",
    },
    {
      fieldLabel: "ROLE",
      fieldValue: "role.roleName",
    },
    {
      fieldLabel: null,
      fieldValue: "action",
      component: <UserManagementActionDropdown />,
    },
  ];

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Admin Panel",
      link: "app/adminpanel",
    },
    {
      label: "User Management",
      link: "",
    },
  ];

  const fetchUserData = (arg) => {
    const obj = {
      url: URL_CONFIG.GETALLUSERS,
      method: "get",
      params: {
        active: arg.filterValue
      }
    };
    httpHandler(obj)
      .then((userData) => {
        setUserData(userData?.data?.map(v => { return { ...v, name: v?.username } }));
      })
      .catch((error) => {
        console.log("fetchUserData error", error);
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    const obj = { filterValue: true }
    fetchUserData(obj);
  }, []);

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "User Management",
      })
    );
  }, [breadcrumbArr, dispatch]);

  const filterOnChangeHandler = (arg) => {
    fetchUserData({ filterValue: arg.value });
  };

  const userBulkDataTableHeaders = [
    {
      header: "Username",
      accessorKey: "username",
    },
    {
      header: "Email",
      accessorKey: "email",
    }
  ];

  const onSucess = (e) => {

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const excelJson = JSON.parse(JSON.stringify(json, null, 2));
      const headers = excelJson[0];
      const dataArray = excelJson.slice(1);
      const payload = dataArray.map(row => {
        if (row?.length > 0) {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        }
      })?.filter(v => v);

      if (payload?.length > 0) {
        const obj_ = {
          url: URL_CONFIG.UPSERT_BULK_USER,
          method: "post",
          payload: {
            data: payload ?? []
          }
        };
        httpHandler(obj_)
          .then((response) => {
            setIsUpload(false)
          })
      }
    }
    reader.readAsArrayBuffer(file);
  }

  const openBulk = () => {
    setIsUpload(true)
  }

  const downloadExcel = (data) => {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "FailureUsers.xlsx");
  };

  return (
    <React.Fragment>
      <CreateBulkUploadModal
        data={data}
        userBulkDataTableHeaders={userBulkDataTableHeaders}
        // isUpload={false}
        isUpload={isUpload}
        downloadExcel={downloadExcel}
        onSucess={onSucess}
      />

      {userRolePermission?.adminPanel &&
        <React.Fragment>
          <PageHeader
            title="User Management"
            navLinksRight={
              <Link
                className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                to="/app/newUser"
                dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }}
              ></Link>
            }
            filter={
              <>
                <Link
                  className="eep-btn eep-btn-success eep-btn-xsml add_bulk_upload_button"
                  data-toggle="modal"
                  data-target="#CreateBulkUploadModal"
                  to="#"
                  onClick={openBulk}
                > <img src={'/images/Group 106594.svg'} /> Bulk Upload</Link>
                <Filter
                  config={FILTER_CONFIG}
                  onFilterChange={filterOnChangeHandler}
                />
              </>
            }
          ></PageHeader>

          <div className="eep-user-management eep-content-start" id="content-start">
            <div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }} >
              <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }} >
                {userData && (
                  <Table
                    component="userManagement"
                    headers={userDataTableHeaders}
                    data={userData}
                    tableProps={{
                      classes: "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
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
};
export default UserManagement;
