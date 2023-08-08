// import React, { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { URL_CONFIG } from "../../constants/rest-config";
// import { httpHandler } from "../../http/http-interceptor";
// import { LoaderHandler, idmRoleMapping } from "../../idm";
// import { sharedDataActions } from "../../store/shared-data-slice";

// const RolePermissions = () => {

//   const dispatch = useDispatch();


//   const fetchPermission = async () => {
//     LoaderHandler('show');
//     const obj = {
//       url: URL_CONFIG.USER_PERMISSION,
//       method: "get",
//     };
//     httpHandler(obj).then(async (response) => {
//       const roleData = await idmRoleMapping(response?.data?.roleId?.idmID);
//       console.log('roleData', roleData);
//       dispatch(sharedDataActions.getUserRolePermission({
//         userRolePermission: roleData?.data
//       }));

//       let payOptionsRole = {
//         data: roleData?.rolesData,
//         role_id: roleData?.roleId,
//         screen: JSON.stringify(roleData?.data)
//       };

//       const objRole = {
//         url: URL_CONFIG.ADDROLE,
//         method: "post",
//         payload: payOptionsRole,
//       };

//       await httpHandler(objRole)
//       LoaderHandler('hide');
//           // const payOptions = {
//       //   // id: rsid,
//       //   role: {
//       //     id: roleData?.roleId
//       //   },
//       //   screen: {}
//       // }
//       // const obj = {
//       //   url: URL_CONFIG.ROLE_SCREEN_MAPPING,
//       //   method: "put",
//       //   payload: payOptions,
//       // };
//       // httpHandler(obj);
//     }).catch((error) => {
//       console.log("fetchPermission error", error);
//     });
//   }

//   useEffect(() => {
//     fetchPermission();
//   }, []);

//   return (
//     <React.Fragment>

//     </React.Fragment>
//   );

// }
// export default RolePermissions;
