import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Card from "../UI/Card";
import PageHeader from "../UI/PageHeader";
import ResponseInfo from "../UI/ResponseInfo";
import { URL_CONFIG } from "../constants/rest-config";
import { base64ToFile, pageLoaderHandler } from "../helpers";
import { httpHandler } from "../http/http-interceptor";
import { idmRoleMappingRoles } from "../idm";
import EEPSubmitModal from "../modals/EEPSubmitModal";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import FormContainer from "./FormElements/FormContainer";
import { FormContext } from "./FormElements/FormContext";

const ModifyUser = () => {
  const [userMetaData, setUserMetaData] = useState(null);
  const [uData, setUData] = useState({});
  const [formIsValid, setFormIsValid] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const { id } = useParams();
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

  const handleSubmit = async (event) => {
    
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
      id: uData?.manager ?? uData?.manager?.id?.id
    };
    if (uData?.branch) { uData.branch_id = uData?.branch?.id ?? uData?.branch }
    if (uData?.user_id) { uData.id = uData?.user_id }
    if (uData?.gender) { uData.gender = uData?.gender?.label ?? uData?.gender }
    setFormSubmitted(true);

    if (uData?.role?.value || uData?.role?.idm_id) {
      const roleData = await idmRoleMappingRoles(uData?.role?.value || uData?.role?.idm_id);
      uData.role = {
        idm_id: uData?.role?.idm_id || uData?.role?.value,
        role_name: uData?.role?.roleName || uData?.role?.label,
        screen: uData?.role?.screen || JSON.stringify(roleData?.data)
      };
    }
    if (formIsValid) {
      const obj = {
        url: URL_CONFIG.GETUSER,
        method: "put",
        payload: uData,
      };
      httpHandler(obj)
        .then((response) => {
          // const obj_ = {
          //   url: URL_CONFIG.RESETPASSWORD_AUTH,
          //   method: "post",
          //   payload: { new_password: uData?.password },
          //   isAuth: true
          // };
          // httpHandler(obj_).then(() => {
          setShowModal({
            ...showModal,
            type: "success",
            message: response?.data?.message,
          })
        })

        // })
        .catch((error) => {
          console.log("GETUSER data", error.response.data);
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

  const handleChange = async (field, event) => {
    setFormTouched(true);
    if (field?.name === "imageByte") {
      const file = base64ToFile(event?.image?.replace(/^data:image\/\w+;base64,/, ''))

      const formData = new FormData();
      formData.append("image", file);
      const obj = {
        url: URL_CONFIG.UPLOAD_FILES,
        method: "post",
        payload: formData,
      };
      await httpHandler(obj)
        .then((res) => {
          uData['profilePic'] = res?.data?.data?.[0]?.url ?? ""
        }).catch((error) => console.log(error));

    } else if (field?.name === "branch") {
      uData[field.name] = event;
      const _inx = userMetaData.column3.fields.findIndex(v => v.name === field.name)
      const lb_ = userMetaData.column3.fields[_inx].options?.find(v => v.value === event)
      userMetaData.column3.fields[_inx].value = { label: lb_?.label }
      setUserMetaData({
        ...userMetaData,
      })
    } else if (field?.name === "gender") {
      uData[field.name] = event;
      const _inx = userMetaData.column1.fields.findIndex(v => v.name === field.name)
      userMetaData.column1.fields[_inx].value = { label: event }
      setUserMetaData({
        ...userMetaData,
      })
    } else if (field?.name === "manager") {
      uData[field.name] = event?.id;
    } else if (field["name"] === "country") {
      uData[field.name] = event;
      const _inx = userMetaData.column3.fields.findIndex(v => v.name === 'branch')
      userMetaData.column3.fields[_inx].value = null
      uData['branch'] = null;
      const obj_ = {
        url: URL_CONFIG.GET_ALL_BRANCH_NAME + "?countryId=" + event.id,
        method: "get"
      };
      await httpHandler(obj_)
        .then((user_) => {
          userMetaData.column3.fields[4]["options"] = user_?.data?.map(v => { return { label: v?.name, value: v?.id } });
          setUserMetaData({
            ...userMetaData,
          })
        }).catch((error) => console.log(error));
    } else if (field.type === "datePicker" || field.type === "select") {
      uData[field.name] = field.booleanValue ? (event === 'true' ? true : false) : event;
    } else {
      uData[field.name] = event;
    }
    // }
    setUData((prevState) => {
      return { ...prevState, ...uData };
    });
  };

  const fetchUserMeta = () => {

    fetch(`${process.env.PUBLIC_URL}/data/user.json`)
      .then((response) => response.json())
      .then((data) => {
        // delete data.column3.fields[3]
        data.column3.fields = data.column3.fields.filter(v => v?.type !== "password")
        setUserMetaData(data);
        fetchCurrentUserData(data);
      }).catch((error) => console.log(error));;
  };

  const fetchCurrentUserData = async (userMeta) => {
    

    const obj = {
      url: URL_CONFIG.GETUSER,
      method: "get",
      params: { id },
    };
    await httpHandler(obj)
      .then((uData) => {

        setTimeout(async () => {
          setUData(uData.data);

          if (uData?.data?.country?.id) {
            const obj_ = {
              url: URL_CONFIG.GET_ALL_BRANCH_NAME + "?countryId=" + uData?.data?.country?.id,
              method: "get"
            };
            await httpHandler(obj_)
              .then((user_) => {
                userMeta.column3.fields[4]["options"] = user_?.data?.map(v => { return { label: v?.name, value: v?.id } });
                setUserMetaData({
                  ...userMeta,
                })
                pageLoaderHandler('hide')
              }).catch((error) => console.log(error));
          }

          userDataValueMapping(userMeta, uData.data);
        }, 0);
      })
      .catch((error) => {
        console.log("GETUSER", error.response);
        const errMsg = error.response?.data?.message;
      });
  };

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
        if (fld["type"] === "password") {
          fld["display"] = false;
        }
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
            if (fld["name"] === "password") {
              fld["disabled"] = true;
            }
          }
        }
      }
    }

    setUserMetaData((prev) => {
      return { ...prev, ...userMeta }
    });
  };

  useEffect(() => {

    pageLoaderHandler('show')
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
      <div id="page-loader-container" className="d-none" style={{ zIndex: "1051" }}>
        <div id="loader">
          <img src={process.env.PUBLIC_URL + "/images/loader.gif"} alt="Loader" />
        </div>
      </div>
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
