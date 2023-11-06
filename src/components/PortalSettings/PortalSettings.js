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
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import { storeStateActions } from "../../store/state";
// import { httpHandler } from "../../http/http-interceptor";
// import { URL_CONFIG } from "../../constants/rest-config";

const PortalSettings = () => {

  const dispatch = useDispatch();
  let portalObj = { isLogo: false, isColor: false, isDate: false, isYear: false, isLanguage: false };
  const [selectSetting, setSelectSetting] = useState(portalObj);
  const [isDone, seIsDone] = useState("");
  const [actionBtn, setActionBtn] = useState(false);
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);
  const [state, setState] = useState({
    "color": null,
    "financialYear": null,
    "dateFormat": null,
    "timeFormat": null,
    "language": null,
    "loginLogoByte": null,
    "headerLogoByte": null
  });

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

  const handleSubmitAdminPanel = () => {
    
    const payload = state;
    const obj = {
      url: URL_CONFIG.ADD_ADMIN_PANEL,
      method: state?.id ? "put" : "post",
      payload: payload
    };
    if (!payload.financialYear) {
      delete payload.financialYear
    }
    httpHandler(obj)
      .then((reponse) => {
        seIsDone(reponse?.data?.message ?? '')
        dispatch(storeStateActions.updateState(state ?? ''))
        var data = JSON.parse(sessionStorage.getItem('userData'));
        if (state?.color) {
          data['theme']['color'] = state.color
        }
        if (state?.headerLogoByte) {
          data['HeaderLogo'] = state.headerLogoByte
        }
        sessionStorage.setItem('userData', JSON.stringify(data))
      })
  };

  React.useEffect(() => {
    const obj = {
      url: URL_CONFIG.ADD_ADMIN_PANEL,
      method: "get"
    };

    httpHandler(obj)
      .then((reponse) => {
        setState({
          ...state,
          ...reponse?.data?.[0],
          "loginLogoByte": reponse?.data?.[0]?.loginLogoByte?.image,
          "headerLogoByte": reponse?.data?.[0]?.headerLogoByte?.image ?? ''
        })
      })
  }, [])

  return (
    <React.Fragment>
      {/* <div className={`pl-1 text-center ${"eep-text-light-grey"}`}>{"fileMessage"}</div> */}

      <PageHeader title="Portal Settings" sucuss={
        isDone && <div className={`pl-1 text-center ${"eep-text-light-grey"}`}>{isDone}</div>
      }></PageHeader>
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
                {selectSetting.isLogo && <LogoSettings state={state} setState={setState} />}
                {selectSetting.isColor && <ColorSettings state={state} setState={setState} />}
                {selectSetting.isDate && <DateFormat state={state} setState={setState} />}
                {selectSetting.isYear && <FinancialYearSettings state={state} setState={setState} />}
                {selectSetting.isLanguage && <Language state={state} setState={setState} />}
                {actionBtn &&
                  <div className="d-flex justify-content-center position-sticky py-2 bg-f5f5f5" onClick={() => handleSubmitAdminPanel()} style={{ bottom: "0px" }}><button className="eep-btn eep-btn-success">Done</button></div>
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