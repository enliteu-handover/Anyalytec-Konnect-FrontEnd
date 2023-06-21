import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { httpHandler } from "../http/http-interceptor";
import { URL_CONFIG } from "../constants/rest-config";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import PageHeader from "../UI/PageHeader";
import FormContainer from "./FormElements/FormContainer";
import { FormContext } from "./FormElements/FormContext";
import Card from "../UI/Card";
import EEPSubmitModal from "../modals/EEPSubmitModal";
import ResponseInfo from "../UI/ResponseInfo";

const ModifyUser = () => {
  const [userMetaData, setUserMetaData] = useState(null);
  const [uData, setUData] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { id } = useParams();
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

  const handleSubmit = (event) => {
    
    event.preventDefault();
    delete uData.createdAt;
    delete uData.createdBy;
    delete uData.department.createdBy;
    delete uData.department.createdBy;
    delete uData.updatedAt;
    delete uData.updatedBy;
    delete uData.department.updatedAt;
    delete uData.department.updatedBy;
    uData.manager = {
      id: uData.manager
    };
    setFormSubmitted(true);
    if (formIsValid) {
      const obj = {
        url: URL_CONFIG.GETUSER,
        method: "put",
        payload: uData,
      };
      httpHandler(obj)
        .then((response) => {
          const obj_ = {
            url: URL_CONFIG.RESETPASSWORD_AUTH,
            method: "post",
            payload: { new_password: uData?.password },
            isAuth: true
          };
          httpHandler(obj_).then(() => {
            setShowModal({
              ...showModal,
              type: "success",
              message: response?.data?.message,
            });
          })

        })
        .catch((error) => {
          console.log("error data", error.response.data);
          setShowModal({
            ...showModal,
            type: "danger",
            message: error?.response?.data?.message,
          });
        });
    }
  };

  useEffect(() => {
    const userFields = [];
    for (let fields in userMetaData) {
      if (fields === "column1" || fields === "column2" || fields === "column3") {
        for (let fld of userMetaData[fields].fields) {
          if (fld.type === 'password') {
            fld.mandatory = false;
          }
          if (fld.mandatory) {
            userFields.push(fld.name);
          }
        }
      }
    }
    let validForm = true;
    userFields.map((field) => {
      if (
        uData[field] === "" ||
        uData[field] === null ||
        uData[field] === undefined
      ) {
        validForm = false;
      }
    });

    if (formTouched) {
      setFormIsValid(validForm);
    } else {
      setFormIsValid(false);
    }

  }, [uData, formTouched]);

  const handleChange = (field, event) => {
    setFormTouched(true);
    if (field.type === "datePicker" || field.type === "select") {
      uData[field.name] = field.booleanValue ? (event === 'true' ? true : false) : event;
    } else {
      uData[field.name] = event;
    }
    setUData((prevState) => {
      return { ...prevState, ...uData };
    });
  };

  const fetchUserMeta = () => {
    fetch(`${process.env.PUBLIC_URL}/data/user.json`)
      .then((response) => response.json())
      .then((data) => {
        setUserMetaData(data);
        fetchCurrentUserData(data);
      });
  };

  const fetchCurrentUserData = (userMeta) => {
    const obj = {
      url: URL_CONFIG.GETUSER,
      method: "get",
      params: { id },
    };
    httpHandler(obj)
      .then((uData) => {
        setTimeout(() => {
          setUData(uData.data);
          userDataValueMapping(userMeta, uData.data);
        }, 0);
      })
      .catch((error) => {
        console.log("error", error.response);
        const errMsg = error.response?.data?.message;
      });
  };

  console.log("setUData", uData);

  const loadData = (data, fieldName) => {
    const entries = fieldName.split(".");
    let value = Object.assign({}, data);
    for (const field of entries) {
      if (value[field]) {
        value = value[field];
      } else {
        return null;
      }
    }
    return value;
  };

  const userDataValueMapping = (userMeta, uData) => {
    for (let fields in userMeta) {
      for (let fld of userMeta[fields].fields) {
        if (fld["type"] === "number") {
          if (fld["contactNumber"]) {
            if (fld["subField"]) {
              fld["subField"]["value"] = loadData(
                uData,
                fld["subField"]["viewMode"]["value"]
              );
            }
          }
        }

        if (fld["type"] === "file") {
          if (fld["viewMode"]["value"].indexOf(".") !== -1) {
            fld["value"] = loadData(uData, fld["viewMode"]["value"]);
          }
        }

        if (fld["name"].indexOf(".") !== -1) {
          fld["value"] = loadData(uData, fld["name"]);
        } else {
          if (fld.booleanValue) {
            fld["value"] =
              fld["name"] !== "password" ? String(uData[fld["name"]]) : "";
          } else {
            fld["value"] = fld["name"] !== "password" ? uData[fld["name"]] : "";
          }
        }
      }
    }

    setUserMetaData((prevState) => {
      return { ...prevState, ...userMeta };
    });
  };

  useEffect(() => {
    fetchUserMeta();
  }, []);

  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Admin Panel",
      link: "app/adminpanel",
    },
    {
      label: "USER MANAGEMENT",
      link: "app/usermanagement",
    },
    {
      label: "Modify Profile",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Users",
      })
    );
  }, [breadcrumbArr, dispatch]);

  return (
    <React.Fragment>
      {userRolePermission.adminPanel &&
        <React.Fragment>
          {showModal.type !== null && showModal.message !== null && (
            <EEPSubmitModal
              data={showModal}
              className={`modal-addmessage`}
              hideModal={hideModal}
              successFooterData={
                <Link
                  to="/app/usermanagement"
                  type="button"
                  className="eep-btn eep-btn-xsml eep-btn-success"
                >
                  Ok
                </Link>
              }
              errorFooterData={
                <button
                  type="button"
                  className="eep-btn eep-btn-xsml eep-btn-danger"
                  data-dismiss="modal"
                  onClick={hideModal}
                >
                  Close
                </button>
              }
            ></EEPSubmitModal>
          )}
          <PageHeader title="Update User"></PageHeader>
          <div className="eep-user-management p-0 m-0">
            <FormContext.Provider value={{ handleChange }}>
              {userMetaData && (
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMetaData.column1}
                        formSubmitted={formSubmitted}
                      ></FormContainer>
                    </Card>
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMetaData.column2}
                        formSubmitted={formSubmitted}
                      ></FormContainer>
                    </Card>
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMetaData.column3}
                        formSubmitted={formSubmitted}
                      ></FormContainer>
                    </Card>
                  </div>
                  <div className="row">
                    <Card className="col-md-4 mb-3">
                      <FormContainer userData={userMetaData.status}></FormContainer>
                    </Card>
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMetaData.createdBy}
                      ></FormContainer>
                    </Card>
                    <Card className="col-md-4 mb-3">
                      <FormContainer
                        userData={userMetaData.updatedBy}
                      ></FormContainer>
                    </Card>
                  </div>

                  <div className="d-flex justify-content-center mb-3">
                    <Link
                      to="/app/usermanagement"
                      className="eep-btn eep-btn-cancel mr-3"
                    >
                      Cancel
                    </Link>
                    <button
                      type="submit"
                      className="eep-btn eep-btn-success"
                      disabled={!formIsValid}
                    >
                      Update Profile
                    </button>
                  </div>
                </form>
              )}
            </FormContext.Provider>
          </div>
        </React.Fragment>
      }
      {!userRolePermission.adminPanel &&
        <div className="row eep-content-section-data no-gutters">
          <ResponseInfo
            title="Oops! Looks illigal way."
            responseImg="accessDenied"
            responseClass="response-info"
            messageInfo="Contact Administrator."
          />
        </div>
      }
    </React.Fragment>
  );
};
export default ModifyUser;
