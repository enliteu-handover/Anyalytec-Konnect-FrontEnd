import { UserManagement } from "@crayond_dev/user-management-test";
import React, { useEffect } from "react";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import { useDispatch } from "react-redux";

const IdmRoleMapping = (props) => {
    const dispatch = useDispatch();
    const breadcrumbArr = [
        {
            label: "Home",
            link: "dashboard",
        },
        {
            label: "Admin Panel",
            link: "app/adminpanel",
        },
        {
            label: "Role",
            link: "",
        },
    ];

    useEffect(() => {
        dispatch(
            BreadCrumbActions.updateBreadCrumb({
                breadcrumbArr,
                title: "Library",
            })
        );
        return () => {
            BreadCrumbActions.updateBreadCrumb({
                breadcrumbArr: [],
                title: "",
            });
        };
    }, []);
    return (
        <UserManagement
            apiUrl="https://dev-idm-api.crayond.com/api/v1"
            apiToken={"ASC4PK0UVE5OOCO8NK"}
            title={"Role Management"}
        />
    );
};
export default IdmRoleMapping; 
