import React, { useEffect, useState } from "react";
import classes from "./LoginForm.module.scss";
import Button from "../../UI/Button";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";

const LoginForm = () => {
  const history = useHistory();
  const [togglePWIcon, setTogglePWIcon] = useState(true);
  const pwBgImage = togglePWIcon ? "/images/pw_hide.svg" : "/images/pw_show.svg";

  const [userName, setUserName] = useState("");
  const [userNameTouched, setUserNameTouched] = useState(false);
  const userNameIsValid = userName.trim() !== "";
  const nameInputIsInvalid = !userNameIsValid && userNameTouched;

  const [passWord, setPassWord] = useState("");
  const [passWordTouched, setPasswordTouched] = useState(false);
  const passWordIsValid = passWord.trim() !== "";
  const passWordInputIsInvalid = !passWordIsValid && passWordTouched;

  const [loginError, setLoginError] = useState("");

  const [formIsValid, setFormIsValid] = useState(false);

  useEffect(() => {
    setFormIsValid(false);

    if (userNameIsValid && passWordIsValid) {
      setFormIsValid(true);
    }
  }, [userNameIsValid, passWordIsValid]);

  const passwordToggleHandler = () => {
    setTogglePWIcon(!togglePWIcon);
  };

  const userNameInputChangeHandler = (event) => {
    setLoginError("");
    setUserName(event.target.value);
  };

  const userNameBlurHandler = (event) => {
    setUserNameTouched(true);
  };

  const passWordChangeHandler = (event) => {
    setLoginError("");
    setPassWord(event.target.value);
  };

  const passWordBlurHandler = () => {
    setPasswordTouched(true);
  };

  const formSubmissionHandler = (event) => {
    event.preventDefault();
    setUserNameTouched(true);
    setPasswordTouched(true);

    let options1 = {
      username: userName,
      password: passWord,
    };

    if (formIsValid) {
      const obj = {
        url: URL_CONFIG.LOGIN,
        method: "post",
        payload: options1,
        isLoader: true
      };
      httpHandler(obj)
        .then((userData) => {
          sessionStorage.userData = JSON.stringify(userData.data);
          sessionStorage.loggedInTime = new Date().getTime();
          history.push("/app/dashboard");
        })
        .catch((error) => {
          console.log("formSubmissionHandler error", error.response);
          //const errMsg = error.response?.data?.message;
          const errMsg = "Invalid credentials.";
          setLoginError(errMsg);
        });
    }
  };

  const nameInputClasses = nameInputIsInvalid ? `${classes.invalid}` : "";
  const passwordInputClasses = passWordInputIsInvalid ? `${classes.invalid}` : "";

  return (
    <div className={classes.loginFormContainer}>
      <h2 className={`text-center `}>Welcome</h2>
      <h4 className="text-center">Login to your account to continue</h4>
      <div className={classes.formWrapper}>
        <form id="loginform" onSubmit={formSubmissionHandler} method="post">
          <div className={`${classes.form_inputs_div} form-inputs-div`}>
            <div className="eep-input-group">
              <div
                className={`${classes.input_group} ${nameInputClasses} form-group input-group`}
                style={{ display: "flex" }}
              >
                <input
                  type="text"
                  id="username"
                  name="username"
                  className={`${classes.form_control} form-control`}
                  value={userName}
                  placeholder="USERNAME"
                  onChange={userNameInputChangeHandler}
                  onBlur={userNameBlurHandler}
                />
                {nameInputIsInvalid && (
                  <p className="error-text">Please enter user name</p>
                )}
              </div>
            </div>
            <div className="eep-input-group">
              <div
                className={`${classes.input_group} ${passwordInputClasses} form-group input-group`}
                style={{ display: "flex" }}
              >
                <input
                  type={togglePWIcon ? "password" : "text"}
                  id="password"
                  name="password"
                  className={`${classes.form_control} form-control`}
                  placeholder="PASSWORD"
                  onChange={passWordChangeHandler}
                  onBlur={passWordBlurHandler}
                />

                <div className="input-group-addon">
                  <div
                    className="icon-place-holder"
                    style={{
                      backgroundImage: `url(${process.env.PUBLIC_URL + `${pwBgImage}`
                        })`,
                    }}
                    onClick={passwordToggleHandler}
                  ></div>
                </div>
                {passWordInputIsInvalid && (
                  <p className="error-text">Please enter password</p>
                )}
                {loginError && <p className="error-text">{loginError}</p>}
              </div>
            </div>
          </div>
          <div className={classes.btnSubmit_div}>
            <div className="row justify-content-center">
              <Button
                type="submit"
                className={`${classes.btnSubmit} btn btn-login`}
                name="SIGN IN"
              ></Button>
            </div>
          </div>
        </form>
        <div className={classes.fgt_pwd_div}>
          <div className="row text-center justify-content-center">
            <Link to="/login/forgotpassword" className={classes.fgt_pwd}>
              Forgot password?
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LoginForm;
