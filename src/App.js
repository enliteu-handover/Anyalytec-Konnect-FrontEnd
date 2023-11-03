import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import { URL_CONFIG } from "./constants/rest-config";
import { httpHandler } from "./http/http-interceptor";
import { idmRoleMapping } from "./idm";
import Login from "./layout/Login/Login";
import MainContainer from "./layout/MainContainer/MainContainer";
import { firebaseInitialization } from "./notification";
import PrivateRoute from "./privateRouter";
import { sharedDataActions } from "./store/shared-data-slice";
import "./styles/root/root.scss";

function App() {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState({})
  const headerLogo = useSelector((state) => state.storeState);
  const fetchSvgIcons = () => {
    fetch(`${process.env.PUBLIC_URL}/data/svgIcons.json`)
      .then((response) => response.json())
      .then((data) => {
        dispatch(
          sharedDataActions.getSvgIcons({
            svgIcons: data,
          })
        );
      }).catch((error) => console.log(error));
  };

  useEffect(() => {
    fetchPermission();
    fetchSvgIcons();
    firebaseInitialization();
  }, []);

  const fetchPermission = async () => {
    if (!sessionStorage.getItem('userData')) { return }
    const obj = {
      url: URL_CONFIG.USER_PERMISSION,
      method: "get",
    };
    await httpHandler(obj).then(async (response) => {
      const roleData = await idmRoleMapping(response?.data?.roleId?.idmID);
      dispatch(
        sharedDataActions.getUserRolePermission({
          // userRolePermission: {
          //   "badgeSend": true,
          //   "certificateSend": true,
          //   "awardNominatorAssignee": true,
          //   "awardCategorisation": true,
          //   "awardNominatorAssignee": true,
          //   "awardModify": true,
          //   "pollCreate": true,
          //   "adminPanel": true,
          //   "surveyCreate": true,
          //   "myDashboard": true,
          //   "awardCreate": true,
          //   "badgeCreate": true,
          //   "certificateCreate": true,
          //   "surveyCreate": true,
          //   "employeeEngagementDashboard": true,
          //   "ecardTemplates": true,
          //   "rewardsAndRecognition": true,
          //   "hallOfFame": true,
          //   "ecards": true,
          //   "ecardInbox": true,
          //   "ecardTemplate": true,
          //   "badges": true,
          //   "createBadge": true,
          //   "myBadges": true,
          //   "awards": true,
          //   "createAward": true,
          //   "myAwards": true,
          //   "awardNominatorView": true,
          //   "awardNomination": true,
          //   "awardMyNominations": true,
          //   "awardApproval": true,
          //   "awardManage": true,
          //   "certificate": true,
          //   "myCertificate": true,
          //   "libraryBadges": true,
          //   "libraryAwards": true,
          //   "libraryCertificates": true,
          //   "socialWall": true,
          //   "ideaBox": true,
          //   "createIdeaBox": true,
          //   "myIdeas": true,
          //   "forum": true,
          //   "createforum": true,
          //   "myForums": true,
          //   "createPoll": true,
          //   "activePolls": true,
          //   "pollResults": true,
          //   "closedPolls": true,
          //   "createSurvey": true,
          //   "mySurveys": true,
          //   "surveyResults": true,
          //   "surveyQuestionBank": true,
          //   "rewardPoints": true,
          //   "portalSettings": true,
          //   "departmentMasters": true,
          //   "userManagement": true,
          //   "roleManagement": true,
          //   "hashTag": true
          // }
          userRolePermission: roleData?.data
        }));
    }).catch((error) => {
      console.log("fetchPermission error", error);
    });
  }

  React.useEffect(() => {
    setTheme({
      color: headerLogo?.color ?? JSON.parse(sessionStorage.getItem('userData'))?.theme?.color,
    })
  }, [headerLogo])

  return (
    <div class="user-element" data-user={theme?.color ?? "color_one"}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div id="loader-container" className="d-none" style={{ zIndex: "1051" }}>
          <div id="loader">
            <img src={process.env.PUBLIC_URL + "/images/loader.gif"} alt="Loader" />
          </div>
        </div>
        <Switch>
          <Route path="/login"><Login /></Route>
          <Route path="/" exact>
            <Redirect to="/login" />
          </Route>

          <PrivateRoute
            path="/app"
            theme={theme?.color ?? 'color_one'}
            component={MainContainer}
          />
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
