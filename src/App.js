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
import { fetchUserPermissions } from "./helpers";

function App() {
  const dispatch = useDispatch();
  const [theme, setTheme] = useState({});
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
      })
      .catch((error) => console.log(error));
  };

  const fetchIsNotification = () => {
    const obj = {
      url: URL_CONFIG.NOTIFICATIONS_BY_ID,
      method: "get",
      isLoader: true,
    };
    httpHandler(obj)
      .then((response) => {
        dispatch(
          sharedDataActions.getIsNotification({
            isNotification: response?.data,
          })
        );
      })
      .catch((error) => {
        console.log("fetchNotifications API error", error);
      });
  };

  useEffect(() => {
    fetchPermission();
    fetchSvgIcons();
    firebaseInitialization();
    if (sessionStorage.getItem("userData")) {
      fetchIsNotification();
    }
  }, []);

  const fetchPermission = async () => {
    if (!sessionStorage.getItem("userData")) {
      return;
    }
    await fetchUserPermissions(dispatch);
  };

  React.useEffect(() => {
    setTheme({
      color:
        headerLogo?.color ??
        JSON.parse(sessionStorage.getItem("userData"))?.theme?.color,
    });
  }, [headerLogo]);

  return (
    <div class="user-element" data-user={theme?.color || "color_one"}>
      <div id="loader-container" className="d-none" style={{ zIndex: "1051" }}>
        <div id="loader">
          <img
            src={process.env.PUBLIC_URL + "/images/loader.gif"}
            alt="Loader"
          />
        </div>
      </div>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        {/* <div id="page-loader-container" className="d-none" style={{ zIndex: "1051" }}>
          <div id="loader">
            <img src={process.env.PUBLIC_URL + "/images/loader.gif"} alt="Loader" />
          </div>
        </div> */}
        <Switch>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/" exact>
            <Redirect to="/login" />
          </Route>

          <PrivateRoute
            path="/app"
            theme={theme?.color || "color_one"}
            component={MainContainer}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
