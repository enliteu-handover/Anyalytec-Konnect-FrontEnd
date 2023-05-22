import React, { useEffect, useState} from "react";
import { httpHandler } from "../http/http-interceptor";
import { URL_CONFIG } from "../constants/rest-config";

const AddCertificateToRecognitionModal = (props) => {

  const {certData, fetchCertificateData} = props;

  const [certificateResponseMsg, setCertificateResponseMsg] = useState("");
  const [certificateResponseClassName, setCertificateResponseClassName] = useState("");

  const certificateDataTemp = {
    name: "",
    parameters: "",
    imageByte: {}
  };

  useEffect(() => {
    setCertificateResponseMsg("");
    setCertificateResponseClassName("");
  },[certData]);
  
  const addCertificateHandler = () => {
    if(certData) {
      const certificateData = JSON.parse(JSON.stringify(certificateDataTemp));
      certificateData.name = certData.certificateTitle;
      certificateData.parameters = JSON.stringify(certData.certificateSettings);
      //certificateData.parameters = certData.certificateSettings;
      certificateData.imageByte = {image:certData.dataURI, name:certData.certificateTitle};
      const obj = {
        url: URL_CONFIG.CERTIFICATE,
        method: "post",
        payload: certificateData,
      };
      httpHandler(obj)
        .then((response) => {
          const resMsg = response?.data?.message;
          setCertificateResponseMsg(resMsg);
          setCertificateResponseClassName("response-succ");
          fetchCertificateData();
        })
        .catch((error) => {
          console.log("errorrrr", error);
          const errMsg = error?.response?.data?.message;
          setCertificateResponseMsg(errMsg);
          setCertificateResponseClassName("response-err");
        });
    }
  }

  return (
    <div
      id="certRecognitionModal"
      className="modal fade"
      aria-modal="true"
    >
      <div className="modal-dialog modal-confirm">
        <div className="modal-content">
          <div className="modal-header flex-column">
            <div className="d-flex justify-content-center w-100 modal-icon-box">
              <img
                  src={
                    process.env.PUBLIC_URL + "/images/icons/popup/CertificateConfirm.svg"
                  }
                  className="modal-icon-image"
                  alt="Success"
                />
            </div>           
          </div>
          <div className="modal-body success_message">
            <h5 className="modal-title mb-2">Are you sure?</h5>
            <p className="modal-desc mb-0">Do you really want to add this certificate to recognition?</p>
          </div>
          <div className="modal-footer justify-content-center">

          {!certificateResponseMsg && ( 
            <React.Fragment>
              <button
                type="button"
                className="eep-btn eep-btn-cancel eep-btn-xsml"
                data-dismiss="modal"
              >
                Cancel
              </button>
              <button
                type="button"
                className="eep-btn eep-btn-success eep-btn-xsml"
                onClick={addCertificateHandler}
              >
                Ok
              </button>
            </React.Fragment>
          )}

          {certificateResponseMsg && ( 
            <div className="response-div m-0">
              <p className={`${certificateResponseClassName} response-text`}>{certificateResponseMsg}</p>
            </div> 
          )}

          </div>
        </div>
      </div>
    </div>
    // </div>
  );
};
export default AddCertificateToRecognitionModal;
