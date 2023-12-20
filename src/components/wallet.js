import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../UI/PageHeader";
import ResponseInfo from "../UI/ResponseInfo";
import TableComponent from "../UI/tableComponent";
import { URL_CONFIG } from "../constants/rest-config";
import { httpHandler } from "../http/http-interceptor";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import WalletComponent from "./walletComponent";

const Wallet = () => {

    const dispatch = useDispatch();
    const svgIcons = useSelector((state) => state.sharedData.svgIcons);
    const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

    const [wallet, setWallet] = useState([]);

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
            label: "Wallet",
            link: "",
        },
    ];

    useEffect(() => {
        dispatch(
            BreadCrumbActions.updateBreadCrumb({
                breadcrumbArr,
                title: "Wallet",
            })
        );
    }, [breadcrumbArr, dispatch]);

    const fetchWallet = () => {
        
        const obj = {
            url: URL_CONFIG.GET_POINTS_CONFIG,
            method: "get",
        };
        httpHandler(obj)
            .then((response) => {
                setWallet(response?.data?.data ?? []);
            })
            .catch((error) => {
                console.log("ACTIVE_Wallet", error.response);
            });
    };

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
        await fetchWallet();
    };

    useEffect(() => {
        fetchWallet();
    }, []);

    const walletTableHeaders = [
        {
            header: "Country",
            accessorKey: "country_name",
        },
        {
            header: "Branch",
            accessorKey: "branch_name",
        },
        {
            header: "Available Points",
            accessorKey: "available_value",
        },
        {
            header: "Optimal Value",
            accessorKey: "optimal_value",
            accessorFn: (row) => <WalletComponent inputkey={'optimal_value'} row={row} addWalletPoints={addWalletPoints} />
        }, {
            header: "Allocated Value",
            accessorKey: "allocated_value",
            accessorFn: (row) => <WalletComponent inputkey={'allocated_value'} row={row} addWalletPoints={addWalletPoints} />,
        }
    ];

    return (
        <React.Fragment>
            {userRolePermission?.adminPanel &&
                <React.Fragment>
                    <PageHeader title="Wallet" />
                    <TableComponent
                        data={wallet ?? []}
                        columns={walletTableHeaders}
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
export default Wallet;