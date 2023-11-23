import { UserManagement } from "@crayond_dev/user-management-test";
import React from "react";
import { idmRoleMappingRoles } from ".";
import { URL_CONFIG } from "../constants/rest-config";
import { httpHandler } from "../http/http-interceptor";
import { getRoles, initializeIDM, validateAuthorization } from '@crayond_dev/idm-client';

const IdmRoleMapping = (props) => {

    const onStatusChangeCallback = () => { };
    const onDeleteRoleCallback = () => { };

    const onEditRoleCallback = (e) => {
        setTimeout(async () => {
            await update(e)
        }, 1000);
    };

    const onAddRoleCallback = (e) => {
        
        setTimeout(async () => {
            await update(e)
        }, 1000);
    };


    const update = async (data) => {
        const roleData = await idmRoleMappingRoles(data?.id);
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
                // onStatusChangeCallback={(e) => onStatusChangeCallback(e)}
                // onEditRoleCallback={(e) => onEditRoleCallback(e)}
                // onDeleteRoleCallback={(e) => onDeleteRoleCallback(e)}
                // onAddRoleCallback={(e) => onAddRoleCallback(e)}
                apiToken={"ASC4PK0UVE5OOCO8NK"}
            />
        </div>
    );
};
export default IdmRoleMapping; 
