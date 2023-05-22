import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DatePicker from "react-datepicker";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import { formatTime, AmPmToISO } from "../../shared/SharedService";

const ScheduleTime = (props) => {

  const {templateType, getScheduleTime} = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [scheduleTime, setScheduleTime] = useState();

  useEffect(() => {
    setScheduleTime(null);
  },[]);

  const CustomInputTime = React.forwardRef(({value, onClick}, ref) => { 
    return (
      <div className="input-group b-dbdbdb border_input">
        <button className="form-control bg-transparent border_none text-left" style={{width:"150px"}} onClick={onClick} ref={ref}>{value ? value : "Select Time"}</button>
        <span className="input-group-addon" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.clock_icon }}></span>
      </div>
    );
  });

  const timeOnChange = (date) => {
    setScheduleTime(date);
    getScheduleTime(formatTime(date));
  }

  const fetchScheduleTime = () => {
    const obj = {
      url: URL_CONFIG.GET_SCHEDULETIME,
      method: "get"
    };
    httpHandler(obj)
    .then((response) => {
      if(response.data.birthday) {
        const dt = AmPmToISO(response.data.birthday);
        setScheduleTime(new Date(dt));
      } else {
        setScheduleTime(null);
      }
    })
    .catch((error) => {
      console.log("fetchScheduleTime errorrrr", error);
    });
  }

  useEffect(() => {
    fetchScheduleTime();
  },[])

    return (
      <div className="row eep-templates-setting-time p-0 m-0">
        <div className="px-0 mx-0 py-2 my-2 w-100">
          <h4 className="c-2c2c2c mb-0">Schedule Time</h4>
        </div>
        <div className="col-md-12 templates_time_div templates_card_whole_div px-0">
          <div className="row container p-0 m-0">
            <div className="component-box">
              <div className="pmd-card pmd-z-depth pmd-card-custom-view">
                <div className="pmd-card-body">
                  <div className="form-group pmd-textfield pmd-textfield-floating-label">
                    <div role="wrapper" className="position-relative">
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
              </div>
            </div>
          </div>
        </div>
      </div>
    );
};
export default ScheduleTime;