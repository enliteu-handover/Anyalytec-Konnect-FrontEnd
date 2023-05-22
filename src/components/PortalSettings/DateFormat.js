import React, { useEffect, useState } from "react";

const DateFormat = () => {

  const [dateList, setDateList] = useState([]);
  const [timeList, setTimeList] = useState([]);

  const DateTimeHandler = (arg, argindx) => {
    let yearTempObj;
    if (arg.type === "date") {
      yearTempObj = dateList;
      yearTempObj.map((val, index) => {
        if (index === argindx) {
          val.isSelected = true;
        } else {
          val.isSelected = false;
        }
        return val;
      });
      setDateList([...yearTempObj]);
    } else if (arg.type === "time") {
      yearTempObj = timeList;
      yearTempObj.map((val, index) => {
        if (index === argindx) {
          val.isSelected = true;
        } else {
          val.isSelected = false;
        }
        return val;
      })
      setTimeList([...yearTempObj]);
    }
  }

  const fetchTimeData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/portalSettings.json`)
      .then((response) => response.json())
      .then((data) => {
        setTimeList(data.timeFormats);
      });
  };

  const fetchDateData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/portalSettings.json`)
      .then((response) => response.json())
      .then((data) => {
        setDateList(data.DateFormats);
      });
  };

  useEffect(() => {
    fetchDateData();
    fetchTimeData();
  }, []);

  return (
    <React.Fragment>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading"><span> Date Format </span></div>
      </div>

      <div className="eep_scroll_y mb-3" style={{ height: "40%" }}>

        <div className="row no-gutter">
          {dateList && dateList.map((item, index) => {
            return (
              <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6" key={"date_" + index}>
                <div id={"date_Id" + index} className={`theam_container bg-white d-flex justify-content-center align-items-center ${item.isSelected ? "active-setting" : " "}`} onClick={() => DateTimeHandler(item, index)}>
                  <p className="title m-2">{item.date}</p>
                </div>
              </div>
            )
          })}

        </div>

      </div>


      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading"><span> Time Format </span></div>
      </div>

      <div className="eep_scroll_y" style={{ height: "40%" }}>

        <div className="row no-gutter">
          {timeList && timeList.map((item, index) => {
            return (
              <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6" key={"time_" + index}>
                <div id={"time_Id" + index} className={`theam_container bg-white d-flex justify-content-center align-items-center ${item.isSelected ? "active-setting" : " "}`} onClick={() => DateTimeHandler(item, index)}>
                  <p className="title m-2">{item.time}</p>
                </div>
              </div>
            )
          })}
        </div>

      </div>

    </React.Fragment>
  );
};

export default DateFormat;
