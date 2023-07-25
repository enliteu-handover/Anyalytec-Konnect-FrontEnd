import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
// import { httpHandler } from "../../http/http-interceptor";
// import { URL_CONFIG } from "../../constants/rest-config";
import { idmRoleMapping } from "../../idm";
import { sharedDataActions } from "../../store/shared-data-slice";

const RolePermissions = () => {

  const dispatch = useDispatch();

  const fetchPermission = async () => {
    const roleData = await idmRoleMapping('admin');
    dispatch(sharedDataActions.getUserRolePermission({
      userRolePermission: roleData
    }));
    return
    // const obj = {
    //   url: URL_CONFIG.USER_PERMISSION,
    //   method: "get",
    // };
    // httpHandler(obj).then((response) => {
    //   dispatch(sharedDataActions.getUserRolePermission({
    //     userRolePermission: response?.data?.screen
    //   }))
    // }).catch((error) => {
    //   console.log("fetchPermission error", error);
    // });
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
