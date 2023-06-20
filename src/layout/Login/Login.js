import React, { useState } from "react";
// import classes from "./Login.module.scss";
import LoginForm from "./LoginForm";
import ForgotPassword from "./ForgotPassword";
import ChangePassword from "./ChangePassword";
// import { useSelector } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";
import "../../styles/lib/login-style.scss";
import "../../styles/lib/bg-animations.scss";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";

const Login = () => {
  const [state, setState] = useState({
    "logo": null
  });
  React.useEffect(() => {
    const obj = {
      url: URL_CONFIG.ADD_ADMIN_LOGIN_LOGO,
      method: "get"
    };
    httpHandler(obj)
      .then((reponse) => {
        setState({
          ...state,
          "logo": reponse?.data?.image ?? ''
        })
      })
  }, [])
  return (
    <React.Fragment>
      <div className="bg-area">
        <ul className="bg-circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>

      <div className="eep-login-page">
        <div className="container">
          <div className={`login_centent_sec eep_scroll_y`}>
            <div className={`row content-sect w-100 align-items-center eep_scroll_y`}>
              <div className={`col-md-6 logo-sec`}>
                <img
                  className="mx-auto d-block"
                  src={(state?.logo) || (process.env.PUBLIC_URL + "/images/logo.svg")}
                  alt="Logo"
                />
              </div>
              <div className={`col-md-6 login-sec`}>
                <Switch>
                  <Route path="/login" exact>
                    <Redirect to="/login/signin" />
                  </Route>
                  <Route path="/login/signin">
                    <LoginForm />
                  </Route>
                  <Route path="/login/forgotpassword">
                    <ForgotPassword />
                  </Route>
                  <Route path="/login/changepassword">
                    <ChangePassword />
                  </Route>
                </Switch>
              </div>
              {/* {!showForgotPWModule && (
              <div className={`col-md-6 ${classes.login_sec}`}>
                <LoginForm />
              </div>
            )}
            {showForgotPWModule && (
              <div className={`col-md-6 ${classes.login_sec}`}>
                
              </div>
            )} */}
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default Login;
