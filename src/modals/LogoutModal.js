import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { httpHandler } from "../http/http-interceptor";
import { URL_CONFIG } from "../constants/rest-config";
const LogoutModal = () => {
  const history = useHistory();

  useEffect(() => {
    return () => {
      let collections = document.getElementsByClassName("modal-backdrop");
      for (var i = 0; i < collections.length; i++) {
        collections[i].remove();
      }
    };
  }, []);

  const logoutHandler = () => {
    // const obj = {
    //   url: URL_CONFIG.LOGOUT,
    //   method: "post",
    //   payload: {},
    // };
    // httpHandler(obj)
    //   .then(() => {
    //     sessionStorage.clear();
    //     history.push("/login/signin");
    //   })
    //   .catch((error) => {
    //     const errMsg = error.response?.data?.message;
    //   });
    sessionStorage.clear();
    localStorage.clear(); 
    history.push("/login/signin");
  };

  return (
    <div
      className="modal fade modalClass"
      id="logoutModal"
      tabIndex="-1"
      role="dialog"
      aria-labelledby="exampleModalLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          <div className="modal-header justify-content-center border-0">
            <div
              className="d-flex justify-content-center w-100 modal-icon-box"
            >
              <img
                src={
                  process.env.PUBLIC_URL + "/images/icons/popup/logout.svg"
                }
                className="modal-icon-image"
                alt="Failure"
              />
            </div>
            <button
              className="close closed"
              type="button"
              data-dismiss="modal"
              aria-label="Close"
            >
            </button>
          </div>
          <div className="modal-body">
            <h5 className="modal-title mb-2" id="exampleModalLabel">
              Ready to Leave?
            </h5>
            <p className="modal-desc mb-0">
              Select "Logout" below if you are ready to end your current
              session.
            </p>
          </div>
          <div className="modal-footer justify-content-center border-0">
            <button
              className="eep-btn eep-btn-cancel"
              type="button"
              data-dismiss="modal"
            >
              Cancel
            </button>
            <Link
              className="eep-btn eep-btn-success"
              onClick={logoutHandler}
              to="#"
            >
              Logout
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
export default LogoutModal;
