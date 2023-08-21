import { getRoles } from '@crayond_dev/idm-client';
import React, { useEffect, useState } from "react";
import { useDispatch } from 'react-redux';
import { Link, useHistory } from "react-router-dom";
import Button from "../../UI/Button";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import { idmRoleMapping } from '../../idm';
import { sharedDataActions } from '../../store/shared-data-slice';
import classes from "./LoginForm.module.scss";

const LoginForm = () => {
  const history = useHistory();
  const dispatch = useDispatch();
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
    debugger
    event.preventDefault();
    setUserNameTouched(true);
    setPasswordTouched(true);

    let options1 = {
      username: userName,
      password: passWord,
    };

    if (formIsValid) {
      const obj = {
        url: URL_CONFIG.AUTH_LOGIN_URL,
        method: "post",
        payload: options1,
        isLoader: true,
        isAuth: true
      };
      httpHandler(obj)
        .then(async (userData) => {
          sessionStorage.userData = JSON.stringify({
            "id": userData.data.data.user?.id,
            "username": userData?.data?.data?.user?.username,
            "email": userData?.data?.data?.user?.email_id,
            "fullName": userData?.data?.data?.user?.username,
            "tokenType": "Bearer",
            accessToken: userData?.data?.data?.token
            // accessToken: "eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJBZG1pbmlzdHJhdG9yIiwiaWF0IjoxNjg2ODI0NTE1LCJleHAiOjE2ODY4MjYzMTV9.J-C3XMTogyhBQR-00LkHhBS20MeoiPNrpsCoaRRN_CCxQkPldYnv9vx7tpS5r3leRROgbg8DUtHTjRay16b04g"
          });
          sessionStorage.loggedInTime = new Date().getTime();
          await updateToLoginUserTokenHandler(userData?.data?.data?.token)
          await idmRolesToUpdateInDb()?.then(async () => {
            await fetchPermission()?.then(() => {
              if (sessionStorage?.redirect && sessionStorage?.redirect.includes('slack=true')) {
                const url = new URL(sessionStorage?.redirect);
                const router = url.pathname;
                console.log(router);
                history.push(router + '#' + sessionStorage?.redirect.split('#')[1]);
                sessionStorage.removeItem('redirect')
              } else {
                history.push("/app/dashboard");
              }
            })
          })
        })
        .catch((error) => {
          console.log("formSubmissionHandler error", error.response);
          //const errMsg = error.response?.data?.message;
          const errMsg = "Invalid credentials.";
          setLoginError(errMsg);
        });
    }
  };

  const updateToLoginUserTokenHandler = async (token) => {

    const obj = {
      url: URL_CONFIG.TOKEN_UPDATE,
      method: "post",
      payload: { token: token ?? localStorage.getItem("deviceToken") },
      isLoader: true
    };

    await httpHandler(obj);
  };

  const idmRolesToUpdateInDb = async () => {
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

  const fetchPermission = async () => {
    debugger
    const obj = {
      url: URL_CONFIG.USER_PERMISSION,
      method: "get",
    };
    await httpHandler(obj).then(async (response) => {
      const roleData = await idmRoleMapping(response?.data?.roleId?.idmID);

      const getAndUpdate = sessionStorage.getItem('userData')
      const addFileds = {
        ...JSON.parse(getAndUpdate),
        firstName: response?.data?.firstName, 
        lastName: response?.data?.lastName,
      }
      sessionStorage.setItem('userData', JSON.stringify(addFileds))
      dispatch(sharedDataActions.getUserRolePermission({
        userRolePermission: roleData?.data
      }));

      let payOptionsRole = {
        data: roleData?.rolesData,
        role_id: roleData?.roleId,
        screen: JSON.stringify(roleData?.data)
      };

      const objRole = {
        url: URL_CONFIG.ADDROLE,
        method: "post",
        payload: payOptionsRole,
      };

      await httpHandler(objRole)
    }).catch((error) => {
      console.log("fetchPermission error", error);
    });
  }

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
