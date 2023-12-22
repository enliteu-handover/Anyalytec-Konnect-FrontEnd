import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ResponseInfo from "../../UI/ResponseInfo";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import "./style.css";
import TableComponent from "../../UI/tableComponent";
import moment from "moment";

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
            label: "Redemptions",
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
    const headers = [
        
        {
          header: "Image",
          accessorKey: "image",
          // eslint-disable-next-line jsx-a11y/alt-text
          accessorFn: (row) => <img style={{width:'80px'}} className="icon_image" src={row?.image ?? ''} />,
        },
        {
          header: "Title",
          accessorKey: "name",
        },
        
        {
          header: "Redeem Points",
          accessorKey: "points",
        },
        {
          header: "Redeem On",
          accessorKey: "created_at",
        accessorFn: (row) => row.created_at? moment(row.created_at).format('l'):'--',
        },
      ];
    return (
         <TableComponent
         data={state?.data ?? []}
         columns={headers}
         actionHidden={true}
         enableRowNumbers={true}
         />
    );
};
export default MyProfileCoupon;