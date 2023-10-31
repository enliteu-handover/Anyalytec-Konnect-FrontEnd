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
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { FILTER_CONFIG } from "../../constants/ui-config";
import Filter from "../../UI/Filter";

const BranchMaster = () => {
    const dispatch = useDispatch();
    const svgIcons = useSelector((state) => state.sharedData.svgIcons);
    const [showModal, setShowModal] = useState({ type: null, message: null });
    const [state, setState] = useState({
        data: {},
        offset: 0,
        limit: 1000,
        showTable: { label: "15", value: 15 }
    })
    const [isOpen, setisOpen] = useState(false)
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

    const fetchAllBrachData = (search, limit, offset, arg = {}) => {


        const obj = {
            url: URL_CONFIG.GET_ALL_BRANCH,
            method: "get",
        };

        if (
            arg?.filterValue &&
            Object.keys(arg.filterValue).length &&
            arg.filterValue.value !== ""
        ) {
            obj["params"] = {
            ...obj["params"],
            active: arg.filterValue.value
            };
        }

        obj["params"] = {
            ...obj["params"],
            offset: state?.offset
        };

        obj["params"] = {
            ...obj["params"],
            limit: state?.limit
        };

        if (state?.search) {
            obj["params"] = {
                ...obj["params"],
                search: state?.search ?? ''
            };
        }

        httpHandler(obj).then((response) => {
            setState({
                ...state,
                // data: { data: response?.data, totalCount: response?.totalCount ?? 0 },
                data: response?.data
            })
        })
        // setEditData(null)
    }

    useEffect(() => {
        fetchAllBrachData()
    }, []);

    const hideModal = () => {
        let collections = document.getElementsByClassName("modal-backdrop");
        for (var i = 0; i < collections.length; i++) {
            collections[i].remove();
        }
        setShowModal({ type: null, message: null });
    };


    const filterOnChangeHandler = (arg) => {
        
        fetchAllBrachData(false, false, false, { filterValue: arg });
    };

    return (
        <React.Fragment>
            <React.Fragment>

                {showModal.type !== null && showModal.message !== null && (
                    <EEPSubmitModal
                        data={showModal}
                        className={`modal-addmessage`}
                        hideModal={hideModal}
                        successFooterData={
                            <button
                                type="button"
                                className="eep-btn eep-btn-xsml eep-btn-success"
                                data-dismiss="modal"
                                onClick={hideModal}
                            >
                                Ok
                            </button>
                        }
                        errorFooterData={
                            <button
                                type="button"
                                className="eep-btn eep-btn-xsml eep-btn-danger"
                                data-dismiss="modal"
                                onClick={hideModal}
                            >
                                Close
                            </button>
                        }
                    ></EEPSubmitModal>
                )}

                {isOpen && <CreateBranchModal
                    setisOpen={setisOpen}
                    showModal={showModal}
                    setShowModal={setShowModal}
                    data={state?.data?.data ?? []}
                    editData={editData} fetchDeptData={fetchAllBrachData} />}

                <PageHeader
                    title="Branch Masters"
                    navLinksRight={
                        <Link
                            className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
                            data-toggle="modal"
                            data-target="#CreateBranchModal"
                            to="#"
                            dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }}
                            onClick={() => {
                                setEditData(null)
                                setisOpen(true)
                            }}
                        ></Link>
                    }
                    filter={
                        <Filter
                            config={FILTER_CONFIG}
                            onFilterChange={filterOnChangeHandler}
                        />
                    }
                ></PageHeader>

                <div className="eep-user-management eep-content-start" id="content-start">
                    <div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }}>
                        <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>
                            {state?.data?.data?.length > 0 &&
                                <TableComponent
                                    data={state?.data?.data ?? []}
                                    columns={userDataTableHeaders}
                                    action={
                                        <BranchMasterActions setisOpen={setisOpen} isDelete={isDelete} getDeptData={getDeptData} />
                                    }
                                />}
                        </div>
                    </div>
                </div>
            </React.Fragment>

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
