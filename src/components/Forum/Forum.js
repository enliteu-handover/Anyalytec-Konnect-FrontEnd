import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import PageHeader from "../../UI/PageHeader";
import ResponseInfo from "../../UI/ResponseInfo";
import TypeBasedFilter from "../../UI/TypeBasedFilter";
import { URL_CONFIG } from "../../constants/rest-config";
import { TYPE_BASED_FILTER } from "../../constants/ui-config";
import { pageLoaderHandler } from "../../helpers";
import { httpHandler } from "../../http/http-interceptor";
import CreateEditCommunicationModal from "../../modals/CreateEditCommunicationModal";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { TabsActions } from "../../store/tabs-slice";
import ForumFollowingList from "./ForumFollowingList";
import ForumHotTopicsList from "./ForumHotTopicsList";
import ForumList from "./ForumList";
import MyForumPosts from "./MyForumPosts";

const Forum = () => {

	const [departments, setDepartments] = useState([]);
	const [createModalShow, setCreateModalShow] = useState(false);
	const [listReverse, setListReverse] = useState(false);
	const [createModalErr, setCreateModalErr] = useState("");
	const [usersPic, setUsersPic] = useState([]);
	const [showModal, setShowModal] = useState({ type: null, message: null });
	const [forumList, setForumList] = useState([]);
	const [forumFollowingList, setForumFollowingList] = useState([]);
	const [filterParams, setFilterParams] = useState({});
	const svgIcons = useSelector((state) => state.sharedData.svgIcons);
	const userData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};

	const dispatch = useDispatch();
	const activeTab = useSelector((state) => state.tabs.activeTab);
	const location = useLocation();
	const history = useHistory();
	const routerData = location.state;

	const breadcrumbArr = [
		{
			label: "Home",
			link: "app/dashboard",
		},
		{
			label: "COMMUNICATIONS",
			link: "app/communication",
		},
		{
			label: "Forum",
			link: "",
		},
	];

	useEffect(() => {
		dispatch(
			BreadCrumbActions.updateBreadCrumb({
				breadcrumbArr,
				title: "Forum",
			})
		);
		return () => {
			BreadCrumbActions.updateBreadCrumb({
				breadcrumbArr: [],
				title: "",
			});
		};
	}, []);

	const tabConfig = [
		{
			title: "Forum Pot",
			id: "forumpot"
		},
		{
			title: "My Posts",
			id: "myforums"
		}
	];

	useEffect(() => {
		if (routerData) {
			const activeTabId = routerData.activeTab;
			tabConfig.map((res) => {
				if (res.id === activeTabId) {
					return res.active = true
				}
			});

			dispatch(
				TabsActions.updateTabsconfig({
					config: tabConfig,
				})
			);
			history.replace({ pathname: history.location.pathname, state: {} });
		} else {
			dispatch(
				TabsActions.updateTabsconfig({
					config: tabConfig,
				})
			);
		}

		return () => {
			dispatch(
				TabsActions.updateTabsconfig({
					config: [],
				})
			);
		};
	}, []);

	const hideModal = () => {
		let collections = document.getElementsByClassName("modal-backdrop");
		for (var i = 0; i < collections.length; i++) {
			collections[i].remove();
		}
		setShowModal({ type: null, message: null });
	};

	const getDepartments = () => {
		const obj = {
			url: URL_CONFIG.ALLDEPARTMENTS,
			method: "get",
			params: { active: true },
		};
		httpHandler(obj)
			.then((depts) => {
				const deptData = [];
				depts.data.map((res) => {
					return deptData.push({
						value: res.id,
						label: res.name,
						//id: res.id,
					});
				});
				setDepartments(deptData);
			})
			.catch((error) => {
				console.log("getDepartments error", error);
				//const errMsg = error.response?.data?.message;
			});
	};

	const createCommunicationPost = (arg) => {

		let formData = new FormData();
		if (arg.files && arg.files.length > 0) {
			arg.files.map((item) => {
				const fileType = item?.type;
				return formData.append('file', item);
			});
		}
		let forumRequestObj = {
			title: arg.title,
			description: arg.description,
			active: true,
			dept: arg.dept,
			existForumDep: null,
			existForumAttach: null
		};
		formData.append('forumrequest', JSON.stringify(forumRequestObj)
		);
		const obj = {
			url: URL_CONFIG.FORUM,
			method: "post",
			formData: formData,
		};
		httpHandler(obj)
			.then((response) => {
				getForumList(filterParams);
				setCreateModalShow(false);
				setShowModal({
					...showModal,
					type: "success",
					message: response?.data?.message,
				});
			})
			.catch((error) => {
				const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
				setCreateModalErr(errMsg);
			});
	};

	const getFilterParams = (paramsData) => {
		if (Object.getOwnPropertyNames(filterParams)) {
			setFilterParams({ ...paramsData });
		} else {
			setFilterParams({});
		}
		getForumList(paramsData);
	}

	const getForumList = (paramsInfo) => {
		
		pageLoaderHandler('show')
		let obj;
		if (Object.getOwnPropertyNames(paramsInfo)) {
			obj = {
				url: URL_CONFIG.GET_FORUM_LIST,
				method: "get",
				params: paramsInfo
			};
		} else {
			obj = {
				url: URL_CONFIG.GET_FORUM_LIST,
				method: "get"
			};
		}
		httpHandler(obj)
			.then((forumdata) => {
				forumdata?.data?.sort((a, b) => a.id - b.id);
				if (listReverse) {
					setForumList([...forumdata?.data]);
				} else {
					setForumList([...forumdata?.data].reverse());
				}
				pageLoaderHandler('hide')
			})
			.catch((error) => {
				pageLoaderHandler('hide')
				console.log("getForumList error", error);
			});
	};

	const fetchAllUsersPics = () => {
		const obj = {
			url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
			method: "get"
		};
		httpHandler(obj)
			.then((response) => {
				let userPicTempArry = [];
				response.data.map((item) => {
					if (item?.imageByte?.image) {
						userPicTempArry.push(
							{
								"id": item.id,
								"pic": item?.imageByte?.image
							}
						)
					}
					return userPicTempArry;
				});
				setUsersPic(userPicTempArry);
			})
			.catch((error) => {
				console.log("ALLUSERS API error => ", error);
			});
	};

	const getForumFollowingList = () => {
		const obj = {
			url: URL_CONFIG.FORUM_FOLLOWING,
			method: "get",
		};
		httpHandler(obj)
			.then((forumdata) => {
				setForumFollowingList(forumdata.data);
			})
			.catch((error) => {
				console.log("getForumList error", error);
				//const errMsg = error.response?.data?.message;
			});
	}

	useEffect(() => {
		getDepartments();
		fetchAllUsersPics();
	}, []);

	useEffect(() => {
		
		if (activeTab?.id === "forumpot") {
			getForumList(filterParams);
			getForumFollowingList();
		}
	}, []);


	const readForum = (arg) => {

		if (arg) {
			if (!arg.fData.forumIsRead) {
				const obj = {
					url: URL_CONFIG.FORUM_READ_UNREAD,
					//  + "?id=" + arg.fData.id,
					payload: { id: arg.fData.id },
					method: "post"
				};
				httpHandler(obj)
					.then(() => {
						if (arg.isRedirect) {
							history.push('forumdetailview', { forumData: arg.fData, usersPicData: usersPic });
						}
						if (!arg.isRedirect) {
							getForumList(filterParams);
						}
					})
					.catch((error) => {
						const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
						setShowModal({
							...showModal,
							type: "danger",
							message: errMsg,
						});
					});
			}
			if (arg.fData.forumIsRead) {
				history.push('forumdetailview', { forumData: arg.fData, usersPicData: usersPic });
			}
		}
	}

	let unReadIndex = 0;
	const unReadForum = (forumData) => {

		if (forumData) {
			// unReadIndex = forumData.forumRead.findIndex(x => x.userId.id === userData.id);
			const obj = {
				url: URL_CONFIG.FORUM_READ_UNREAD,
				//  + "?id=" + forumData.forumRead[unReadIndex].id,
				payload: { id: forumData.forumRead[unReadIndex].id },
				method: "put"
			};
			httpHandler(obj)
				.then(() => {
					let forumListTemp = JSON.parse(JSON.stringify(forumList));
					if (forumListTemp.length > 0) {
						forumListTemp.map((item) => {
							if (item.id === forumData.id) {
								item.forumIsRead = false;
								item.forumRead.splice(unReadIndex, 1);
							}
							return forumListTemp;
						});
					}
					if (listReverse) {
						setForumList([...forumListTemp].reverse());
					} else {
						setForumList([...forumListTemp]);
					}
				})
				.catch((error) => {
					const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
					setShowModal({
						...showModal,
						type: "danger",
						message: errMsg,
					});
				});
		}
	}

	let followIndex = 0;
	const unFollowForum = (followInfo) => {

		if (followInfo) {
			// followIndex = followInfo?.forumFollowing?.findIndex(x => x?.userId?.id === userData?.id);
			const obj = {
				url: URL_CONFIG.FORUM_FOLLOWING,
				//  + "?id=" + followInfo.forumFollowing[followIndex].id,
				payload: { id: followInfo.forumFollowing[followIndex].id },
				method: "put"
			};
			httpHandler(obj)
				.then(() => {
					let forumListTemp = JSON.parse(JSON.stringify(forumList));
					if (forumListTemp.length > 0) {
						forumListTemp.map((item) => {
							if (item.id === followInfo.id) {
								item.forumIsfollowing = false;
								item.forumFollowing.splice(followIndex, 1);
							}
							return forumListTemp;
						});
					}
					if (listReverse) {
						setForumList([...forumListTemp].reverse());
					} else {
						setForumList([...forumListTemp]);
					}
				})
				.catch((error) => {
					const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
					setShowModal({
						...showModal,
						type: "danger",
						message: errMsg,
					});
				});
		}
	}

	const followForum = (arg) => {

		const obj = {
			url: URL_CONFIG.FORUM_FOLLOWING,
			//  + "?id=" + arg.id,
			payload: { id: arg.id },
			method: "post"
		};
		httpHandler(obj)
			.then(() => {
				getForumList(filterParams);
			})
			.catch((error) => {
				const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
				setShowModal({
					...showModal,
					type: "danger",
					message: errMsg,
				});
			});
	}

	const readAll = (isReadAll) => {
		if (isReadAll) {
			const obj = {
				url: URL_CONFIG.FORUM_READ_ALL,
				method: "post"
			};
			httpHandler(obj).then(() => {
				getForumList(filterParams);
			}).catch((error) => {
				const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
				setShowModal({
					...showModal,
					type: "danger",
					message: errMsg,
				});
			});
		}
	}

	const dateReceived = (isSort) => {
		
		setListReverse(isSort);
		if (!isSort) {
			setForumList([...forumList].reverse());
		}
	}

	return (
		<React.Fragment>
			<div className="row eep-content-section-data no-gutters">
				<div className="tab-content col-md-12 h-100 response-allign-middle">
					<div id="forumpot" className="tab-pane active h-100">
						{showModal.type !== null && showModal.message !== null && (
							<EEPSubmitModal
								data={showModal}
								className={`modal-addmessage`}
								hideModal={hideModal}
								successFooterData={
									<Link to="#" type="button" className="eep-btn eep-btn-xsml eep-btn-success" onClick={hideModal}> Ok </Link>
								}
								errorFooterData={
									<button type="button" className="eep-btn eep-btn-xsml eep-btn-danger" data-dismiss="modal" onClick={hideModal}>Close</button>
								}
							></EEPSubmitModal>
						)}
						{createModalShow && <CreateEditCommunicationModal deptOptions={departments} createModalShow={createModalShow} createCommunicationPost={createCommunicationPost} communicationModalErr={createModalErr} communicationType="forum" communicationData={null} />}
						<PageHeader title="Forum"
							navLinksRight={
								<a className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg c1" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus }} data-toggle="modal" data-target="#CreateEditCommunicationModal" onClick={() => setCreateModalShow(true)}></a>
							}
							filter={
								<TypeBasedFilter config={TYPE_BASED_FILTER} getFilterParams={getFilterParams} />
							}
						/>
						{forumList?.length > 0 &&
							<div className="row mx-0 forum_containerr">
								<div className="col-md-6 eep-content-section-data eep_scroll_y pl-0">
									{/* <div className="col-xs-12 col-sm-12 col-md-7 col-lg-7 col-xl-7 pl-0 eep-content-section-data eep_scroll_y"> */}
									{activeTab && activeTab.id === 'forumpot' && <ForumList forumList={forumList} userImageArr={usersPic} readForum={readForum} unReadForum={unReadForum} unFollowForum={unFollowForum} followForum={followForum} readAll={readAll} dateReceived={dateReceived} />}
								</div>
								<div className="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-xl-6 px-0">
									{/* <div className="col-xs-12 col-sm-12 col-md-5 col-lg-5 col-xl-5 px-0 "> */}
									<div className="forum_hottopics_wrapper_bg forum_hottopics_wrapper eep-content-section-data eep_scroll_y">
										<div className="forum_shortlist_div sticky_position forum_hottopics_wrapper_bg pb-1">
											<ul className="nav nav-tabs card-header-tabs forum_rightdiv_filter m-0" id="myTab" role="tablist">
												<li className="nav-item">
													<a className="nav-link forum_hot active c1" id="one-tab" data-toggle="tab" href="#HotTopics" role="tab" aria-controls="One" aria-selected="true">
														<div className="forum_rightnav_action forum_hottopic_img_content d-flex align-items-center c1 forumj_hot_topic forum_bgcolor_selected_tap">
															<div className="forum-eep-right-tab" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.hottopics_icon }}></div>
															<div className="hot_topic_btn">Hot Topics</div>
														</div>
													</a>
												</li>
												<li className="nav-item">
													<a className="nav-link forum_follow c1" id="two-tab" data-toggle="tab" href="#Following" role="tab" aria-controls="Two" aria-selected="false">
														<div className="forum_rightnav_action forum_following_img_content d-flex align-items-center c1 forumj_following forum_bgcolor_selected_tap">
															<div className="forum-eep-right-tab" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.following_icon }}></div>
															<div className="following_topic_btn">Following</div>
														</div>
													</a>
												</li>
											</ul>
										</div>
										<div className="tab-content" id="myTabContent">
											<div className="tab-pane fade show active" id="HotTopics" role="tabpanel" aria-labelledby="one-tab">
												<ForumHotTopicsList forumList={forumList} usersPic={usersPic} />
											</div>
											<div className="tab-pane fade" id="Following" role="tabpanel" aria-labelledby="two-tab">
												<ForumFollowingList forumFollowingList={forumFollowingList} usersPic={usersPic} />
											</div>
										</div>
									</div>
								</div>
							</div>
						}
						{!forumList.length &&
							<ResponseInfo
								title="No topics yet. Start yours!"
								responseImg="noForumShare"
								responseClass="response-info"
								messageInfo="Good communication is the bridge between confusion and clarity"
								subMessageInfo="Nat Turner"
							/>
						}
					</div>
					<div id="myforums" className="tab-pane h-100">
						{/* <PageHeader title="My Posts"
							navLinksLeft={
								<Link to="#" className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.lessthan_circle }}></Link>
							}
							filter={
								<Filter config={HIDE_SHOW_FILTER_CONFIG} />
							}
						/> */}
						{activeTab && activeTab.id === 'myforums' && <MyForumPosts usersPic={usersPic} deptOptions={departments} />}
					</div>
				</div>
			</div>
		</React.Fragment>
	);
}

export default Forum;