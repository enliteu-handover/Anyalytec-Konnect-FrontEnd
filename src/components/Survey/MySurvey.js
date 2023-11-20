import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CustomLinkComponent from "../../UI/CustomComponents/CustomLinkComponent";
import DateFormatDisplay from "../../UI/CustomComponents/DateFormatDisplay";
import PageHeader from "../../UI/PageHeader";
import Table from "../../UI/Table";
import TypeBasedFilter from "../../UI/TypeBasedFilter";
import { URL_CONFIG } from "../../constants/rest-config";
import { TYPE_BASED_FILTER } from "../../constants/ui-config";
import { httpHandler } from "../../http/http-interceptor";
import ToggleSidebar from "../../layout/Sidebar/ToggleSidebar";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { pageLoaderHandler } from "../../helpers";

const MySurvey = () => {

	const [toggleClass, setToggleClass] = useState(true);
	const [mySurveyList, setMySurveyList] = useState([]);
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
			label: "Survey",
			link: "app/mysurvey",
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
		pageLoaderHandler('show')
		let obj;
		if (Object.getOwnPropertyNames(paramsInfo)) {
			obj = {
				url: URL_CONFIG.MY_SURVEY,
				method: "get",
				params: paramsInfo
			};
		} else {
			obj = {
				url: URL_CONFIG.MY_SURVEY,
				method: "get"
			};
		}
		httpHandler(obj).then((response) => {
			setMySurveyList(response.data);
			pageLoaderHandler('hide')
		}).catch((error) => {
			setShowModal({
				...showModal,
				type: "danger",
				message: error?.response?.data?.message,
			});
			pageLoaderHandler('hide')
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
		createdAt: {
			classnames: "",
			objReference: "createdAt"
		},
		view: {
			classnames: "",
			label: "View",
			isRedirect: true,
			link: "/app/surveyanswer",
			objReference: { "surveyData": "data" },
		}
	};

	const surveyTableHeaders = [
		{
			fieldLabel: "SURVEY TITLE",
			fieldValue: "survey.name",
		},
		{
			fieldLabel: "Date",
			fieldValue: "action",
			component: <DateFormatDisplay cSettings={tableSettings.createdAt} />,
		},
		{
			fieldLabel: "View",
			fieldValue: "action",
			component: <CustomLinkComponent cSettings={tableSettings.view} />,
		}
	];

	const sideBarClass = (togglestate) => {
		setToggleClass(togglestate);
	}

	return (
		<React.Fragment>
			<PageHeader title="My Survey" filter={<TypeBasedFilter config={TYPE_BASED_FILTER} getFilterParams={getFilterParams} />} />
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
								{mySurveyList && (
									<Table
										component="MySurvey"
										headers={surveyTableHeaders}
										data={mySurveyList}
										tableProps={{
											classes: "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
											id: "user_dataTablee", "aria-describedby": "user_dataTable_info",
											tableId: "MySurveyId"
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

export default MySurvey;