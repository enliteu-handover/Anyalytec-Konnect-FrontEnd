import React from "react";

const ColorSettings = () => {

  const theamSelectHandler = (arg) => {
    let removeClassName = document.querySelectorAll(".theam_container");
    for (var i = 0; i < removeClassName.length; i++) {
      removeClassName[i].classList.remove('active-setting');
    }
    let addClassName = document.getElementById(arg);
    addClassName.classList.add("active-setting");
  }

  return (
    <React.Fragment>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading"><span> Select Theam Color </span></div>
      </div>

      <div className="eep_scroll_y" style={{ height: "85%" }}>

        <div className="row no-gutter">

          <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6 eep_scroll_y">
            <div id="color_one" className="theam_container active-setting" onClick={() => theamSelectHandler("color_one")}>
              <p className="title">Default</p>
              <div className="color_spectrum d-flex">
                <div className="color_1" style={{ backgroundColor: "#F7B5B5" }}></div>
                <div className="color_2" style={{ backgroundColor: "#FFB8B8" }}></div>
                <div className="color_3" style={{ backgroundColor: "#FAA4A4" }}></div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div id="color_two" className="theam_container" onClick={() => theamSelectHandler("color_two")}>
              <p className="title">Light</p>
              <div className="color_spectrum d-flex">
                <div className="color_1" style={{ backgroundColor: "#efefef" }}></div>
                <div className="color_2" style={{ backgroundColor: "#002d40" }}></div>
                <div className="color_3" style={{ backgroundColor: "#f5f5f5" }}></div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div id="color_three" className="theam_container" onClick={() => theamSelectHandler("color_three")}>
              <p className="title">Dark</p>
              <div className="color_spectrum d-flex">
                <div className="color_1" style={{ backgroundColor: "#84D3F5" }}></div>
                <div className="color_2" style={{ backgroundColor: "#71CFF7" }}></div>
                <div className="color_3" style={{ backgroundColor: "#56CAFC" }}></div>
              </div>
            </div>
          </div>

          <div className="col-sm-12 col-md-12 col-lg-6 col-xl-6">
            <div id="color_four" className="theam_container" onClick={() => theamSelectHandler("color_four")}>
              <p className="title">Ocean</p>
              <div className="color_spectrum d-flex">
                <div className="color_1" style={{ backgroundColor: "#99FFEE" }}></div>
                <div className="color_2" style={{ backgroundColor: "#A2EDF6" }}></div>
                <div className="color_3" style={{ backgroundColor: "#98DDFA" }}></div>
              </div>
            </div>
          </div>

        </div>
      </div>

    </React.Fragment>
  );
};

export default ColorSettings;
