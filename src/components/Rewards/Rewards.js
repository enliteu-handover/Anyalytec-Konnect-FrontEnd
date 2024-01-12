import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { TabsActions } from "../../store/tabs-slice";
import MyProfileCoupon from "../myRedeemption";
import Points from "./Points";
import Redeem from "./Redeem";

const Rewards = () => {

  const activeTab = useSelector((state) => state.tabs.activeTab);
  const location = useLocation();
  const history = useHistory();
  const dispatch = useDispatch();
  const routerData = location.state;

  const tabConfig = [
    {
      title: "Points",
      id: "points",
    },
    {
      title: "Catalog",
      id: "redeem",
    },
    {
      title: "Redemptions",
      id: "redemptions",
    }
  ];

  useEffect(() => {
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
      history.replace({ pathname: history.location.pathname, state: {} });
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
  }, []);

  return (
    <React.Fragment>
      <div className="row eep-content-section-data no-gutters">
        <div className="tab-content col-md-12 h-100 response-allign-middle">
          <div id="points" className="tab-pane active h-100">
            {activeTab && activeTab.id === 'points' &&
              <Points />
            }
          </div>
          <div id="redeem" className="tab-pane h-100">
            {activeTab && activeTab.id === 'redeem' &&
              <Redeem />
            }
          </div>
          <div id="redemptions" className="tab-pane h-100">
            {activeTab && activeTab.id === 'redemptions' &&
              // <Redemptions />
              <MyProfileCoupon />
            }
          </div>
        </div>
      </div>
    </React.Fragment>
  )
}
export default Rewards;