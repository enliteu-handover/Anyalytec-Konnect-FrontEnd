import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { URL_CONFIG } from "../constants/rest-config";
import { httpHandler } from "../http/http-interceptor";
import { BreadCrumbActions } from "../store/breadcrumb-slice";

const WalletRecharge = () => {

    const dispatch = useDispatch();
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
            label: "Wallet Recharge",
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

    const addWalletRechargeAmount = async (point, data) => {

        const obj = {
            // url: URL_CONFIG.ADD_POINTS_CONFIG,
            method: "post",
            payload: {
                ...point,
            }
        };
        await httpHandler(obj);
        fetchWallet();
    };

    // useEffect(() => {
    //     fetchWallet();
    // }, []);

    return (
        <React.Fragment>
            <div className="row">
                <div className="col-md-4">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        <input type="number" placeholder="Enter the amount"
                            className="tableinput form-control field-input"
                        />
                        <div className="tableButton ml-1">
                            <button className="small-eep-btn eep-btn-success"
                            >{'Save'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};
export default WalletRecharge;