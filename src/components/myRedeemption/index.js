import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ResponseInfo from "../../UI/ResponseInfo";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import "./style.css";

const MyProfileCoupon = (props) => {

    const dispatch = useDispatch();
    const [state, setState] = useState({
        data: []
    });

    const breadcrumbArr = [
        {
            label: "Home",
            link: "app/dashboard",
        },
        {
            label: "redeem",
            link: "",
        },
    ];

    useEffect(() => {
        dispatch(
            BreadCrumbActions.updateBreadCrumb({
                breadcrumbArr,
                title: "redeem",
            })
        );
        fetchRedeem();
    }, []);

    const fetchRedeem = () => {
        const obj = {
            url: URL_CONFIG.GET_REDEEM,
            method: "get",
        };
        httpHandler(obj)?.then((response) => {
            setState({
                ...state,
                data: response?.data?.data ?? []
            })
        })
    }

    return (
        <div className="main">
            {state?.data?.length > 0 ? <table>
                <thead>
                    <tr>
                        <th>S No</th>
                        <th>Image</th>
                        <th>Title</th>
                        <th>Points</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <br />
                <tbody>
                    {state?.data?.map((v, i) => {
                        return <tr>
                            <th>{i + 1}</th>
                            <th><img className="icon_image" src={v?.image ?? ''} /></th>
                            <th>{v?.name ?? ''}</th>
                            <th>{v?.points ?? ''}</th>
                            <th>{v?.created_at ?? ''}</th>
                        </tr>
                    })}
                </tbody>
            </table> :
                <ResponseInfo
                    title="No Record!"
                    responseImg="noRecord"
                    responseClass="response-info"
                    messageInfo="Good communication is the bridge between confusion and clarity"
                    subMessageInfo="Nat Turner"
                />
            }


        </div>
    );
};
export default MyProfileCoupon;