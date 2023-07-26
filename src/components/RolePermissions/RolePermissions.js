import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import { idmRoleMapping } from "../../idm";
import { sharedDataActions } from "../../store/shared-data-slice";

const RolePermissions = () => {

  const dispatch = useDispatch();

  const fetchPermission = async () => {
    const obj = {
      url: URL_CONFIG.USER_PERMISSION,
      method: "get",
    };
    httpHandler(obj).then(async (response) => {
      const roleData = await idmRoleMapping(response?.data?.roleId?.roleName);
      console.log('roleData', roleData);
      dispatch(sharedDataActions.getUserRolePermission({
        userRolePermission: roleData
      }));
    }).catch((error) => {
      console.log("fetchPermission error", error);
    });
  }

  useEffect(() => {

    fetchPermission();
  }, []);

  return (
    <React.Fragment>

    </React.Fragment>
  );

}
export default RolePermissions;
