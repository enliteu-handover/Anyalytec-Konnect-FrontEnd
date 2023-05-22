import React, { useState } from "react";
import AddLogo from "./AddLogo";

const LogoSettings = () => {

  const [clearImage, setClearImage] = useState({ clear: false, clearImgId: "" });
  const [uploadImgArry, setUploadImgArry] = useState([]);

  const clearImageHandler = (arg) => {
    setClearImage(arg);
  }

  const checkKey = (obj, data) => {
    let keyExist = Object.values(obj).some(value => value === data.id);
    let arry = uploadImgArry;
    if (!keyExist) {
      arry.push(data);
      setUploadImgArry(arry);
    }
  };

  console.log("uploadImgArry  outside :", uploadImgArry);

  return (
    <React.Fragment>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading"><span>Login Page Logo </span></div>
        <div className="setting_icon c1">
          <img src={`${process.env.PUBLIC_URL}/images/icons/static/kebab.svg`} width="20px" height="20px" alt="Settings" data-toggle="dropdown" data-trigger="focus" aria-expanded="false" style={{ transform: "rotate(270deg)" }} />
          <div className="dropdown-menu eep-dropdown-menu eep_custom_dropdown_bg" x-placement="bottom-start">
            <label className="eep-options-item dropdown-item mb-0 c1">Add / Replace</label>
            <label className="eep-options-item dropdown-item mb-0 c1">View</label>
            <label className="eep-options-item dropdown-item mb-0 c1" onClick={() => clearImageHandler({ clear: true, clearImgId: "page-logo" })} >Delete</label>
          </div>
        </div>
      </div>

      <div className="row no-gutters mb-3">
        <div className="col-md-12 Logo">
          <AddLogo clickId={"pageLogo"} settings={{ isClear: clearImage, imgHeight: "200px", imgWidth: "200px", imgId: "page-logo", checkKey: checkKey, uploadImgArry: uploadImgArry, clearImageHandler: clearImageHandler }} />
        </div>
      </div>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="heading"><span>Product Header Logo </span></div>
        <div className="setting_icon c1">
          <img src={`${process.env.PUBLIC_URL}/images/icons/static/kebab.svg`} width="20px" height="20px" alt="Settings" data-toggle="dropdown" aria-expanded="false" style={{ transform: "rotate(270deg)" }} />
          <div className="dropdown-menu eep-dropdown-menu eep_custom_dropdown_bg" x-placement="bottom-start">
            <label className="eep-options-item dropdown-item mb-0 c1">Add / Replace</label>
            <label className="eep-options-item dropdown-item mb-0 c1">View</label>
            <label className="eep-options-item dropdown-item mb-0 c1" onClick={() => clearImageHandler({ clear: true, clearImgId: "header-logo" })}>Delete</label>
          </div>
        </div>
      </div>

      <div className="row no-gutters">
        <div className="col-md-12 Logo">
          <AddLogo clickId={"headerLogo"} settings={{ isClear: clearImage, imgHeight: "200px", imgWidth: "200px", imgId: "header-logo", checkKey: checkKey, uploadImgArry: uploadImgArry, clearImageHandler: clearImageHandler }} />
        </div>
      </div>

    </React.Fragment>
  );
};
export default LogoSettings;