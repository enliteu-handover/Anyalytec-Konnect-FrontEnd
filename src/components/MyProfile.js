import React, { useEffect, useState } from "react";
import { httpHandler } from "../http/http-interceptor";
import { URL_CONFIG } from "../constants/rest-config";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import { useDispatch, useSelector } from "react-redux";
import PageHeader from "../UI/PageHeader";
import FormContainer from "./FormElements/FormContainer";
import { FormContext } from "./FormElements/FormContext";
import Card from "../UI/Card";
import { Link } from "react-router-dom";
import UpdateProfileModal from "../modals/UpdateProfileModal";
import SignatureUploadModal from "../modals/SignatureUploadModal";
import EEPSubmitModal from "../modals/EEPSubmitModal";

const MyProfile = () => {
  const [userMeta, setUserMeta] = useState(null);
  const [currUserDataNew, setCurrUserDataNew] = useState(null);
  const [pictureResponse, setPictureResponse] = useState({});
  const [showUpdateProfileModal, setShowUpdateProfileModal] = useState(false);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "My Profile",
      link: "",
    },
  ];
  const fetchUserMeta = () => {
    fetch(`${process.env.PUBLIC_URL}/data/user.json`)
      .then((response) => response.json())
      .then((data) => {
        setUserMeta(data);
        fetchCurrentUserData(data);
      });
  };

  const fetchCurrentUserData = (userMeta) => {
    const userData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};
    const obj = {
      url: URL_CONFIG.GETUSER,
      method: "get",
      params: { id: userData.id },
    };
    httpHandler(obj)
      .then((uData) => {
        setTimeout(() => {
          userDataValueMapping(userMeta, uData.data);
        }, 0);
        setCurrUserDataNew(uData.data);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
        setShowModal({
          ...showModal,
          type: "danger",
          message: errMsg,
        });
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

        if ("viewMode" in fld) {
          if (fld["type"] === "number") {
            if (fld["contactNumber"]) {
              if (fld["subField"]) {
                fld["subField"]["type"] = fld["subField"]["viewMode"]["type"];
                fld["subField"]["value"] = loadData(
                  uData,
                  fld["subField"]["viewMode"]["value"]
                );
              }

              fld["type"] = fld["viewMode"]["type"];
              if (fld["viewMode"]["value"].indexOf(".") !== -1) {
                fld["value"] = loadData(uData, fld["viewMode"]["value"]);
              } else {
                fld["value"] =
                  fld["name"] !== "password"
                    ? uData[fld["viewMode"]["value"]]
                    : "";
              }
            } else {
              fld["type"] = fld["viewMode"]["type"];
              if (fld["viewMode"]["value"].indexOf(".") !== -1) {
                fld["value"] = loadData(uData, fld["viewMode"]["value"]);
              } else {
                if (fld["name"] === "active") {
                  fld["value"] = uData[fld["name"]] ? "Active" : "Inactive";
                } else {
                  fld["value"] =
                    fld["name"] !== "password"
                      ? uData[fld["viewMode"]["value"]]
                      : "";
                }
              }
            }
          } else {
            fld["type"] = fld["viewMode"]["type"];
            if (fld["viewMode"]["value"].indexOf(".") !== -1) {
              fld["value"] = loadData(uData, fld["viewMode"]["value"]);
            } else {
              fld["value"] =
                fld["name"] !== "password"
                  ? uData[fld["viewMode"]["value"]]
                  : "";
            }
          }
        } else {
          if (fld["name"].indexOf(".") !== -1) {
            fld["value"] = loadData(uData, fld["name"]);
          } else {
            fld["value"] = fld["name"] !== "password" ? uData[fld["name"]] : "";
          }
        }

        if (fld["type"] === "file") {
          fld["viewMode"]["actions"] = true;
          fld["disabled"] = false;
        }      
        else {
          fld["disabled"] = true;
        }
      }
    }
    setUserMeta((prevState) => {
      return { prevState, ...userMeta };
    });
  };

  useEffect(() => {
    fetchUserMeta();
  }, []);

  const onUpload = (arg) => {
    let currUserDataTemp = JSON.parse(JSON.stringify(currUserDataNew));
    delete currUserDataTemp.createdAt;
    delete currUserDataTemp.createdBy;
    delete currUserDataTemp.department.createdBy;
    delete currUserDataTemp.department.createdBy;
    delete currUserDataTemp.updatedAt;
    delete currUserDataTemp.updatedBy;
    delete currUserDataTemp.department.updatedAt;
    delete currUserDataTemp.department.updatedBy;
    currUserDataTemp.imageByte=arg;
    const obj = {
      url: URL_CONFIG.GETUSER,
      method: "put",
      payload: currUserDataTemp,
    };
    httpHandler(obj)
      .then(() => {
        //const respMsg = response?.data?.message;
        setPictureResponse({
          message : 'Picture updated successfully!', 
          type : 'success'
        }); 
      })
      .catch((error) => {
        const errMsg = error?.response?.data?.message;
        setPictureResponse({
          message : errMsg, 
          type : 'danger'
        }); 
      });
  };

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "My Profile",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, [breadcrumbArr, dispatch]);

  const handleChange = (field, event) => {
    //field["value"] = event;
    //console.log("handle change input", field, event.target.value);
  };

  return (
    <React.Fragment>
      {showUpdateProfileModal && <UpdateProfileModal /> }
      <SignatureUploadModal />

      <PageHeader
        title="My Profile"
        navLinksRight={
          <Link
            className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg"
            to="#"
            data-toggle="modal"
            data-target="#UpdateProfileModal"
            dangerouslySetInnerHTML={{
              __html: svgIcons && svgIcons.Key_icon,
            }}
            onClick={() => setShowUpdateProfileModal(true)}
          ></Link>
        }
      ></PageHeader>
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
      <div className="eep-user-management p-0 m-0">
        <FormContext.Provider value={{ handleChange }}>
          {userMeta && (
            <form autoComplete="off">
              <div className="row">
                <Card className="col-md-4 mb-3">
                  <FormContainer
                    userData={userMeta.column1}
                    onUpload={onUpload}
                    response={pictureResponse}
                  ></FormContainer>
                </Card>
                <Card className="col-md-4 mb-3">
                  <FormContainer userData={userMeta.column2}></FormContainer>
                </Card>
                <Card className="col-md-4 mb-3">
                  <FormContainer userData={userMeta.column3}></FormContainer>
                </Card>
              </div>
            </form>
          )}
        </FormContext.Provider>
      </div>
    </React.Fragment>
  );
};
export default MyProfile;
