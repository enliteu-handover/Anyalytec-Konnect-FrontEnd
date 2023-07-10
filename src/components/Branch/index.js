import React, { useState, useEffect } from "react";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { useDispatch, useSelector } from "react-redux";
import ResponseInfo from "../../UI/ResponseInfo";
import PageHeader from "../../UI/PageHeader";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import BranchMasterActions from "../../UI/CustomComponents/branchMasterAction";
import CreateBranchModal from "../../modals/CreateBranchModal";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import TableComponent from "../../UI/tableComponent";

const BranchMaster = () => {
    const dispatch = useDispatch();
    const svgIcons = useSelector((state) => state.sharedData.svgIcons);
    const [state, setState] = useState({
        data: {},
        offset: 0,
        limit: 15,
        showTable: { label: "15", value: 15 }
    })
    const [editData, setEditData] = useState(null)

    const isDelete = (argu) => {
    };
    const getDeptData = (argu) => {
        setEditData(argu);
    };

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
            label: "Branch Master",
            link: "",
        },
    ];

    const userDataTableHeaders = [
        {
            header: "Country",
            accessorKey: "country.countryName",
        },
        {
            header: "Branch Name",
            accessorKey: "name",
        },
        {
            header: "Discription",
            accessorKey: "description",
        },
        // {
        //     header: "Action",
        //     accessorKey: "action",
        //     component: <BranchMasterActions isDelete={isDelete} getDeptData={getDeptData} />,
        // },
    ];

    useEffect(() => {
        dispatch(
            BreadCrumbActions.updateBreadCrumb({
                breadcrumbArr,
                title: "Department Master",
            })
        );
    }, [breadcrumbArr, dispatch]);

    const fetchAllBrachData = (search, limit, offset) => {
        debugger
        const obj = {
            url: URL_CONFIG.GET_ALL_BRANCH + `?offset=${offset ?? state?.offset}` + `&limit=${limit ?? state?.limit}` + `&search=${search ? search : ""}`,
            method: "get",
        };
        httpHandler(obj).then((response) => {
            debugger
            setState({
                ...state,
                // data: { data: response?.data, totalCount: response?.totalCount ?? 0 },
                data: response?.data
            })
        })
        // setEditData(null)
    }

    useEffect(() => {
        debugger
        fetchAllBrachData()
    }, []);

    return (
        <React.Fragment>
            <React.Fragment>
                <CreateBranchModal editData={editData} fetchDeptData={fetchAllBrachData} />
                <PageHeader
                    title="Branch Masters"
                    navLinksRight={
                        <Link
                            className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                            data-toggle="modal"
                            data-target="#CreateBranchModal"
                            to="#"
                            dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }}
                            onClick={() => setEditData(null)}
                        ></Link>
                    }
                ></PageHeader>
                <div className="eep-user-management eep-content-start" id="content-start">
                    <div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }}>
                        <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>
                            {state?.data?.data?.length > 0 && <TableComponent
                                data={state?.data?.data ?? []}
                                columns={userDataTableHeaders}
                                action={
                                    <BranchMasterActions isDelete={isDelete} getDeptData={getDeptData} />
                                }
                            />}
                        </div>
                    </div>
                </div> </React.Fragment>
            {!state?.data?.data?.length > 0 &&
                <div className="row eep-content-section-data no-gutters">
                    <ResponseInfo
                        title="No branch you have!."
                        responseImg="noRecord"
                        responseClass="response-info"
                    />
                </div>
            }
        </React.Fragment>
    );
};
export default BranchMaster;
