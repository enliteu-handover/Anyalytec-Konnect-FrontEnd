import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { TabsActions } from "../../store/tabs-slice";
import Dashboard from "./Dashboard";
import RewardsRecognition from "./RewardsRecognition";
import HallOfFame from "./HallOfFame";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import { sharedDataActions } from "../../store/shared-data-slice";

const Home = () => {
  const [usersPic, setUsersPic] = useState([]);
  const [dashboardDetails, setDashboardDetails] = useState({});
  const [hallOfFameDetails, setHallOfFameDetails] = useState({});
  const [allUserDatas, setAllUserDatas] = useState([]);
  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const location = useLocation();
  const history = useHistory();
  const routerData = location.state;
  const [filterParams, setFilterParams] = useState({});

  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);
  //console.log("userRolePermission", userRolePermission);
  // const tourState = useSelector((state) => state.sharedData.tourState);
  //console.log("tourState", tourState);

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Dashboard",
      id: "My_Dashboard",
      link: "#",
    },
  ];

  /*
  const tabConfig = [
    {
      title: "My Dashboard",
      id: "My_Dashboard",
    },
    {
      title: "Rewards & Recognition ",
      id: "Rewards_Recognition",
    },
    {
      title: "Hall of Fame",
      id: "Hall_of_Fame",
    },
  ];
  */

  const tabConfig = [
    {
      title: "My Dashboard",
      id: "My_Dashboard",
    }
  ];

  useEffect(() => {
    debugger
    if (userRolePermission.employeeEngagementDashboard) {
      tabConfig.push({
        title: "Rewards & Recognition",
        id: "Rewards_Recognition",
      });
    }
    if (userRolePermission.hallOfFame) {
      tabConfig.push({
        title: "Hall of Fame",
        id: "Hall_of_Fame",
      });
    }

    if (userRolePermission.employeeEngagementDashboard || userRolePermission.hallOfFame) {
      if (routerData?.activeTab) {
        const activeTabId = routerData.activeTab;
        tabConfig.map((res) => {
          if (res.id === activeTabId) {
            res['active'] = true
          }
        });
        dispatch(
          TabsActions.updateTabsconfig({
            config: tabConfig,
          })
        );
        // history.replace({ pathname: history.location.pathname, state: {} });
      } else {
        dispatch(
          TabsActions.updateTabsconfig({
            config: tabConfig,
          })
        );
      }

      return () => {
        dispatch(
          TabsActions.updateTabsconfig({
            config: [],
          })
        );
      };
    }

  }, [userRolePermission]);
  

  useEffect(() => {
    // dispatch(TabsActions.tabOnChange({tabInfo:tabConfig?.[0]}))
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Dashboard",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const getDashboardDetails = () => {
    const obj = {
      url: URL_CONFIG.DASHBOARD_INDEX,
      method: "get",
      isLoader: false
    }
    httpHandler(obj).then((response) => {

      setDashboardDetails(response?.data);
    }).catch((error) => {
      console.log("getDashboardDetails error", error);
    });
  }

  const fetchAllUsers = () => {
    const obj = {
      url: URL_CONFIG.ALLUSERS,
      method: "get",
      isLoader: false
    };
    httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response.data.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push(
              {
                "id": item.id,
                "pic": item?.imageByte?.image
              }
            )
          }
        });
        setUsersPic(userPicTempArry);
        setAllUserDatas(response.data);
      })
      .catch((error) => {
        console.log("ALLUSERS API error => ", error);
      });
  };

  const fetchHallOfFame = (paramsInfo = {}) => {
    const obj = {
      url: URL_CONFIG.HALL_OF_FAME,
      method: "get",
      isLoader: false
    };
    if (Object.getOwnPropertyNames(paramsInfo)) {
      obj["params"] = paramsInfo;
    }
    httpHandler(obj)
      .then((response) => {
        setHallOfFameDetails(response.data)
      })
      .catch((error) => {
        console.log("HALLOFFAME API error => ", error);
      });
  };

  const getHallOfFameFilterParams = (paramsData) => {
    fetchHallOfFame(paramsData);
  }

  const fetchIsNotification = () => {
    const obj = {
      url: URL_CONFIG.NOTIFICATIONS_BY_ID,
      method: "get",
      isLoader: true
    };
    httpHandler(obj)
      .then((response) => {
        dispatch(sharedDataActions.getIsNotification({
          isNotification: response?.data
        }))
      })
      .catch((error) => {
        console.log("fetchNotifications API error", error);
      });
  }

  useEffect(() => {
    getDashboardDetails();
    fetchAllUsers();
    fetchHallOfFame(filterParams);
    fetchIsNotification();
  }, []);

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPic.findIndex((x) => x.id === uID);
    return userPicIndex !== -1
      ? usersPic[userPicIndex].pic
      : process.env.PUBLIC_URL + "/images/user_profile.png";
  };
  return (
    <div className="row eep-content-section-data no-gutters">
      <div className="tab-content col-md-12 h-100">
        {Object.keys(dashboardDetails)?.length > 0 &&
          <div id="My_Dashboard" className="tab-pane active h-100">
            <Dashboard dashboardDetails={dashboardDetails} getUserPicture={getUserPicture} />
          </div>
        }
        <div id="Rewards_Recognition" className="tab-pane h-100">
          {activeTab && activeTab.id === 'Rewards_Recognition' && <RewardsRecognition allUserDatas={allUserDatas} />}
        </div>
        {Object.keys(hallOfFameDetails).length > 0 &&
          <div id="Hall_of_Fame" className="tab-pane h-100">
            {activeTab && activeTab.id === 'Hall_of_Fame' && <HallOfFame hallOfFameDetails={hallOfFameDetails} getHallOfFameFilterParams={getHallOfFameFilterParams} getUserPicture={getUserPicture} />}
          </div>
        }
      </div>
    </div>
  );
};
export default Home;