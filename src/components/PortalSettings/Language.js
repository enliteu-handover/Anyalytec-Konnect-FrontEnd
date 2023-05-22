import React, { useEffect, useState } from "react";

const Language = () => {

  const [languageList, setLanguageList] = useState([]);

  const langSelectHandler = (argindex) => {
    let languageTempObj = languageList;
    languageTempObj.map((val, index) => {
      if (index === argindex) {
        val.isSelected = true;
      } else {
        val.isSelected = false;
      }
      setLanguageList([...languageTempObj]);
    });
  }

  const fetchLanguageData = () => {
    fetch(`${process.env.PUBLIC_URL}/data/portalSettings.json`)
      .then((response) => response.json())
      .then((data) => {
        setLanguageList(data.language);
      });
  };

  useEffect(() => {
    fetchLanguageData();
  }, []);

  return (
    <React.Fragment>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading"><span> Select Language </span></div>
      </div>

      <div className="eep_scroll_y mb-3" style={{ height: "90%" }}>

        <div className="row no-gutter">
          {languageList && languageList.map((item, index) => {
            return (
              <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6" key={"lang_" + index}>
                <div id={"lang_Id" + index} className={`theam_container bg-white d-flex justify-content-center align-items-center ${item.isSelected ? "active-setting" : " "}`} onClick={() => langSelectHandler(index)}>
                  <p className="title m-2">{item.language}</p>
                </div>
              </div>
            )
          })}

        </div>

      </div>

    </React.Fragment>
  );
};

export default Language;