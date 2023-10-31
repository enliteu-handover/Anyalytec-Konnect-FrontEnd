import React, { useState } from "react";
// import classes from "./Login.module.scss";
import ChangePassword from "./ChangePassword";
import ForgotPassword from "./ForgotPassword";
import LoginForm from "./LoginForm";
// import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import "../../styles/lib/bg-animations.scss";
import "../../styles/lib/login-style.scss";
import SvgComponent from "../../components/ViwerComponents";

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
      }).catch(err => console.log(err)
      )
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
            <div className={`row content-sect w-100 width80 align-items-center eep_scroll_y`}>
              <div className={`col-md-6 logo-sec`}>
                {(state?.logo?.includes('.svg') ?
                  <SvgComponent svgUrl={state?.logo} /> :
                  <img
                    className="mx-auto d-block"
                    src={
                      (state?.logo)
                       || (process.env.PUBLIC_URL + "/images/logo.svg")
                    }
                    alt="Logo"
                  />)}
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
