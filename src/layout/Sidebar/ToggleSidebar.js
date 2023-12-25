import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PendingData from "../../components/Survey/PendingData";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import { toggleSidebarActions } from "../../store/toggle-sidebar-state";

const ToggleSidebar = (props) => {

  const { toggleSidebarType, sideBarClass } = props;
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

  const [toggleState, setToggleState] = useState(true);
  const [showPendingData, setShowPendingData] = useState(false);
  const [pendingDatas, setPendingDatas] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      toggleSidebarActions.updateToggleSidebarState({
        isToggle: true,
      })
    );
    return () => {
      dispatch(
        toggleSidebarActions.updateToggleSidebarState({
          isToggle: false,
        })
      );
    };
  }, [dispatch]);

  const sideBarToggleHandler = () => {
    setToggleState(!toggleState);
    sideBarClass(!toggleState);
    setShowPendingData(false);
  }

  const [innerSidebarData, setInnerSidebarData] = useState([]);

  const fetchInnerSidebarData = (tType) => {
    
    fetch(`${process.env.PUBLIC_URL}/data/toggleSidebar.json`)
      .then((response) => response.json())
      .then((data) => {
        //setInnerSidebarData(data[tType]);
        let dataTemp = data;
        if (!userRolePermission?.pollCreate) {
          dataTemp["polls"]["fields"].splice(1, 1);
        }

        if (!userRolePermission?.adminPanel) {
          dataTemp["survey"]["fields"].splice(2, 2);
        }

        if (!userRolePermission?.surveyCreate) {
          dataTemp["survey"]["fields"].splice(1, 1);
        }
        setInnerSidebarData(data[tType]);
      });
  }

  const fetchPendingData = (pendingType) => {
    let obj = {};
    if (pendingType === "survey") {
      obj = {
        url: URL_CONFIG.PENDING_SURVEY,
        method: "get",
      };
    }
    if (pendingType === "polls") {
      obj = {
        url: URL_CONFIG.POLL_RESPONSE,
        method: "get",
      };
    }
    httpHandler(obj).then((res) => {
      setPendingDatas([...res.data]);
    }).catch((error) => {
      console.log("fetchPendingData error", error);
      //const errMsg = error.response?.data?.message;
    });
  }

  useEffect(() => {
    if (toggleSidebarType !== "") {
      fetchInnerSidebarData(toggleSidebarType);
      fetchPendingData(toggleSidebarType);
    }
  }, [toggleSidebarType]);

  const togglePendingComponent = () => {
    setShowPendingData(prev => !prev)
  }

  return (
    <div className="text-center navigation mw-10 eep_sidebar survey_sidebar" id="sidebar" style={{ right: toggleState ? "0" : "-137px" }}>
      <div className={`eep-sidebar eep_scroll_y ${toggleSidebarType === "survey" ? "survey-sidebar" : (toggleSidebarType === "polls" ? "poll-sidebar" : "")}`}>
        <div className="survey_sidebar_inner">
          <div className="stacking-slide">
            <span id="eep-sidebar-handle" onClick={sideBarToggleHandler}></span>
            {innerSidebarData.fields && innerSidebarData.fields.length > 0 && innerSidebarData.fields.map((item, index) => {
              return (
                <div className="sidebar-item pb-4" key={"sidebarItem_" + index} onClick={(item.isCustomComponent) ? togglePendingComponent : undefined}>
                  <div className="pending-survey pending-eep">
                    <Link to={item.link && !item.isCustomComponent ? item.link : "#"}>
                      <div className={`${item.bgClassName} sidebar-box`}>
                        {item.isCustomComponent &&
                          <div className="round-wave">
                            <div className="circle-ripple">
                              <h5>{pendingDatas.length}</h5>
                            </div>
                          </div>
                        }
                        {!item.isCustomComponent &&
                          <div className="round">
                            <img src={process.env.PUBLIC_URL + "/images/icons/toggleMenu/" + item.imgSrc} alt="" className="icon-24" />
                          </div>
                        }
                      </div>
                      <div className="sidebar-box-title">{item.label}</div>
                    </Link>
                  </div>
                </div>
              )
            })}
            {showPendingData && <PendingData
              pendingDatas={pendingDatas}
              togglePendingComponent={togglePendingComponent} pendingType={toggleSidebarType} />}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ToggleSidebar;