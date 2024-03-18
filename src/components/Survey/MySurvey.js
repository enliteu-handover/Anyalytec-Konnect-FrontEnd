import moment from "moment/moment";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CustomLinkComponent from "../../UI/CustomComponents/CustomLinkComponent";
import PageHeader from "../../UI/PageHeader";
import TypeBasedFilter from "../../UI/TypeBasedFilter";
import TableComponent from "../../UI/tableComponent";
import { URL_CONFIG } from "../../constants/rest-config";
import { TYPE_BASED_FILTER } from "../../constants/ui-config";
import { pageLoaderHandler } from "../../helpers";
import { httpHandler } from "../../http/http-interceptor";
import ToggleSidebar from "../../layout/Sidebar/ToggleSidebar";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";

const MySurvey = () => {

	const [toggleClass, setToggleClass] = useState(true);
	const [mySurveyList, setMySurveyList] = useState([]);
	const [filterParams, setFilterParams] = useState({});
	const [showModal, setShowModal] = useState({ type: null, message: null });
	const dispatch = useDispatch();

    const [isLoading,setIsLoading] =useState(false)

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
		setIsLoading(true)

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
			setIsLoading(false)

		}).catch((error) => {
			setShowModal({
				...showModal,
				type: "danger",
				message: error?.response?.data?.message,
			});
			setIsLoading(false)

		});
	}

	useEffect(() => {
		fetchMySurveyDetail(filterParams);
		pageLoaderHandler(isLoading ? 'show':'hide')

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
			header: "SURVEY TITLE",
			accessorKey: "survey.name",
		},
		{
			header: "Date",
			accessorKey: "createdAt",
			accessorFn: (row) => row.createdAt ? moment(row.createdAt).format('l') : '--',
		},
		
		{
			header: "View",
			accessorKey: "action",
			accessorFn: (row) => <CustomLinkComponent data={row} cSettings={tableSettings.view} />,
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

							{!isLoading &&	<TableComponent
									data={mySurveyList ?? []}
									columns={surveyTableHeaders}
									actionHidden={true}

									// action={<CustomLinkComponent cSettings={tableSettings.view} />}
								/>}
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