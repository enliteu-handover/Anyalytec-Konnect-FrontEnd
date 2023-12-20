import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../UI/PageHeader";
import ResponseInfo from "../UI/ResponseInfo";
import { URL_CONFIG } from "../constants/rest-config";
import { httpHandler } from "../http/http-interceptor";
import { BreadCrumbActions } from "../store/breadcrumb-slice";

const PointsConfig = () => {

    const dispatch = useDispatch();
    const svgIcons = useSelector((state) => state.sharedData.svgIcons);
    const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

    const [pointsConfig, setPointsConfig] = useState([]);

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
            label: "points Config",
            link: "",
        },
    ];

    useEffect(() => {
        dispatch(
            BreadCrumbActions.updateBreadCrumb({
                breadcrumbArr,
                title: "pointsConfig",
            })
        );
    }, [breadcrumbArr, dispatch]);

    const fetchpointsConfig = (arg) => {
        const obj = {
            url: URL_CONFIG.ACTIVE_pointsConfig,
            method: "get",
            params: { active: arg },
        };
        httpHandler(obj)
            .then((pointsConfig) => {
                setPointsConfig(pointsConfig.data);
            })
            .catch((error) => {
                console.log("ACTIVE_pointsConfig", error.response);
            });
    };

    useEffect(() => {
        fetchpointsConfig();
    }, []);


    return (
        <React.Fragment>
            {userRolePermission?.adminPanel &&
                <React.Fragment>
                    <PageHeader title="pointsConfig" />
                    view
                </React.Fragment>
            }

            {pointsConfig?.length == 0 && <div style={{ marginLeft: "40%" }}>No Data!.</div>}
            {!userRolePermission?.adminPanel &&
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
export default PointsConfig;