import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import "./App.scss";
import IdleTimerContainer from "./IdleTimer/IdleTimerContainer";
import RolePermissions from "./components/RolePermissions/RolePermissions";
import TourState from "./components/Tour/TourState";
import Login from "./layout/Login/Login";
import MainContainer from "./layout/MainContainer/MainContainer";
import { firebaseInitialization } from "./notification";
import { sharedDataActions } from "./store/shared-data-slice";
import { URL_CONFIG } from "./constants/rest-config";
import { httpHandler } from "./http/http-interceptor";
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
    fetchSvgIcons();
    firebaseInitialization()
  }, []);

  React.useEffect(() => {
    getThemePanel(headerLogo?.color)
  }, [headerLogo])

  const getThemePanel = (color) => {
    const obj = {
      url: URL_CONFIG.ADD_ADMIN_PANEL,
      method: "get"
    };

    httpHandler(obj)
      .then((reponse) => {
        setTheme({
          color: color ?? reponse?.data?.[0]?.color,
        })
      }).catch((error) => console.log(error));
  }

  const PrivateRoute = ({ children }) => {
    if (!sessionStorage?.userData) {
      sessionStorage.setItem('redirect', window.location.href)
    }
    return sessionStorage?.userData ? children : <Redirect to="/login/signin" />;
  };

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
          <Route path="/app">
            <PrivateRoute>
              <IdleTimerContainer />
            </PrivateRoute>

            <PrivateRoute>
              <MainContainer />
            </PrivateRoute>

            <PrivateRoute>
              <RolePermissions />
            </PrivateRoute>

            <PrivateRoute>
              <TourState />
            </PrivateRoute>
            {/* <FirebaseToken /> */}
          </Route>
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
