import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import "./App.scss";
import IdleTimerContainer from "./IdleTimer/IdleTimerContainer";
import RolePermissions from "./components/RolePermissions/RolePermissions";
import TourState from "./components/Tour/TourState";
import Login from "./layout/Login/Login";
import MainContainer from "./layout/MainContainer/MainContainer";
import { firebaseInitialization } from "./notification";
import { sharedDataActions } from "./store/shared-data-slice";
// import FirebaseToken from "./components/Firebase/FirebaseToken";
import { getRoles } from '@crayond_dev/idm-client';
import { URL_CONFIG } from "./constants/rest-config";
import { httpHandler } from "./http/http-interceptor";
import "./styles/root/root.scss";

function App() {
  const dispatch = useDispatch();
  const history = useHistory();
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
      });
  };

  useEffect(() => {
    fetchSvgIcons();
    firebaseInitialization()
    if (!sessionStorage?.userData) {
      history.push("/login/signin");
    }
    addRole();
  }, []);

  const addRole = async () => {
    const roles = await getRoles({});
    let payOptionsRole = {
      data: roles
    };

    const objRole = {
      url: URL_CONFIG.ADDROLE,
      method: "post",
      payload: payOptionsRole,
    };
    if (roles?.length > 0) {
      await httpHandler(objRole)
    }
  }

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
      })
  }

  return (
    <div class="user-element" data-user={theme?.color ?? "color_one"}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div id="loader-container" className="d-none" style={{ zIndex: "1051" }}>
          <div id="loader">
            <img src={process.env.PUBLIC_URL + "/images/loader.gif"} alt="Loader" />
          </div>
        </div>
        <Switch>
          <Route path="/" exact>
            <Redirect to="/login" />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/app">
            <IdleTimerContainer />
            <MainContainer />
            <RolePermissions />
            <TourState />
            {/* <FirebaseToken /> */}
          </Route>
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
