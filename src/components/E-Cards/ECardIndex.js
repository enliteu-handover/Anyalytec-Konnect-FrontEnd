import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useHistory } from "react-router-dom";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { TabsActions } from "../../store/tabs-slice";
import ECards from "./ECards";
import Template from "./Template"
import Inbox from "./Inbox";

const ECardIndex = () => {

  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);
  const location = useLocation();
  const history = useHistory();
  // const routerData = location.state;
  const routerData = location.state || { activeTab: window.location.hash.substring(1)?.split('?')?.[0] };

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "RECOGNITION",
      link: "app/recognition",
    },
    {
      label: "E-CARDS",
      link: "app/ecardIndex",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "ECards",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const tabConfig = [
    {
      title: "Cards",
      id: "CardsTab",
    },
    {
      title: "Inbox",
      id: "InboxTab",
    }
  ];

  useEffect(() => {
    if (userRolePermission.ecardTemplates) {
      tabConfig.push({ title: "Templates", id: "TemplatesTab" })
    }
    if (routerData) {
      const activeTabId = routerData.activeTab;
      tabConfig.map((res) => {
        if (res.id === activeTabId) {
          res.active = true
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
  }, [userRolePermission]);

  return (
    <React.Fragment>
      <div className="row eep-content-section-data no-gutters">
        <div className="tab-content col-md-12 h-100">
          <div id="CardsTab" className="tab-pane active h-100">
            {activeTab && activeTab.id === `CardsTab` && <ECards />}
          </div>
          <div id="InboxTab" className="tab-pane h-100">
            {activeTab && activeTab.id === `InboxTab` && <Inbox />}
          </div>
          <div id="TemplatesTab" className="tab-pane h-100">
            {activeTab && activeTab.id === `TemplatesTab` && <Template />}
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default ECardIndex;
