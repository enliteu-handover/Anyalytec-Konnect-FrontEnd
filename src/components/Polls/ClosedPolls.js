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
import TableComponent from "../../UI/tableComponent";
import moment from "moment";

const ClosedPolls = (props) => {

	const [toggleClass, setToggleClass] = useState(true);
	const [myPollsList, setMyPollsList] = useState([]);
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
			label: "COMMUNICATION",
			link: "app/communication",
		},
		{
			label: "POLL",
			link: "",
		}
	]

	useEffect(() => {
		dispatch(
			BreadCrumbActions.updateBreadCrumb({
				breadcrumbArr,
				title: "My Polls",
			})
		);
		return () => {
			BreadCrumbActions.updateBreadCrumb({
				breadcrumbArr: [],
				title: "",
			});
		};
	}, []);

	const fetchMyPollsDetail = (paramsInfo) => {
		pageLoaderHandler('show')
		let obj;
		if (Object.getOwnPropertyNames(paramsInfo)) {
			obj = {
				url: URL_CONFIG.CLOSED_POLLS,
				method: "get",
				params: paramsInfo
			};
		} else {
			obj = {
				url: URL_CONFIG.CLOSED_POLLS,
				method: "get"
			};
		}
		httpHandler(obj).then((response) => {
			setMyPollsList(response.data);
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
		fetchMyPollsDetail(filterParams);
	}, []);

	const tableSettings = {
		createdAt: {
			classnames: "",
			objReference: "createdAt"
		},
		view: {
			classnames: "",
			label: "View",
			isRedirect: true,
			link: "/app/pollanswer",
			objReference: { "pollData": "data", "viewType": "fromPoll" },
		}
	};

	const PollsTableHeaders = [
		{
			header: "POLL TITLE",
			accessorKey: "polls.name",
		},
		{
			header: "Date",
			accessorKey: "createdAt",
			accessorFn: (row) => moment(row.createdAt).format('l'), 
			// component: <DateFormatDisplay cSettings={tableSettings.createdAt} />,
		},
		// {
		// 	fieldLabel: "View",
		// 	fieldValue: "action",
		// 	component: <CustomLinkComponent cSettings={tableSettings.view} />,
		// }
	];

	const sideBarClass = (togglestate) => {
		setToggleClass(togglestate);
	}

	const getFilterParams = (paramsData) => {
		if (Object.getOwnPropertyNames(filterParams)) {
			setFilterParams({ ...paramsData });
		} else {
			setFilterParams({});
		}
		fetchMyPollsDetail(paramsData);
	}

	return (
		<React.Fragment>
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
			<PageHeader title="Closed Polls" filter={<TypeBasedFilter config={TYPE_BASED_FILTER} getFilterParams={getFilterParams} />} />
			<div className="eep-container-sidebar h-100 eep_scroll_y">
				<div className="container-sm eep-container-sm">
					<div className={`row eep-create-survey-div eep_with_sidebar ${toggleClass ? "side_open" : ""} vertical-scroll-snap`}>
						<div className="eep_with_content table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }}>
							<div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>
								{myPollsList && (
									// <Table component="MySurvey" headers={PollsTableHeaders} data={myPollsList}
									// 	tableProps={{
									// 		classes: "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
									// 		id: "user_dataTablee", "aria-describedby": "user_dataTable_info",
									// 		tableId: "MyPollsId"
									// 	}}
									// 	action={null}
									// ></Table>

									<TableComponent
									data={myPollsList ?? []}
									columns={PollsTableHeaders}
									action={<CustomLinkComponent cSettings={tableSettings.view} />}
								  />
								)}
							</div>
						</div>
						<ToggleSidebar toggleSidebarType="polls" sideBarClass={sideBarClass} />
					</div>
				</div>
			</div>
		</React.Fragment>
	)
}

export default ClosedPolls;