import { UserManagement } from "@crayond_dev/user-management-test";
import React from "react";
import { useSelector } from "react-redux";
import { idmRoleMapping } from ".";
import { URL_CONFIG } from "../constants/rest-config";
import { httpHandler } from "../http/http-interceptor";

const IdmRoleMapping = (props) => {

    const onStatusChangeCallback = () => { };
    const onDeleteRoleCallback = () => { };

    const onEditRoleCallback = (e) => {
        update(e)
    };

    const onAddRoleCallback = (e) => {
        update(e)
    };


    const update = async (data) => {

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
