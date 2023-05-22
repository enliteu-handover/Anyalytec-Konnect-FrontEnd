import React, { useEffect, useState } from "react";
import PageHeader from "../UI/PageHeader";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Table from "../UI/Table";
import { httpHandler } from "../http/http-interceptor";
import { URL_CONFIG } from "../constants/rest-config";
import { FILTER_CONFIG } from "../constants/ui-config";
import Filter from "../UI/Filter";
import UserManagementActionDropdown from "../UI/CustomComponents/UserManagementActionDropdown";
import ResponseInfo from "../UI/ResponseInfo";

const UserManagement = () => {

  const [userData, setUserData] = useState([]);
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
        setUserData(userData.data);
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

  return (
    <React.Fragment>
      {userRolePermission.adminPanel &&
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
              <Filter
                config={FILTER_CONFIG}
                onFilterChange={filterOnChangeHandler}
              />
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
