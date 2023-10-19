import React from "react";
import { UserManagement } from "@crayond_dev/user-management-test";
import { URL_CONFIG } from "../constants/rest-config";
import { httpHandler } from "../http/http-interceptor";
import { useSelector } from "react-redux";
import { idmRoleMapping } from ".";

const IdmRoleMapping = (props) => {
    const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

    const onStatusChangeCallback = () => { };
    const onDeleteRoleCallback = () => { };

    const onEditRoleCallback = (e) => {
        debugger
        update(e)
    };

    const onAddRoleCallback = (e) => {
        debugger
        update(e)
    };


    const update = async (data) => {
        debugger

        const roleData = await idmRoleMapping(data?.id);
        let payOptionsRole = {
            idm_id: data?.id,
            role_name: data?.name,
            screen: roleData?.data
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
