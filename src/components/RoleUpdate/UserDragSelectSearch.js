import React, { useEffect, useState } from "react";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import Select from "react-select";
import { useSelector } from "react-redux";
const UserDragSelectSearch = (props) => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const { userData, getRolesFn, onDragDeptSelected, onDragRoleSelected } =
    props;
  const [deptValue, setDeptValue] = useState(null);
  const [departments, setDepartments] = useState([]);

  const [roleValue, setRoleValue] = useState(null);
  const [roles, setRoles] = useState([]);

  const getDepartments = () => {
    const obj = {
      url: URL_CONFIG.ALLDEPARTMENTS,
      method: "get",
    };
    httpHandler(obj)
      .then((depts) => {
        const deptData = [];
        depts.data.map((res) => {
          deptData.push({
            value: res.name,
            label: res.name,
          });
        });
        setDepartments(deptData);
      })
      .catch((error) => {
        console.log("error", error);
        const errMsg = error.response?.data?.message;
      });
  };

  const getRoles = () => {
    const obj = {
      url: URL_CONFIG.ALLROLES,
      method: "get",
    };
    httpHandler(obj)
      .then((roles) => {
        const rolesData = [];
        roles.data.map((res) => {
          rolesData.push({
            value: res.id,
            label: res.roleName,
          });
        });
        getRolesFn(rolesData);
        setRoles(rolesData);
      })
      .catch((error) => {
        console.log("error", error);
        const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    getDepartments();
    getRoles();
  }, []);

  const onDeptChangeHandler = (eve) => {
    const value = eve ? eve.value : null;
    onDragDeptSelected(value);
    setDeptValue(eve);
    setRoleValue(null);
  };

  const onRolesChangeHandler = (eve) => {
    const value = eve ? eve.value : null;
    onDragRoleSelected(value);
    setRoleValue(eve);
    setDeptValue(null);
    // setRoleSelected(eve.value);
    // setDeptSelected("");
    // const filteredDeptData = userData.filter(
    //   (res) => res["role"]["roleName"] === deptSelected
    // );
    // setFilteredUserData(filteredDeptData);
  };

  return (
    <div className="urm_select_container">
      <div className="urm_search_container">
        <div className="urm_title">USERS</div>
        {/* <div className="search_icon c1">
          <span className="search_input_field">
            <input
              type="text"
              id="left_search"
              className="assign_search_text"
              autoComplete="off"
              placeholder="Search..."
            />
          </span>
          <span
            className="search_icon_img"
            dangerouslySetInnerHTML={{
              __html: svgIcons && svgIcons.search_icon,
            }}
          ></span>
        </div> */}
      </div>
      <div className="urm_select_container_inner_div">
        <div className="urm_department_select" id="urm_department">
          <Select
            options={departments}
            placeholder="ALL DEPARTMENTS"
            classNamePrefix="eep_select_common select"
            isSearchable={true}
            isClearable={true}
            value={deptValue}
            // className={`form-control  basic-single`}
            style={{ height: "auto" }}
            // menuPlacement="top"
            onChange={(event) => onDeptChangeHandler(event)}
            maxMenuHeight={200}
          />
        </div>
        <div className="urm_all_select" id="urm_all">
          <Select
            options={roles}
            placeholder="SELECT ROLE"
            classNamePrefix="eep_select_common select"
            isSearchable={true}
            isClearable={true}
            value={roleValue}
            // className={`form-control  basic-single`}
            style={{ height: "auto" }}
            // menuPlacement="top"
            onChange={(event) => onRolesChangeHandler(event)}
            maxMenuHeight={200}
          />
        </div>
      </div>
    </div>
  );
};
export default UserDragSelectSearch;
