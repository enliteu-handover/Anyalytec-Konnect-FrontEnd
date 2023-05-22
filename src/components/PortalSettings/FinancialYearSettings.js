import React, { useEffect, useState } from "react";

const FinancialYearSettings = () => {

  const [monthList, setMonthList] = useState([]);

  const yearSelectHandler = (argindex) => {
    let yearTempObj = monthList;
    yearTempObj.map((val, index) => {
      if (index === argindex) {
        val.isSelected = true;
      } else {
        val.isSelected = false;
      }
      setMonthList([...yearTempObj]);
    });
  }

  const fetchMonthData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/portalSettings.json`)
      .then((response) => response.json())
      .then((data) => {
        setMonthList(data.months);
      });
  };

  useEffect(() => {
    fetchMonthData();
  }, []);

  return (
    <React.Fragment>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading"><span> Financial Year Start With </span></div>
      </div>

      <div className="eep_scroll_y" style={{ height: "85%" }}>

        <div className="row no-gutter">
          {monthList && monthList.map((item, index) => {
            return (
              <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6" key={"month_" + index}>
                <div id={"month_Id" + index} className={`theam_container bg-white d-flex justify-content-center align-items-center ${item.isSelected ? "active-setting" : " "}`} onClick={() => yearSelectHandler(index)}>
                  <p className="title m-2">{item.month}</p>
                </div>
              </div>
            )
          })}

        </div>
      </div>

    </React.Fragment>
  );
};

export default FinancialYearSettings;
