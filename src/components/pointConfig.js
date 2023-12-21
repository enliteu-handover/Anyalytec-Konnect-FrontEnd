import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../UI/PageHeader";
import ResponseInfo from "../UI/ResponseInfo";
import TableComponent from "../UI/tableComponent";
import { URL_CONFIG } from "../constants/rest-config";
import { httpHandler } from "../http/http-interceptor";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import WalletComponent from "./walletComponent";

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

    const fetchpointsConfig = () => {
        const obj = {
            url: URL_CONFIG.GET_POINTS_CONFIG,
            method: "get",
        };
        httpHandler(obj)
            .then((response) => {
                let uniqueCountriesMap = new Map();
                let filteredData = [];
                response?.data?.data?.forEach(entry => {
                    const countryId = entry?.country_id;
                    if (!uniqueCountriesMap.has(countryId)) {
                        uniqueCountriesMap.set(countryId, true);
                        filteredData.push(entry);
                    }
                });
                setPointsConfig(filteredData ?? []);
            })
            .catch((error) => {
                console.log("ACTIVE_pointsConfig", error.response);
            });
    };

    useEffect(() => {
        fetchpointsConfig();
    }, []);

    const pointsConfigTableHeaders = [
        {
            header: "Country",
            accessorKey: "country_name",
        },
        {
            header: "Currency",
            accessorKey: "country_symbol",
        },
        {
            header: "View Per Point",
            accessorKey: "value_peer_points",
            accessorFn: (row) => <WalletComponent inputkey={'value_peer_points'} row={row} addWalletPoints={addWalletPoints} />
        }
    ];

    const addWalletPoints = async (point, data) => {

        const obj = {
            url: URL_CONFIG.ADD_POINTS_CONFIG,
            method: "post",
            payload: {
                ...point,
                id: data?.id
            }
        };
        await httpHandler(obj);
        await fetchpointsConfig();
    };

    return (
        <React.Fragment>
            {userRolePermission?.adminPanel &&
                <React.Fragment>
                    <PageHeader title="Points Config" />
                    <TableComponent
                        data={pointsConfig ?? []}
                        columns={pointsConfigTableHeaders}
                        actionHidden={true}
                    />
                </React.Fragment>
            }

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