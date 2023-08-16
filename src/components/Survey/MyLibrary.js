import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import PageHeader from "../../UI/PageHeader";
import TypeBasedFilter from "../../UI/TypeBasedFilter";
import { TYPE_BASED_FILTER } from "../../constants/ui-config";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import Table from "../../UI/Table";
import ToggleSidebar from "../../layout/Sidebar/ToggleSidebar";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import DateFormatDisplay from "../../UI/CustomComponents/DateFormatDisplay";
import CustomLinkComponent from "../../UI/CustomComponents/CustomLinkComponent";

const MyLibrary = () => {

    const [toggleClass, setToggleClass] = useState(true);
    const [librarySurveyList, setlibrarySurveyList] = useState([]);
    const [filterParams, setFilterParams] = useState({});
    const [showModal, setShowModal] = useState({ type: null, message: null });
    const dispatch = useDispatch();
    const hideModal = () => {
        let collections = document.getElementsByClassName("modal-backdrop");
        for (var i = 0; i < collections.length; i++) {
            collections[i].remove();
        }
        setShowModal({ type: null, message: null });
    };

    const breadcrumbArr = [
        {
            label: "Home",
            link: "app/dashboard",
        },
        {
            label: "Communication",
            link: "app/communication",
        },
        {
            label: "Library Survey",
            link: "app/surveylibrary",
        }
    ]

    useEffect(() => {
        dispatch(
            BreadCrumbActions.updateBreadCrumb({
                breadcrumbArr,
                title: "My Survey",
            })
        );
        return () => {
            BreadCrumbActions.updateBreadCrumb({
                breadcrumbArr: [],
                title: "",
            });
        };
    }, []);

    const fetchMySurveyDetail = (paramsInfo) => {
        let obj;
        if (Object.getOwnPropertyNames(paramsInfo)) {
            obj = {
                url: URL_CONFIG.GET_LIBRARY_SURVEY,
                method: "get",
                params: paramsInfo
            };
        } else {
            obj = {
                url: URL_CONFIG.GET_LIBRARY_SURVEY,
                method: "get"
            };
        }
        httpHandler(obj).then((response) => {
            setlibrarySurveyList(response.data);
        }).catch((error) => {
            setShowModal({
                ...showModal,
                type: "danger",
                message: error?.response?.data?.message,
            });
        });
    }

    useEffect(() => {
        fetchMySurveyDetail(filterParams);
    }, []);

    const getFilterParams = (paramsData) => {
        if (Object.getOwnPropertyNames(filterParams)) {
            setFilterParams({ ...paramsData });
        } else {
            setFilterParams({});
        }
        fetchMySurveyDetail(paramsData);
    }

    const tableSettings = {
        created_at: {
            classnames: "",
            objReference: "created_at"
        },
        view: {
            classnames: "",
            label: "View",
            isRedirect: true,
            link: "/app/surveylibraray",
            objReference: { "surveyData": "data" },
        }
    };

    const surveyTableHeaders = [
        {
            fieldLabel: "SURVEY TITLE",
            fieldValue: "name",
        },
        {
            fieldLabel: "Date",
            fieldValue: "action",
            component: <DateFormatDisplay cSettings={tableSettings.created_at} />,
        },
        {
            fieldLabel: "View",
            fieldValue: "action",
            component: <CustomLinkComponent isLibrary={true} cSettings={tableSettings.view} />,
        }
    ];

    const sideBarClass = (togglestate) => {
        setToggleClass(togglestate);
    }

    return (
        <React.Fragment>
            <PageHeader title="Library Survey"
                filter={<TypeBasedFilter config={TYPE_BASED_FILTER}
                    getFilterParams={getFilterParams} />}
            />
            {showModal.type !== null && showModal.message !== null && (
                <EEPSubmitModal data={showModal} className={`modal-addmessage`} hideModal={hideModal}
                    successFooterData={
                        <button type="button" className="eep-btn eep-btn-xsml eep-btn-success" data-dismiss="modal" onClick={hideModal}> Ok </button>
                    }
                    errorFooterData={
                        <button type="button" className="eep-btn eep-btn-xsml eep-btn-danger" data-dismiss="modal" onClick={hideModal}> Close </button>
                    }
                ></EEPSubmitModal>
            )}
            <div className="eep-container-sidebar h-100 eep_scroll_y">
                <div className="container-sm eep-container-sm">
                    <div className={`row eep-create-survey-div eep_with_sidebar ${toggleClass ? "side_open" : ""} vertical-scroll-snap`}>
                        <div className="eep_with_content table-responsive eep_datatable_table_div px-3 py-0 mt-3" style={{ visibility: "visible" }}>
                            <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>
                                {librarySurveyList && (
                                    <Table
                                        component="LibrarySurvey"
                                        headers={surveyTableHeaders}
                                        data={librarySurveyList}
                                        tableProps={{
                                            classes: "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
                                            id: "user_dataTablee", "aria-describedby": "user_dataTable_info",
                                            tableId: "LibrarySurveyId"
                                        }}
                                        action={null}
                                    ></Table>
                                )}
                            </div>
                        </div>
                        <ToggleSidebar toggleSidebarType="survey" sideBarClass={sideBarClass} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

export default MyLibrary;