import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import PageHeader from "../UI/PageHeader";
import Table from "../UI/Table";
import CheckBoxComponent from "../UI/CustomComponents/CheckBoxComponent";
import DateFormatDisplay from "../UI/CustomComponents/DateFormatDisplay";
import ActionCustomComponent from "../UI/CustomComponents/ActionCustomComponent";
import ResponseInfo from "../UI/ResponseInfo";
import { httpHandler } from "../http/http-interceptor";
import { URL_CONFIG } from "../constants/rest-config";

const Notifications = () => {

	const svgIcons = useSelector((state) => state.sharedData.svgIcons);
	const [notificationList, setNotificationsList] = useState([]);
	const [isChecked, setIsChecked] = useState(false);
	const [checkedData, setCheckedData] = useState([]);
	const [renderTable, setRenderTable] = useState(true);

	const breadcrumbArr = [
		{
			label: "Home",
			link: "app/dashboard",
		},
		{
			label: "Notifications",
			link: "app/notifications",
		},
	];

	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(
			BreadCrumbActions.updateBreadCrumb({
				breadcrumbArr,
				title: "Notifications",
			})
		);
		return () => {
			BreadCrumbActions.updateBreadCrumb({
				breadcrumbArr: [],
				title: "",
			});
		};
	});

	// const allChecke = (e) => {
	// 	setRenderTable(false);
	// 	if (e.target.checked) {
	// 		// setIsAll({ ...isAll, ckeck: true });
	// 		setRenderTable(true);
	// 		const notificationListTemp = JSON.parse(JSON.stringify(notificationList));
	// 		var result = notificationListTemp.map(item => (item.id));
	// 		setCheckedData([...result]);
	// 	} else {
	// 		// setIsAll({ ...isAll, ckeck: false });
	// 		setRenderTable(true);
	// 		setCheckedData([]);
	// 	}
	// 	setIsChecked(current => !current);
	// };

	// const checkBoxHandler = (nData, checkState) => {
	// 	if (nData) {
	// 		if (checkState) {
	// 			let checkDataTemp = checkedData;
	// 			if (!checkDataTemp.includes(nData.id)) {
	// 				checkDataTemp.push(nData.id);
	// 				setCheckedData([...checkDataTemp]);
	// 			}
	// 		}
	// 		if (!checkState) {
	// 			let checkDataTemp = checkedData;
	// 			const nDataIndex = checkDataTemp.findIndex(x => x === nData.id);
	// 			if (nDataIndex > -1) {
	// 				checkDataTemp.splice(nDataIndex, 1);
	// 			}
	// 			setCheckedData([...checkDataTemp]);
	// 		}
	// 	}
	// }

	const allChecke = (e) => {
		setRenderTable(false);
		if (e.target.checked) {
			setTimeout(() => {
				setIsChecked(current => !current);
				setRenderTable(true);
			}, 1);
			const notificationListTemp = JSON.parse(JSON.stringify(notificationList));
			var result = notificationListTemp.map(item => (item.id));
			setCheckedData([...result]);
		} else if (!e.target.checked) {
			setCheckedData([]);
			setTimeout(() => {
				setIsChecked(current => !current);
				setRenderTable(true);
			}, 1);
		}
	};

	const getCheckedData = (checkState, nData) => {
		let checkDataTemp = checkedData;
		if (checkState) {
			checkDataTemp.push(nData.id);
			setCheckedData(checkDataTemp);
		} 
		else {
			checkDataTemp.map((val, index) => {
				if (nData.id === val) {
					checkDataTemp.splice(index, 1);
					setCheckedData([...checkDataTemp]);
				}
			});
		}
		setIsChecked(false);
	}

	const fetchNotifications = () => {
		const obj = {
			url: URL_CONFIG.NOTIFICATIONS_BY_ID,
			method: "get"
		};
		httpHandler(obj)
			.then((response) => {
				//console.log(" fetchNotifications API ===>>>", response.data);
				setNotificationsList(response.data);
			})
			.catch((error) => {
				console.log("fetchNotifications API error", error);
			});
	}

	const readUnreadNotifications = (arg, status) => {
		if (arg) {
			let notificationReadPayload;
			if (status === "read") {
				notificationReadPayload = {
					id: [arg],
					seen: true
				}
			} if (status === "unRead") {
				notificationReadPayload = {
					id: [arg],
					seen: false
				}
			}
			const obj = {
				url: URL_CONFIG.NOTIFICATIONs_READ,
				method: "put",
				payload: notificationReadPayload,
			};
			// console.log("readNotifications Obj :", obj);
			httpHandler(obj)
				.then((response) => {
					fetchNotifications();
					// console.log("readUnreadNotifications response", response.data);
				})
				.catch((error) => {
					console.log("fetchNotifications API error", error);
				});
		}
	}

	const readUnreadAllNotifications = (arg) => {
		if (checkedData.length) {
			let notificationReadPayload;
			if (arg === "readAll") {
				notificationReadPayload = {
					id: checkedData,
					seen: true
				}
			}
			if (arg === "unReadAll") {
				notificationReadPayload = {
					id: checkedData,
					seen: false
				}
			}
			const obj = {
				url: URL_CONFIG.NOTIFICATIONs_READ,
				method: "put",
				payload: notificationReadPayload,
			};
			// console.log("readNotifications Obj :", obj);
			httpHandler(obj)
				.then((response) => {
					// console.log("readUnreadAllNotifications response", response.data);
					fetchNotifications();
				})
				.catch((error) => {
					console.log("fetchNotifications API error", error);
				});
		}
	}

	const clearNotifications = (arg) => {
		let obj;
		if (arg.action === "clear") {
			if (arg.data) {
				obj = {
					url: URL_CONFIG.NOTIFICATIONs_DELETE + "?id=" + arg.data,
					method: "delete",
				};
			}
		}
		if (arg.action === "clearAll") {
			if (checkedData.length) {
				obj = {
					url: URL_CONFIG.NOTIFICATIONs_DELETE + "?id=" + checkedData,
					method: "delete",
				};
			}
		}
		if (obj) {
			console.log("clearNotifications Obj :", obj);
			// httpHandler(obj)
			// 	.then((response) => {
			// 		console.log("readUnreadAllNotifications response", response.data);
			// 		fetchNotifications();
			// 	})
			// 	.catch((error) => {
			// 		console.log("fetchNotifications API error", error);
			// 	});
		}
	}

	useEffect(() => {
		fetchNotifications();
		setRenderTable(true);
	}, []);

	const CustomComponentSettings = {
		date: {
			classnames: "",
			objReference: "date"
		}
	};

	const notificationTableHeaders = [
		{
			fieldLabel: "#",
			fieldValue: "#",
			component: <CheckBoxComponent getCheckedData={getCheckedData} bulkCheckState={isChecked} />,
		},
		{
			fieldLabel: "Title",
			fieldValue: "message",
		},
		{
			fieldLabel: "Src",
			fieldValue: "type",
		},
		{
			fieldLabel: "Date",
			fieldValue: "action",
			component: <DateFormatDisplay cSettings={CustomComponentSettings.date} />,
		},
		{
			fieldLabel: "Action",
			fieldValue: "action",
			component: <ActionCustomComponent readUnreadNotifications={readUnreadNotifications} clearNotifications={clearNotifications} />,
		},
	];

	// console.log("checkedData In :", checkedData);

	return (
		<React.Fragment >
			<PageHeader title="Notifications" />
			{notificationList.length > 0 &&
				<React.Fragment >
					<div className="row no-gutters eep-notification-div">
						<div className="col-md-12 p-0" id="eep-notification-diiv">
							<div className="d-flex  align-items-center align-content-center justify-content-between check_options_div">
								<div className="d-flex align-items-center align-content-center action-border">
									<label className="mb-0 mr-2">Bulk Actions</label>
									<div className={`d-flex align-items-center align-content-center section_one ${isChecked ? "checked" : ""}`}>
										<div className="checkall">
											<input type="checkbox" className="notiCheck mb-0" id="notiCheck_all" checked={isChecked ? true : false} onChange={(e) => allChecke(e)} />
										</div>
										<div className={`clear ${isChecked ? "check_optionsb" : "check_optionsn"}`}>
											<div className=" c1 clear_js clear_icon_div" title="Clear All" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.clear_icon, }} onClick={() => clearNotifications({ data: false, action: "clearAll" })}></div>
										</div>
										<div className={`c1 mark_read_icon_div ${isChecked ? "check_optionsb" : "check_optionsn"}`} title="Mark As Read" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.read, }} onClick={() => readUnreadAllNotifications("readAll")}></div>
										<div className={`c1 mark_unread_icon_div ${isChecked ? "check_optionsb" : "check_optionsn"}`} title="Mark As Unread" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.un_read, }} onClick={() => readUnreadAllNotifications("unReadAll")}></div>
									</div>
								</div>
								<div className="d-flex align-items-center align-content-center action-border">
									<label className="mb-0 mr-2">Options</label>
									<div className="d-flex align-items-center align-content-center section_two">
										<div className="text-center">
											<a href="#" className="p-2" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.colon, }}></a>
											<div className="eep-dropdown-menu dropdown-menu dropdown-menu-left shadow pt-4 pb-4">
												<Link to="#" className="dropdown-item mark_all_raed c1" onClick={() => readUnreadAllNotifications("readAll")} >Mark All As Read</Link>
												<Link to="#" className="dropdown-item mark_all_unraed c1" onClick={() => readUnreadAllNotifications("unReadAll")} >Mark All As Unread</Link>
												<Link to="#" className="dropdown-item clearr c1" onClick={() => clearNotifications({ data: false, action: "clearAll" })}>Clear All</Link>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="eep-user-management eep-content-start" id="content-start">
						<div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }}>
							<div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>
								{renderTable &&

									<Table component="userManagement" headers={notificationTableHeaders} data={notificationList}
										tableProps={{
											classes: "table stripe eep_datatable_table eep_datatable_sm_table dataTable no-footer",
											id: "user_dataTable", "aria-describedby": "user_dataTable_info",
										}}
										action={null}
									></Table>
								}
							</div>
						</div>
					</div>
				</React.Fragment >
			}
			{notificationList.length <= 0 &&
				<div className=" row eep-content-section-data no-gutters response-allign-middle">
					<div className="col-md-12">
						<ResponseInfo title="No record found." responseImg="noRecord" responseClass="response-info" />
					</div>
				</div>
			}
		</React.Fragment >
	);
}
export default Notifications;