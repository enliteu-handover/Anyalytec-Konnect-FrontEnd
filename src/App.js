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
      dispatch(sharedDataActions.getUserRolePermission({
        userRolePermission: roleData?.data
      }));

      // let payOptionsRole = {
      //   data: roleData?.rolesData,
      //   role_id: roleData?.roleId,
      //   screen: JSON.stringify(roleData?.data)
      // };

      // const objRole = {
      //   url: URL_CONFIG.ADDROLE,
      //   method: "post",
      //   payload: payOptionsRole,
      // };

      // await httpHandler(objRole)
    }).catch((error) => {
      console.log("fetchPermission error", error);
    });
  }

  React.useEffect(() => {
    // getThemePanel(headerLogo?.color)
    setTheme({
      color: headerLogo?.color ?? JSON.parse(sessionStorage.getItem('userData'))?.theme?.color,
    })
  }, [headerLogo])

  // const getThemePanel = (color) => {
  //   const obj = {
  //     url: URL_CONFIG.ADD_ADMIN_PANEL,
  //     method: "get"
  //   };

  //   httpHandler(obj)
  //     .then((reponse) => {
  //       setTheme({
  //         color: color ?? reponse?.data?.[0]?.color,
  //       })
  //     }).catch((error) => console.log(error));
  // }

  // const PrivateRoute = ({ children }) => {
  //   if (!sessionStorage?.userData) {
  //     sessionStorage.setItem('redirect', window.location.href)
  //   }
  //   return sessionStorage?.userData ? {...children} : <Redirect to="/login/signin" />;
  // };

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
            theme={theme?.color}
            component={MainContainer}
          />

          {/* <Route path="/app">
            <PrivateRoute>
              <IdleTimerContainer />
            </PrivateRoute> */}

          {/* <PrivateRoute>
              <MainContainer theme={theme?.color} />
            </PrivateRoute> */}

          {/* <PrivateRoute>
              <RolePermissions />
            </PrivateRoute> */}

          {/* <PrivateRoute>
              <TourState />
            </PrivateRoute> */}
          {/* <FirebaseToken /> */}
          {/* </Route> */}
        </Switch>
      </BrowserRouter>

    </div>
  );
}

export default App;
