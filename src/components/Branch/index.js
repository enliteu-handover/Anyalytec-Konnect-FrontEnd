import React, { useState, useEffect } from "react";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { useDispatch, useSelector } from "react-redux";
import Table from "../../UI/Table";
import ResponseInfo from "../../UI/ResponseInfo";
import PageHeader from "../../UI/PageHeader";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import BranchMasterActions from "../../UI/CustomComponents/branchMasterAction";
import CreateBranchModal from "../../modals/CreateBranchModal";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";

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
            fieldLabel: "Country",
            fieldValue: "country.countryName",
        },
        {
            fieldLabel: "Branch Name",
            fieldValue: "name",
        },
        {
            fieldLabel: "Discription",
            fieldValue: "description",
        },
        {
            fieldLabel: "Action",
            fieldValue: "action",
            component: <BranchMasterActions isDelete={isDelete} getDeptData={getDeptData} />,
        },
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
        const obj = {
            url: URL_CONFIG.GET_ALL_BRANCH + `?offset=${offset ?? state?.offset}` + `&limit=${limit ?? state?.limit}` + `&search=${search ? search : ""}`,
            method: "get",
        };
        httpHandler(obj).then((response) => {
            setState({
                ...state,
                data: { data: response?.data, totalCount: 60 }
            })
        })
        setEditData(null)
    }

    useEffect(() => {
        fetchAllBrachData()
    }, []);

    const isSearch = (value) => {
        fetchAllBrachData(value.target.value)
    }
    const isPrev = () => {
        if (state.offset > 0) {
            const limit = state.limit - state.showTable?.value
            const offset = state.offset - state.showTable?.value
            setState({
                ...state,
                limit,
                offset
            })
            fetchAllBrachData('', limit, offset)
        }
    }
    const isNext = () => {
        if (state.limit < state?.data?.totalCount) {
            const limit = state.limit + state.showTable?.value
            const offset = state.limit
            setState({
                ...state,
                limit,
                offset
            })
            fetchAllBrachData('', limit, offset)
        }

    }
    const defualtonChange = (k, v) => {
        const limit = v?.value
        const offset = 0
        state.limit = limit
        state.offset = offset
        state[k] = v
        setState({
            ...state,
        })
        fetchAllBrachData('', limit, offset)
    };

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
                        ></Link>
                    }
                ></PageHeader>
                <div className="eep-user-management eep-content-start" id="content-start">
                    <div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }}>
                        <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>
                                <Table
                                    isSearch={isSearch}
                                    isPage={true}
                                    offset={state?.offset}
                                    limit={state?.limit}
                                    showTable={state?.showTable}
                                    isPrev={isPrev}
                                    isNext={isNext}
                                    defualtonChange={defualtonChange}
                                    component="branchMaster"
                                    headers={userDataTableHeaders}
                                    data={state?.data?.data}
                                    totalCount={state?.data?.totalCount}
                                    tableProps={{
                                        classes:
                                            "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
                                        id: "user_dataTable_branch",
                                        "aria-describedby": "user_dataTable_info",
                                    }}
                                    action={null}
                                ></Table>
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
