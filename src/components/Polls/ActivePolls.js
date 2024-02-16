import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useHistory } from "react-router-dom";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import PageHeader from "../../UI/PageHeader";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import Table from "../../UI/Table";
import ToggleSidebar from "../../layout/Sidebar/ToggleSidebar";
import DateFormatDisplay from "../../UI/CustomComponents/DateFormatDisplay";
import ConfirmStateModal from "../../modals/ConfirmStateModal";
import ResponseCustomComponent from "../../UI/CustomComponents/ResponseCustomComponent";
import PollCustomComponent from "../../UI/CustomComponents/PollCustomComponent";
import PollActions from "../../UI/CustomComponents/PollActions";
import { httpHandler } from "../../http/http-interceptor";
import { REST_CONFIG, URL_CONFIG } from "../../constants/rest-config";
import axios from "axios";
import TableComponent from "../../UI/tableComponent";
import moment from "moment";
import { pageLoaderHandler } from "../../helpers";

const ActivePolls = () => {
	const dispatch = useDispatch();
	const [toggleClass, setToggleClass] = useState(true);
	const [activePollsList, setActivePollsList] = useState([]);
	const [pollTempData, setPollTempData] = useState({});
	const [confirmModalState, setConfirmModalState] = useState(false);
	const [confirmStateModalObj, setConfirmStateModalObj] = useState({ confirmTitle: null, confirmMessage: null });
	const [showModal, setShowModal] = useState({ type: null, message: null });
	const hideModal = () => {
		let collections = document.getElementsByClassName("modal-backdrop");
		for (var i = 0; i < collections.length; i++) {
			collections[i].remove();
		}
		setShowModal({ type: null, message: null });
		setConfirmModalState(false);
		setPollTempData({});
	};
    const [isLoading,setIsLoading] =useState(false)

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
			link: "app/closedpolls",
		},
		{
			label: "Active Polls",
			link: "#",
		}
	]

	useEffect(() => {
		dispatch(
			BreadCrumbActions.updateBreadCrumb({
				breadcrumbArr,
				title: "Poll Results",
			})
		);
		return () => {
			BreadCrumbActions.updateBreadCrumb({
				breadcrumbArr: [],
				title: "",
			});
		};
	}, []);

	const sideBarClass = (tooglestate) => {
		setToggleClass(tooglestate);
	}

	const disableExistModal = () => {
		setConfirmModalState(false);
		setShowModal({ type: null, message: null });
	}

	const deletePoll = (arg) => {
		setPollTempData(arg);
		setConfirmStateModalObj({ confirmTitle: "Are you sure?", confirmMessage: "Do you really want to delete this poll?" });
		setConfirmModalState(true);
	}

	const cSettings = {
		endDate: {
			classnames: "",
			objReference: "endDate"
		},
		response: {
			title: "Response",
			default: "res-red.svg",
			minScore: "res-red.svg",
			avgScore: "res-yellow.svg",
			maxScore: "res-green.svg",
			objReference: "score"
		}
	};

	const ActivePollsTableHeaders = [
		{
			header: "Poll TITLE",
			accessorKey: "name",
		},
		{
			header: "DATE",
			accessorKey: "endDate",
			accessorFn: (row) => row.endDate ? moment(row.endDate).format('l') : '--',

		},
		{
			header: "SCORE",
			accessorKey: "action",
			accessorFn: (row) => <PollCustomComponent data={row} typee="score" />,

		},
		{
			header: "RESPONSE",
			accessorKey: "action",
			accessorFn: (row) => <ResponseCustomComponent data={row} cSettings={cSettings.response} type="polls" />,
		},
	];

	const fetchActivePollData = () => {
		setIsLoading(true)

		const obj = {
			url: URL_CONFIG.ACTIVE_POLLS,
			method: "get"
		};
		httpHandler(obj).then((response) => {
			setActivePollsList(response.data);
			setIsLoading(false)

		}).catch((error) => {
			setShowModal({ ...showModal, type: "danger", message: error?.response?.data?.message, });
			setIsLoading(false)

		});
	}

	useEffect(() => {
		fetchActivePollData();
		pageLoaderHandler(isLoading ? 'show':'hide')

	}, []);

	const confirmState = (isConfirmed) => {

		if (isConfirmed) {
			axios.delete(`${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL}/api/v1${URL_CONFIG.POLL}`, { data: { id: pollTempData.id } })
				.then(() => {
					disableExistModal();
					fetchActivePollData();
				}).catch((error) => {
					const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
					setShowModal({
						...showModal,
						type: "danger",
						message: errMsg,
					});
				});
			// 	let httpObj = {
			// 		url: URL_CONFIG.POLL + "?id=" + pollTempData.id,
			// 		method: "delete"
			// 	};
			// 	httpHandler(httpObj).then(() => {
			// 		disableExistModal();
			// 		fetchActivePollData();
			// 	}).catch((error) => {
			// 		const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
			// setShowModal({
			//   ...showModal,
			//   type: "danger",
			//   message: errMsg,
			// });
			// 	});
		} else {
			setPollTempData({});
		}
	}

	return (
		<React.Fragment>
			<PageHeader title="Active Polls" />
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
			{confirmModalState &&
				<ConfirmStateModal
					hideModal={hideModal}
					confirmState={confirmState}
					confirmTitle={confirmStateModalObj.confirmTitle ? confirmStateModalObj.confirmTitle : "Are you sure?"}
					confirmMessage={confirmStateModalObj.confirmMessage ? confirmStateModalObj.confirmMessage : ""}
				/>
			}
			<div className="eep-container-sidebar h-100 eep_scroll_y">
				<div className="container-sm eep-container-sm">
					<div className={`row eep-create-survey-div eep_with_sidebar ${toggleClass ? "side_open" : ""} vertical-scroll-snap`}>
						<div className="eep_with_content table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }}>
							<div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>

								{!isLoading &&<TableComponent
									data={activePollsList ?? []}
									columns={ActivePollsTableHeaders}
									action={
										<PollActions deletePoll={deletePoll} />
									}
								/>}
							</div>
						</div>
						<ToggleSidebar toggleSidebarType="polls" sideBarClass={sideBarClass} />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default ActivePolls;