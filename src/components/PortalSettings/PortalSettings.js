import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ResponseInfo from "../../UI/ResponseInfo";
import PageHeader from "../../UI/PageHeader";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import LogoSettings from "./LogoSettings";
import ColorSettings from "./ColorSettings";
import FinancialYearSettings from "./FinancialYearSettings";
import DateFormat from "./DateFormat";
import Language from "./Language";
// import { httpHandler } from "../../http/http-interceptor";
// import { URL_CONFIG } from "../../constants/rest-config";

const PortalSettings = () => {

  const dispatch = useDispatch();
  let portalObj = { isLogo: false, isColor: false, isDate: false, isYear: false, isLanguage: false };
  const [selectSetting, setSelectSetting] = useState(portalObj);
  const [actionBtn, setActionBtn] = useState(false);
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Admin Panel",
      link: "app/adminpanel",
    },
    {
      label: "Portal Settings",
      link: "",
    },
  ];
  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Portal Settings"
      })
    );
  }, [breadcrumbArr, dispatch]);

  const clickHandler = (arg) => {
    let tempPortalObj = portalObj;
    Object.keys(tempPortalObj).map((val) => {
      if (val === arg.type) {
        tempPortalObj[val] = true;
        tempPortalObj = { ...tempPortalObj, tempPortalObj }
        setSelectSetting(tempPortalObj);
      }
    });
    if (!actionBtn) {
      setActionBtn(true);
    }
  }

  return (
    <React.Fragment>
      <PageHeader title="Portal Settings"></PageHeader>
      <div className="row eep-content-section-data">
        {userRolePermission.adminPanel &&
          <React.Fragment>
            <div className="col-md-6">
              <div className="controal_panel_container eep-content-section-data eep_scroll_y bg-f5f5f5 br-10 p-3">
                <div id="logo" className={`controal_panel_control bg-white br-5 p-2 mb-3 c1 ${selectSetting.isLogo ? "active-setting" : " "}`} onClick={() => clickHandler({ type: "isLogo" })}>
                  <div className="controal_panel_label">
                    <span className="pl-2">Logo</span>
                  </div>
                </div>
                <div id="color" className={`controal_panel_control bg-white br-5 p-2 mb-3 c1 ${selectSetting.isColor ? "active-setting" : " "}`} onClick={() => clickHandler({ type: "isColor" })}>
                  <div className="controal_panel_label">
                    <span className="pl-2">Colour Settings</span>
                  </div>
                </div>
                <div id="date" className={`controal_panel_control bg-white br-5 p-2 mb-3 c1 ${selectSetting.isDate ? "active-setting" : " "}`} onClick={() => clickHandler({ type: "isDate" })}>
                  <div className="controal_panel_label">
                    <span className="pl-2">Date Format</span>
                  </div>
                </div>
                <div id="year" className={`controal_panel_control bg-white br-5 p-2 mb-3 c1 ${selectSetting.isYear ? "active-setting" : " "}`} onClick={() => clickHandler({ type: "isYear" })}>
                  <div className="controal_panel_label">
                    <span className="pl-2">Financial Year</span>
                  </div>
                </div>
                <div id="language" className={`controal_panel_control bg-white br-5 p-2 c1 ${selectSetting.isLanguage ? "active-setting" : " "}`} onClick={() => clickHandler({ type: "isLanguage" })}>
                  <div className="controal_panel_label">
                    <span className="pl-2">Language</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="controal_panel_container eep-content-section-data eep_scroll_y bg-f5f5f5 br-10 px-3 pt-3">
                {selectSetting.isLogo && <LogoSettings />}
                {selectSetting.isColor && <ColorSettings />}
                {selectSetting.isDate && <DateFormat />}
                {selectSetting.isYear && <FinancialYearSettings />}
                {selectSetting.isLanguage && <Language />}
                {actionBtn &&
                  <div className="d-flex justify-content-center position-sticky py-2 bg-f5f5f5" style={{ bottom: "0px" }}><button className="eep-btn eep-btn-success">Done</button></div>
                }
                {!actionBtn &&
                  <ResponseInfo title="Click settings from left side." responseImg="noRecord" responseClass="response-info" />
                }
              </div>
            </div>
          </React.Fragment>
        }
        {!userRolePermission.adminPanel &&
          <ResponseInfo
            title="Oops! Looks illigal way."
            responseImg="accessDenied"
            responseClass="response-info"
            messageInfo="Contact Administrator."
          />
        }
      </div>
    </React.Fragment>
  );
};
export default PortalSettings;