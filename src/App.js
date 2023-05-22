import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import "./App.scss";
import Login from "./layout/Login/Login";
import { Redirect, Route, Switch, BrowserRouter } from "react-router-dom";
import MainContainer from "./layout/MainContainer/MainContainer";
import { sharedDataActions } from "./store/shared-data-slice";
import IdleTimerContainer from "./IdleTimer/IdleTimerContainer";
import RolePermissions from "./components/RolePermissions/RolePermissions";
import TourState from "./components/Tour/TourState";
import { firebaseInitialization } from "./notification";
// import FirebaseToken from "./components/Firebase/FirebaseToken";

function App() {
  const dispatch = useDispatch();

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
  }, []);

  return (
    <React.Fragment>
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

    </React.Fragment>
  );
}

export default App;
