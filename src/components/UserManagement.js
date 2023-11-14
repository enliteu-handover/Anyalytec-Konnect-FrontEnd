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
import { getRoles } from '@crayond_dev/idm-client';
import TableComponent from "../UI/tableComponent";
import { downloadXlsx } from "../helpers";
import { idmRoleMappingRoles } from "../idm";

const UserManagement = () => {

  const [isUpload, setIsUpload] = useState(true);
  const [userData, setUserData] = useState([]);
  const [data, setData] = useState({});
  const [state, setState] = useState({ uploadData: null });
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

  const userDataTableHeaders = [
    {
      header: "USER NAME",
      accessorKey: "username",
    },
    {
      header: "FIRST NAME",
      accessorKey: "firstname",
    },
    {
      header: "LAST NAME",
      accessorKey: "lastname",
    },
    {
      header: "DEPT",
      accessorKey: "department.name",
    },
    {
      header: "DESGN",
      accessorKey: "designation",
    },
    {
      header: "EMAIL",
      accessorKey: "email",
    },
    {
      header: "CONTACT",
      accessorKey: "telephoneNumber",
    },
    {
      header: "ROLE",
      accessorKey: "role.roleName",
    },
    // {
    //   fieldLabel: null,
    //   fieldValue: "action",
    //   component: <UserManagementActionDropdown />,
    // },
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
    }, {
      header: "First Name",
      accessorKey: "firstname",
    }, {
      header: "Last Name",
      accessorKey: "lastname",
    }, {
      header: "Email",
      accessorKey: "email",
    }, {
      header: "DOJ",
      accessorKey: "doj",
    }, {
      header: "DOB",
      accessorKey: "dob",
    },
    {
      header: "Designation",
      accessorKey: "roleName",
    }, {
      header: "Contact",
      accessorKey: "mobile_number",
    }, {
      header: "To",
      accessorKey: "manager",
    }, {
      header: "Country",
      accessorKey: "country",
    }, {
      header: "Branch",
      accessorKey: "mobile_number",
    }, {
      header: "Status",
      accessorKey: "status",
      Cell: ({ cell, column }) => (
        <span
          style={{
            color: cell.getValue()?.toLowerCase() === 'failure' ? 'red' : 'green',
          }}
        >
          {cell.getValue()}
        </span>
      ),
    }, {
      header: "Message",
      accessorKey: "message",
      Cell: ({ cell, column }) => (
        <span
          style={{
            color: 'red',
          }}
        >
          {cell.getValue()}
        </span>
      ),
    }
  ];

  const handleChange = (e) => {
    setState({
      ...state,
      uploadData: e.target.files[0]
    })
  }

  const onSucess = (e) => {

    const file = state.uploadData;
    const reader = new FileReader();

    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      const excelJson = JSON.parse(JSON.stringify(json, null, 2));
      const headers = excelJson[0];
      const dataArray = excelJson.slice(1);
      const roles = await getRoles({ apiKey: "ASC4PK0UVE5OOCO8NK" });

      const payloadConstruction = dataArray.map((row) => {
        if (row?.length > 0) {
          const obj = {};
          headers.forEach((header, index) => {
            obj[header] = row[index];
          });
          return obj;
        }
      })?.filter(v => v);

      // const payload = await payloadConstruction?.map(async (v) => {
      //   const imd_role = roles?.find(c => c?.name?.toLowerCase() === v?.role?.toLowerCase())

      //   const roleData = await idmRoleMappingRoles(imd_role?.id);
      //   v.role = {
      //     idm_id: imd_role?.id,
      //     role_name: imd_role?.name,
      //     screen: JSON.stringify(roleData?.data)
      //   };
      //   // v.role = imd_role || ''
      //   return { ...v }
      // })

      const payload = [];
      for (const v of payloadConstruction) {
        const imd_role = roles?.find(c => c?.name?.toLowerCase() === v?.role?.toLowerCase());

        const roleData = await idmRoleMappingRoles(imd_role?.id);
        v.role = {
          idm_id: imd_role?.id,
          role_name: imd_role?.name,
          screen: JSON.stringify(roleData?.data)
        };

        payload.push({ ...v });
      }

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

            setData({ ...response?.data?.data ?? {} })
            setIsUpload(false)
          }).catch((error) => console.log(error));
      }
    }
    reader.readAsArrayBuffer(file);
  }

  const openBulk = () => {
    setIsUpload(true)
  }

  const downloadExcel = (failure) => {
    const worksheet = XLSX.utils.json_to_sheet(failure);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
    XLSX.writeFile(workbook, "FailureUsers.xlsx");
  };


  const handleExportDownload = () => {
    let xlData = userData?.map(v => {
      return {
        id: v?.id,
        username: v?.username,
        firstname: v?.firstname,
        lastname: v?.lastname,
        departmentId: v?.department?.id,
        departmentName: v?.department?.name,
        designation: v?.designation,
        email: v?.email,
        contact: v?.telephoneNumber,
        roleId: v?.role?.id,
        roleName: v?.role?.roleName,
      }
    })
    downloadXlsx("UserManagements.xlsx", xlData);
  };

  return (
    <React.Fragment>
      {userRolePermission?.adminPanel && <CreateBulkUploadModal
        data={data?.allData?.map(v => {
          return { ...v, manager: v?.isdefault ? 0 : 1 }
        }) ?? []}
        failureData={data?.failureData ?? []}
        userBulkDataTableHeaders={userBulkDataTableHeaders}
        // isUpload={false}
        isUpload={isUpload}
        downloadExcel={downloadExcel}
        // url={'https://objectstore.e2enetworks.net/enliteu/Bulk_user_upload_template.xlsx'}
        url={'https://objectstore.e2enetworks.net/enliteu/user_upload.xlsx'}
        onSucess={onSucess}
        fileName={state?.uploadData?.name ?? ''}
        handleChange={handleChange}
      />}

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
                <a
                  className="eep-btn eep-btn-success eep-btn-xsml add_bulk_upload_button"
                  data-toggle="modal"
                  data-target="#CreateBulkUploadModal"
                  onClick={openBulk}
                  style={{ color: "#fff" }}
                > <img style={{ width: "20px", marginTop: "-4px" }} src={'/images/Group 106594.svg'} /> Add Bulk Users</a>
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
                {/* {userData && (
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
                      <UserManagementActionDropdown />
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
};
export default UserManagement;
