import React from "react";
import { UserManagement } from "@crayond_dev/user-management-test";
import { URL_CONFIG } from "../constants/rest-config";
import { httpHandler } from "../http/http-interceptor";
import { useSelector } from "react-redux";

const IdmRoleMapping = (props) => {
    const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

    const onStatusChangeCallback = () => { };
    const onDeleteRoleCallback = () => { };
    const onEditRoleCallback = (e) => {
        
        update(e)
    };
    const onAddRoleCallback = (e) => {
        
        update(e)
    };


    const update = async (data) => {
        
        let payOptionsRole = {
            idm_id: data?.rolesData,
            role_name: data?.roleId,
            screen: userRolePermission
        };

        const objRole = {
            url: URL_CONFIG.ADDROLE,
            method: "post",
            payload: payOptionsRole,
        };

        await httpHandler(objRole)
    }

    return (
        <div className="">
            <UserManagement
                apiUrl="https://dev-idm-api.crayond.com/api/v1"
                onStatusChangeCallback={onStatusChangeCallback}
                onEditRoleCallback={onEditRoleCallback}
                onDeleteRoleCallback={onDeleteRoleCallback}
                onAddRoleCallback={onAddRoleCallback}
            />
        </div>
    );
};
export default IdmRoleMapping; 
