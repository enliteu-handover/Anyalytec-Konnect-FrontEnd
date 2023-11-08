import React, { useEffect, useState } from "react";
import Select from "react-select";
import DatePicker from "react-datepicker";
import ReactTooltip from "react-tooltip";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import { formatTime, getMonthNumber } from "../../shared/SharedService";

const NominateAwardModalInput = (props) => {

  const { nomiDeptOptions, allUsers, judgeUsersData, nominateTypeDatas, getAssignObject, getSelectedMonth } = props;

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  var initNominateType = "nonschedule";
  const [nominateType, setNominateType] = useState(initNominateType);
  const [nominatorUsers, setNominatorUsers] = useState([]);
  const [nominationDate, setNominationDate] = useState();
  const [judgeUsers, setJudgeUsers] = useState([]);
  //const [scheduleTime, setScheduleTime] = useState(new Date());
  const [scheduleTime, setScheduleTime] = useState();
  const [nominateMonth, setNominateMonth] = useState();
  const [nominateImmediate, setNominateImmediate] = useState(false);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [monthOptions, setMonthOptions] = useState([]);
  const [selectedDate, setSelectedDate] = useState({ value: 1, label: 1 });
  const [nomiDapartment, setNomiDapartment] = useState({});
  const [nominatorValue, setNominatorValue] = useState({});
  const [judgeValue, setJudgeValue] = useState({});

  const asgnObj = {
    award: {},
    judgeId: {},
    nominatorId: {},
    type: "",
    nomiImmediate: false,
    scheduleTime: "",
    params: {}
  }
  const [assignObject, setAssignObject] = useState(asgnObj);

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {

    setJudgeUsers([...judgeUsersData]);
  }, [judgeUsersData]);

  useEffect(() => {
    setNominateMonth(null);
    setNominationDate(null);
    setScheduleTime(null);
  }, []);

  useEffect(() => {
    setDefaultValues();
  }, []);

  useEffect(() => {
    if (nominateMonth) {
      const selectedMonthArr = [];
      const selectedMonth = nominateMonth.getMonth();
      let iterationCount = 0;

      if (nominateType === 'Quarterly' || nominateType === 'Half_Yearly' || nominateType === 'Yearly') {

        if (nominateType === 'Quarterly') {
          iterationCount = 3;
        } else if (nominateType === 'Half_Yearly') {
          iterationCount = 6;
        }

        let initVal = selectedMonth;
        let selectedYear = nominateMonth.getFullYear();
        selectedMonthArr.push({
          month: months[initVal],
          year: selectedYear,
          date: selectedDate.value,
          index: initVal
        });

        if (nominateType !== 'Yearly') {
          for (let i = 0; i <= (12 / iterationCount) - 2; i++) {

            initVal = initVal + iterationCount;
            if (initVal > 11) {
              let diffValue = initVal - 12;
              initVal = diffValue;
              selectedYear = selectedYear + 1;
            }

            selectedMonthArr.push({
              month: months[initVal],
              year: selectedYear,
              date: selectedDate.value,
              index: initVal
            });
          }
        }

        for (let i = 0; i < selectedMonthArr.length; i++) {
          const daysInMonth = new Date(selectedMonthArr[i]['year'], selectedMonthArr[i]['index'] + 1, 0).getDate();
          if ((Number(selectedDate.value) <= daysInMonth)) {
            selectedMonthArr[i].date = selectedDate.value;
          } else {
            selectedMonthArr[i].date = daysInMonth;
          }
        }

        getSelectedMonth(selectedMonthArr);
      }
    }
  }, [selectedDate, nominateMonth]);

  const setDefaultValues = () => {
    const days = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const options = [];
    for (let i = 1; i <= days; i++) {
      options.push({
        value: String(i),
        label: String(i)
      })
    }
    setMonthOptions(options);
    setNomiDapartment('');
    setNominatorValue('');
    setJudgeValue('');
    //setSelectedDate(options[0]);
  }

  const changeDepartmentHandler = (event) => {
    let value1 = event ? event.value : "";
    setNomiDapartment(event);
    if (value1) {
      const obj = {
        url: URL_CONFIG.DEPT_USERS,
        method: "get",
        params: { dept: value1 },
      };
      httpHandler(obj)
        .then((uData) => {
          let optionsTemp = [];
          uData.data.map((uValue) => {
            if (uValue?.userId !== JSON.parse(sessionStorage.getItem('userData'))?.id) {
              optionsTemp.push({ value: uValue.id, label: uValue.firstname + ' ' + uValue.lastname });
            }
          });

          setNominatorUsers(
            optionsTemp
          );
        })
        .catch((error) => {

        });
    }
  };

  const changeNominatorHandler = (event) => {
    const value1 = event ? event.value : "";
    setNominatorValue(event);
    let assignObjectTemp = JSON.parse(JSON.stringify(assignObject));
    assignObjectTemp.nominatorId = { id: value1 };
    setAssignObject(assignObjectTemp);
    getAssignObject(assignObjectTemp);
  };

  const changeJudgeHandler = (event) => {
    const value1 = event ? event.value : "";
    setJudgeValue(event);
    let assignObjectTemp = JSON.parse(JSON.stringify(assignObject));
    assignObjectTemp.judgeId = { id: value1 };
    setAssignObject(assignObjectTemp);
    getAssignObject(assignObjectTemp);
  };

  const changeImmediateHandler = (e) => {
    const { checked } = e.target;
    setNominateImmediate(checked);
    let assignObjectTemp = JSON.parse(JSON.stringify(assignObject));
    assignObjectTemp.nomiImmediate = checked;
    setAssignObject(assignObjectTemp);
    getAssignObject(assignObjectTemp);
  }

  const formatDate = (date) => {
    let d = new Date(date);
    let month = (d.getMonth() + 1).toString().padStart(2, '0');
    let day = d.getDate().toString().padStart(2, '0');
    let year = d.getFullYear();
    return [day, month, year].join('-');
    //const [dateStr] = new Date(date).toISOString().split('T')
    //return dateStr;
  }

  const updateParams = (nType, nDate, nMonth, nStDate, nEdDate, asgnObj = null) => {

    let assignObjectTemp = {};

    if (asgnObj) {
      assignObjectTemp = JSON.parse(JSON.stringify(asgnObj));
    } else {
      assignObjectTemp = JSON.parse(JSON.stringify(assignObject));
    }

    assignObjectTemp.type = nType;
    assignObjectTemp.params = {};
    if (nType === "Between_Dates") {
      assignObjectTemp.params = {
        a_startdate: formatDate(nStDate),
        a_enddate: formatDate(nEdDate)
      };
    }
    else if (nType === "Yearly") {
      assignObjectTemp.params = {
        n_scheduleYearDay: nDate,
        nomiYearMonth: getMonthNumber(nMonth)
      };
    }
    else if (nType === "Half_Yearly") {
      assignObjectTemp.params = {
        n_scheduleHalfDay: nDate,
        nomiHalfMonth: getMonthNumber(nMonth)
      };
    }
    else if (nType === "Quarterly") {
      assignObjectTemp.params = {
        n_scheduleQuarterDay: nDate,
        nomiQuarterMonth: getMonthNumber(nMonth)
      };
    }
    else if (nType === "Monthly") {
      assignObjectTemp.params = {
        n_scheduleDay: nDate
      };

      setDefaultValues();
    } else if (nType === "nonschedule") {
      delete assignObjectTemp.params;
      delete assignObjectTemp.scheduleTime;
    } else {
      assignObjectTemp.params = {};
    }
    setAssignObject(assignObjectTemp);
    getAssignObject(assignObjectTemp);
  }

  const nominateTypeChangeHandler = (event) => {
    setNominateMonth(null);
    setScheduleTime(null);
    setStartDate(null);
    setEndDate(null);
    getSelectedMonth([]);

    setSelectedDate({ value: 1, label: 1 })
    setMonthOptions([{ value: 1, label: 1 }]);
    setAssignObject(asgnObj);
    getAssignObject(asgnObj);
    let nominationDateTemp = nominationDate !== null ? nominationDate : 1;
    setNominationDate(nominationDateTemp);
    const value1 = event ? event.value : "";
    setNominateType(value1);
    updateParams(value1, nominationDate, nominateMonth, startDate, endDate, asgnObj);
  };

  const monthOnChange = (date) => {
    setNominateMonth(date);
    const days = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const options = [];
    for (let i = 1; i <= days; i++) {
      options.push({
        value: String(i),
        label: String(i)
      })
    }
    setMonthOptions(options);
    updateParams(nominateType, nominationDate, date, startDate, endDate);
  }

  const dateOnChange = (event) => {
    const value1 = event ? event.value : "";
    setSelectedDate(event);
    setNominationDate(value1);
    updateParams(nominateType, value1, nominateMonth, startDate, endDate);
  };

  const timeOnChange = (date) => {
    let assignObjectTemp = JSON.parse(JSON.stringify(assignObject));
    assignObjectTemp.scheduleTime = formatTime(date);
    setScheduleTime(date);
    setAssignObject(assignObjectTemp);
    getAssignObject(assignObjectTemp);
  }

  const startDateOnChange = (date) => {
    setStartDate(date);
    updateParams(nominateType, nominationDate, nominateMonth, date, endDate);
  }

  const endDateOnChange = (date) => {
    setEndDate(date);
    updateParams(nominateType, nominationDate, nominateMonth, startDate, date);
  }

  const CustomInputStartDate = React.forwardRef(({ value, onClick }, ref) => {
    return (
      <div className="input-group b-dbdbdb border_input">
        <button className="form-control bg-transparent border_none text-left" onClick={onClick} ref={ref}>{value ? value : "Select Start Date"}</button>
        <span className="input-group-addon" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.calendar_icon }}></span>
      </div>
    );
  });

  const CustomInputEndDate = React.forwardRef(({ value, onClick }, ref) => {
    return (
      <div className="input-group b-dbdbdb border_input">
        <button className="form-control bg-transparent border_none text-left" onClick={onClick} ref={ref}>{value ? value : "Select End Date"}</button>
        <span className="input-group-addon" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.calendar_icon }}></span>
      </div>
    );
  });

  const CustomInputMonth = React.forwardRef(({ value, onClick }, ref) => {
    return (
      <div className="input-group b-dbdbdb border_input">
        <button className="form-control bg-transparent border_none text-left" onClick={onClick} ref={ref}>{value ? value : "Select Month"}</button>
        <span className="input-group-addon" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.calendar_icon }}></span>
      </div>
    );
  });

  const CustomInputTime = React.forwardRef(({ value, onClick }, ref) => {
    return (
      <div className="input-group b-dbdbdb border_input">
        <button className="form-control bg-transparent border_none text-left" onClick={onClick} ref={ref}>{value ? value : "Select Time"}</button>
        <span className="input-group-addon" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.clock_icon }}></span>
      </div>
    );
  });

  return (
    <React.Fragment>
      <div className="col-md-8 col-lg-8 col-xs-12 col-sm-12">
        <div className="bg-f5f5f5 br-15 h-100">
          <div className="p-4">
            <div className="r_award_col_div">
              <div className="col-md-12 form-group px-0 eep-recognition-select2-dropdown_div">
                <div className="d-flex">
                  <label className="font-helvetica-m c-404040">Nomination Type</label>
                  {nominateTypeDatas['nominateSettings'] && nominateTypeDatas['nominateSettings'][nominateType].immediate && (
                    <div className="ml-auto nomiImmediatly_div">
                      <div className="form-group nomiImmediatly_inner eep_toggle_switch_sm">
                        <label className="nomiImmediatly_view mb-0 mr-2">
                          <span className="font-helvetica-m c-404040">Assign Immediately</span>
                          <ReactTooltip />
                          <Link
                            className="eep_help_section ml-1"
                            to="#"
                            dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.info_icon }}
                            data-tip={nominateTypeDatas['nominateSettings'] ? nominateTypeDatas['nominateSettings'][nominateType].immediateHelpText : ""}
                            data-html={true}
                            data-border={true}
                            data-effect="solid"
                            data-background-color="#ffffff"
                            data-text-color="#858796" data-border-color="#858796" data-arrow-color="#858796" data-place="top"
                          ></Link>
                        </label>
                        <label className="eep_toggle_switch switch">
                          <input type="checkbox" className="eep_toggle_input nomiImmediateToggle" checked={nominateImmediate} onChange={(e) => changeImmediateHandler(e)} />
                          <span className="eep_toggle_slider slider round"></span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                <Select
                  options={nominateTypeDatas.nominateLists}
                  placeholder="Select Nomination Type"
                  classNamePrefix="eep_select_common select"
                  className={`form-control a_designation basic-single p-0`}
                  // style=""
                  onChange={(event) => nominateTypeChangeHandler(event)}
                  maxMenuHeight={233}
                />
              </div>
              <div className="row n_award_inputs_row">
                <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12 form-group n_award_inputs_col1">
                  <div className="row no-gutters w-100">
                    <div className="col-md-12 form-group eep-recognition-select2-dropdown_div">
                      <label className="font-helvetica-m c-404040">Department</label>
                      <Select
                        placeholder="Select Department"
                        options={nomiDeptOptions}
                        value={nomiDapartment}
                        classNamePrefix="eep_select_common select"
                        className={`form-control a_designation basic-single p-0`}
                        onChange={(event) => changeDepartmentHandler(event)}
                        //defaultValue={nomiDeptOptions[0]}
                        maxMenuHeight={150}
                      />
                    </div>
                    <div className="col-md-12 form-group eep-recognition-select2-dropdown_div">
                      <label className="font-helvetica-m c-404040">Nominator</label>
                      <Select
                        placeholder="Select Nominator"
                        options={nominatorUsers}
                        value={nominatorValue}
                        classNamePrefix="eep_select_common select"
                        className={`form-control a_designation basic-single p-0`}
                        onChange={(event) => changeNominatorHandler(event)}
                        maxMenuHeight={150}
                      />
                    </div>
                    <div className="col-md-12 form-group eep-recognition-select2-dropdown_div">
                      <label className="font-helvetica-m c-404040">Judge</label>
                      <Select
                        options={judgeUsers}
                        value={judgeValue}
                        placeholder="Select Judge"
                        classNamePrefix="eep_select_common select"
                        className={`form-control a_designation basic-single p-0`}
                        menuPlacement="top"
                        onChange={(event) => changeJudgeHandler(event)}
                        maxMenuHeight={150}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-6 col-lg-6 col-sm-12 col-xs-12 form-group n_award_inputs_col2">
                  <div className="bg-white br-10 h-100">

                    <div className="p-3 h-100 n_award_inputs_col2_inner">

                      {nominateTypeDatas['nominateSettings'] && nominateTypeDatas['nominateSettings'][nominateType].BetweenData && (
                        <div className="row between_dt_div no-gutters">

                          <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">
                            <label className="font-helvetica-m c-404040">Start Date</label>
                            <ReactTooltip />
                            <Link
                              className="eep_help_section ml-1"
                              to="#"
                              dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.info_icon }}
                              data-tip={nominateTypeDatas['nominateSettings'] ? nominateTypeDatas['nominateSettings'][nominateType].helpText : ""}
                              data-html={true}
                              data-border={true}
                              data-effect="solid"
                              data-background-color="#ffffff"
                              data-text-color="#858796" data-border-color="#858796" data-arrow-color="#858796" data-place="top"
                            ></Link>
                            <div className="eepCustomDatepicker">
                              <DatePicker
                                selected={startDate}
                                className="date-picker"
                                calendarClassName="eep-date-picker"
                                onChange={(date) => startDateOnChange(date)}
                                dateFormat="d-MMM-yyyy"
                                customInput={<CustomInputStartDate />}
                                placeholderText="Select startdate"
                              />
                            </div>
                          </div>
                          <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group">
                            <label className="font-helvetica-m c-404040">End Date</label>
                            <div className="eepCustomDatepicker">
                              <DatePicker
                                selected={endDate}
                                className="date-picker"
                                calendarClassName="eep-date-picker"
                                onChange={(date) => endDateOnChange(date)}
                                dateFormat="d-MMM-yyyy"
                                customInput={<CustomInputEndDate />}
                                placeholderText="Select enddate"
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {nominateTypeDatas['nominateSettings'] && nominateTypeDatas['nominateSettings'][nominateType].month && (
                        <div className="row n_schedule_div w-100 no-gutters">
                          <div className="col-md-12 form-group">
                            <label>
                              <span className="font-helvetica-m c-404040">{nominateTypeDatas['nominateSettings'] && nominateTypeDatas['nominateSettings'][nominateType].label}</span>
                              <ReactTooltip />
                              <Link
                                className="eep_help_section ml-1"
                                to="#"
                                dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.info_icon }}
                                data-tip={nominateTypeDatas['nominateSettings'] ? nominateTypeDatas['nominateSettings'][nominateType].helpText : ""}
                                data-html={true}
                                data-border={true}
                                data-effect="solid"
                                data-background-color="#ffffff"
                                data-text-color="#858796" data-border-color="#858796" data-arrow-color="#858796" data-place="top"
                              ></Link>
                            </label>
                            <div className="eepCustomDatepicker">
                              <DatePicker
                                selected={nominateMonth}
                                className="month-picker"
                                calendarClassName="eep-month-picker"
                                onChange={(date) => monthOnChange(date)}
                                dateFormat="MMM"
                                customInput={<CustomInputMonth />}
                                placeholderText="Select a month"
                                showMonthYearPicker
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      {nominateTypeDatas['nominateSettings'] && nominateTypeDatas['nominateSettings'][nominateType].date && (
                        <div className="row n_schedule_div n_scheduleDay_div w-100 no-gutters">

                          <div className="col-md-12 form-group eep-recognition-select2-dropdown_div eep-recognition-select2_border">
                            <label className="font-helvetica-m c-404040">Date</label>
                            <Select
                              options={monthOptions}
                              classNamePrefix="eep_select_common select"
                              className={`form-control a_designation basic-single p-0 b-dbdbdb border_input`}
                              value={selectedDate}
                              onChange={(event) => dateOnChange(event)}
                              defaultValue={selectedDate}
                              maxMenuHeight={150}
                            />
                          </div>
                        </div>
                      )}

                      {nominateTypeDatas['nominateSettings'] && nominateTypeDatas['nominateSettings'][nominateType].scheduleTime && (
                        <div className="row a_schedule_div templates_time_div px-0 n_award_inputs_col3 w-100 no-gutters">

                          <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 form-group n_award_inputs_col3_inner eep-timer-parent">
                            <label className="font-helvetica-m c-404040">Schedule Time</label>
                            <div className="eepCustomDatepicker">
                              <DatePicker
                                selected={scheduleTime}
                                onChange={(date) => timeOnChange(date)}
                                showTimeSelect
                                showTimeSelectOnly
                                timeClassName={() => "time-individual"}
                                timeIntervals={15}
                                timeCaption="Time"
                                customInput={<CustomInputTime />}
                                dateFormat="hh:mm aa"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default NominateAwardModalInput;