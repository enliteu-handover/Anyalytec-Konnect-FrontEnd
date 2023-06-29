import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import PageHeader from "../../UI/PageHeader";
import Toggle from "../../UI/Toggle";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import ConfirmStateModal from "../../modals/ConfirmStateModal";
import ToggleSidebar from "../../layout/Sidebar/ToggleSidebar";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import SurveyCharts from "../Charts/SurveyCharts";

const SurveyResponses = () => {

	const [toggleClass, setToggleClass] = useState(true);
	const [toggleSwitch, setToggleSwitch] = useState(false);
	const [surveyResponseData, setSurveyResponseData] = useState([]);
	const [surveyResponseDataRaw, setSurveyResponseDataRaw] = useState([]);
	const location = useLocation();
	const sDataValue = location.state ? location.state?.surveyData : null;
	const [surveyResponseStateData, setSurveyResponseStateData] = useState(sDataValue);
	const [showModal, setShowModal] = useState({ type: null, message: null });
	const [confirmStateModalObj, setConfirmStateModalObj] = useState({ confirmTitle: null, confirmMessage: null });

	const hideModal = () => {
		let collections = document.getElementsByClassName("modal-backdrop");
		for (var i = 0; i < collections.length; i++) {
			collections[i].remove();
		}
		setShowModal({ type: null, message: null });
	};
	const dispatch = useDispatch();

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
    },
		{
			label: "Survey Responses",
			link: "",
		}
	]

	useEffect(() => {
		dispatch(
			BreadCrumbActions.updateBreadCrumb({
				breadcrumbArr,
				title: "Survey Results",
			})
		);
		return () => {
			BreadCrumbActions.updateBreadCrumb({
				breadcrumbArr: [],
				title: "",
			});
		};
	}, []);

	const defaultChartOptions = {
		"radio-group": {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45
        }
      },
      series: []
    },
		"radio-group1": {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45
        }
      },
      series: [{
        name: 'E-Cards',
        data: [
          ['Birthday', 16],
          ['Anniversary', 12],
          ['Appreciation', 8],
          ['Seasonal', 8]
        ]
      }]
    },
		"checkbox-group": {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
        }
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          }
        }
      },
      series: []
    },
		"select": {
      chart: {
        renderTo: 'container',
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 50,
          viewDistance: 25
        }
      },
      xAxis: {},
      yAxis: {
        title: {
          enabled: false
        }
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Response: {point.y}'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          depth: 25
        }
      },
      series: []
    }
	}

	const sideBarClass = (tooglestate) => {
		setToggleClass(tooglestate);
	}

	const fetchSurveyResponses = (surData) => {
		if(surData && Object.keys(surData).length) {
			const obj = {
				url: URL_CONFIG.SURVEY_RESPONSE,
				method: "get",
				params: {id: surData?.id}
			};
			httpHandler(obj).then((response) => {
				setSurveyResponseDataRaw(response.data);
				let sResponseItemData = [];
				response.data.length && response.data.map((item) => {
					item.surveyResponseItems && item.surveyResponseItems.length && item.surveyResponseItems.map((subItem) => {
						sResponseItemData.push(subItem);	
					})
					return sResponseItemData;
				});

				const groupedMap = sResponseItemData.reduce(
					(entryMap, e) => entryMap.set(e.surveyQuestion.id, [...entryMap.get(e.surveyQuestion.id)||[], e]),
					new Map()
				);
				const arr = Array.from(groupedMap, function (item) {
					return { key: item[0], value: item[1], surveyQuestion:item[1][0]["surveyQuestion"], type:item[1][0]["type"] }
				});
				setSurveyResponseData(arr);
			}).catch((error) => {
				setShowModal({
					...showModal,
					type: "danger",
					message: error?.response?.data?.message,
				});
			});
		}
	}

	useEffect(() => {
		fetchSurveyResponses(surveyResponseStateData);
	}, [surveyResponseStateData]);


	const getValueCount = (data, filterValue) => {
		let lgth = data.filter(x => {
			return x.value === filterValue
		}).length
		return lgth;
	}

	const getMultipleValueCount = (data, filterValue) => {
		let answerCountVal = 0;
		data.filter(y => {
			const array = y.value.split(',');
			if(array.indexOf(filterValue) !== -1){
				answerCountVal += 1;
			}
			return answerCountVal;
		})
		return answerCountVal;
	}

	const modalState = () => {
		setToggleSwitch(true);
		setConfirmStateModalObj({ confirmTitle: "Are you sure?", confirmMessage: "Do you wish to accept/cancel further response to the survey?" });
	}

	const confirmState = (arg) => {
		if (arg) {
			const obj = {
				url: URL_CONFIG.SURVEY_ACCEPT_RESPONSE+"?id="+surveyResponseStateData.id+"&response="+(surveyResponseStateData.acceptResponse ? "0" : "1"),
				method: "put"
			};
			httpHandler(obj).then(() => {
				setShowModal({
					...showModal,
					type: "success",
					message: surveyResponseStateData.acceptResponse ? "Survey dined for further responses" : "Survey accepted for further responses",
				});
				let surveyResponseStateDataTemp = JSON.parse(JSON.stringify(surveyResponseStateData)); 
				if(surveyResponseStateData.acceptResponse) {
					surveyResponseStateDataTemp["acceptResponse"] = false;
					setSurveyResponseStateData({...surveyResponseStateDataTemp});
				} else {
					surveyResponseStateDataTemp["acceptResponse"] = true;
					setSurveyResponseStateData({...surveyResponseStateDataTemp});
				}
			}).catch((error) => {
				const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
				setShowModal({
					...showModal,
					type: "danger",
					message: errMsg,
				});
			});
			setToggleSwitch(false);
		} else {
			setToggleSwitch(false);
		}
	}

	const getQuestionName = (qParamater) => {
		let qParamaterTemp = JSON.parse(qParamater.parameters);
		return qParamaterTemp.label;
	}

	const getChartData = (chartData) => {
		let chartOptionsTemp = {};
		if(chartData) {
			if(chartData.type === "radio-group") {
				chartOptionsTemp = JSON.parse(JSON.stringify(defaultChartOptions[chartData.type]));
				chartOptionsTemp["series"] = [];
				let optionsTemp = JSON.parse(chartData.surveyQuestion.parameters);
				let valTemp = [...new Set(optionsTemp.values.map(item => item.value))];
				let optionDataTemp = valTemp && valTemp.length && valTemp.map((vItem) => {
					let countVal = getValueCount(chartData.value, vItem);
					return [vItem, countVal];
				})
				chartOptionsTemp["series"] = [{
					name: "",
					data: optionDataTemp
				}];
				return chartOptionsTemp;
			}
			if(chartData.type === "checkbox-group") {
				chartOptionsTemp = JSON.parse(JSON.stringify(defaultChartOptions[chartData.type]));
				chartOptionsTemp["series"] = [];
				let optionsTemp = JSON.parse(chartData.surveyQuestion.parameters);
				let valTemp = [...new Set(optionsTemp.values.map(item => item.value))];
				let optionDataTemp = valTemp && valTemp.length && valTemp.map((vItem) => {
					let countVal = getMultipleValueCount(chartData.value, vItem);
					return [vItem, countVal];
				})
				chartOptionsTemp["series"] = [{
					type: 'pie',
					name: "",
					data: optionDataTemp
				}];
				return chartOptionsTemp;
			}
			if(chartData.type === "select") {
				chartOptionsTemp = JSON.parse(JSON.stringify(defaultChartOptions[chartData.type]));
				chartOptionsTemp["series"] = [];
				let optionsTemp = JSON.parse(chartData.surveyQuestion.parameters);
				let valTemp = [...new Set(optionsTemp.values.map(item => item.value))];
				let optionDataTemp = valTemp && valTemp.length && valTemp.map((vItem) => {
					let countVal = getMultipleValueCount(chartData.value, vItem);
					return countVal;
				})
				chartOptionsTemp["xAxis"] = {categories: valTemp};
				chartOptionsTemp["series"] = [{data: optionDataTemp, colorByPoint: true}];
				return chartOptionsTemp;
			}
		}
	}

	return (
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

	{toggleSwitch &&
		<ConfirmStateModal hideModal={hideModal} confirmState={confirmState} confirmTitle={confirmStateModalObj.confirmTitle} confirmMessage={confirmStateModalObj.confirmMessage} />
	}

	<PageHeader title="Survey Results" toggle={<Toggle modalState={modalState} checkState={surveyResponseStateData?.acceptResponse} />} />
	<div className="eep-container-sidebar h-100 eep_scroll_y">
		<div className="container-sm eep-container-sm">
			<div className={`row eep-create-survey-div eep_with_sidebar ${toggleClass ? "side_open" : ""} vertical-scroll-snap`}>
				<div className="eep_with_content table-responsive eep_datatable_table_div p-3" style={{ visibility: "visible" }}>

					<div className="d-flex mb-3">
						<h3 className="mb-0">{surveyResponseStateData?.name}</h3>
						<div className="ml-auto my-auto">
							<h3 className="mb-0">{surveyResponseStateData?.response}/{surveyResponseDataRaw?.length}</h3>
						</div>
					</div>

					{surveyResponseData && surveyResponseData?.length > 0 && surveyResponseData?.map((sData) => {
						if(sData && (sData.type === "radio-group" || sData.type === "checkbox-group" || sData.type === "select")) {
							return (
								<div className="col-md-12 px-0 mb-3">
									<div className="bg-white br-10 h-100 border border-1">
										<div className="p-3">
											<h5 className="">{getQuestionName(sData.surveyQuestion)}</h5>
											<div className="row justify-content-center">
												<div className="col-6">
													<SurveyCharts chartData={getChartData(sData)}  />
												</div>
											</div>
										</div>
									</div>
								</div>
							)
						}
						if(sData && (sData.type === "text" || sData.type === "textarea")) {
							return (
								<div className="col-md-12 px-0 mb-3">
									<div className="bg-white br-15 h-100 border border-1">
										<div className="p-3">
											<h5 className="">{getQuestionName(sData.surveyQuestion)}</h5>
											{sData.value.length && sData.value.map((item) => {
												return (
													<div className="bg-f5f5f5 mb-2 br-5">
														<div className="p-2">
															<span>{item.value}</span>
														</div>
													</div>
												)
											})}
										</div>
									</div>
								</div>
							)
						}
					})}

					{surveyResponseData && surveyResponseData.length <= 0 &&
						<div className="eep_blank_div">
							<img src={process.env.PUBLIC_URL + "/images/icons/static/noData.svg"} alt="no-data-icon" />
							<p className="eep_blank_quote">No record found</p>
						</div>
					}

				</div>
				<ToggleSidebar toggleSidebarType="survey" sideBarClass={sideBarClass} />
			</div>
		</div>
	</div>
		</React.Fragment>
	);
}

export default SurveyResponses;