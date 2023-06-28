import React, { useContext, useEffect, useState } from "react";
import { FormContext } from "./FormContext";

const FileField = (props) => {
  const { field, onUpload, response } = props;
  const initValue = field.value && field.value !== undefined ? field.value : "";
  const [value, setValue] = useState(initValue);
  const [fileName, setFileName] = useState("");
  const initFileMessage = response && response.message ? response.message : "Change profile image (100x100)";
  const initFileClassName = response && response.type ? (response.type === 'success' ? 'response-succ' : 'response-err') : "eep-text-light-grey";
  const [fileMessage, setFileMessage] = useState(initFileMessage);
  const [fileClassName, setFileClassName] = useState(initFileClassName);
  const [enableAction, setEnableAction] = useState(false);

  useEffect(() => {
    if(response && response.message) {
      setEnableAction(false);
      const message = response && response.message ? response.message : "Change profile image (100x100)";
      const classname = response && response.type ? (response.type === 'success' ? 'response-succ' : 'response-err') : "eep-text-light-grey";
      setFileMessage(message);
      setFileClassName(classname);
    }
  }, [initFileMessage, initFileClassName]);


  useEffect(() => {
    const value = initValue ? initValue : "";
    setValue(value);
  }, [initValue]);

  const { handleChange } = useContext(FormContext);

  const triggerFilePicker = () => {
    if (!field.disabled) {
      document.getElementById("fileUpload").click();
    }
  };

  const validImageTypes = ["image/jpeg", "image/jpg", "image/png"];
  const onChangeHandler = (field, event) => {
    
    setEnableAction(false);
    var file = event.target.files[0];
    var fileType = file["type"];
    if (validImageTypes.includes(fileType)) {
      var tempFileName = file.name;
      tempFileName = tempFileName.replace(/\s/g, "");
      setFileName(tempFileName);
      var reader = new FileReader();
      reader.onload = function () {
        document.getElementById("profile-image").src = reader.result;
        let obj = { image: reader.result, name: tempFileName };
        setValue(obj);
        handleChange(field, obj);
      };
      reader.readAsDataURL(file);
      setFileClassName(initFileClassName);
      setFileMessage(initFileMessage);
      if (field.viewMode.actions) {
        setEnableAction(true);
      }
    } else {
      setFileClassName("eep-text-warn");
      setFileMessage("Invalid file! Please choose JPEG, JPG or PNG");
      setEnableAction(false);
    }
  };

  const onClickResetHandler = () => {
    document.getElementById('fileUpload').value= null;
    setValue(initValue);
    setEnableAction(false);
  };

  const onClickUploadHandler = () => {
    if (field.viewMode) {
      // field.viewMode.onUpload(value);
      onUpload(value);
    }
    handleChange(field, value);
  };

  return (
    <div
      className={`col-md-12 form-group text-left ${
        field.mandatory ? "required" : ""
      }`}
    >
      <div className="d-flex flex-column align-items-center text-center">
        <img
          alt="User Pic"
          src={
            value?.image
              ? value?.image
              : `${process.env.PUBLIC_URL}/images/user_profile.png`
          }
          id="profile-image"
          className="rounded-circle c1"
          width="100"
          height="100"
          onClick={triggerFilePicker}
          title={fileName ? fileName : "User Pic"}
        />
        {!field.disabled && (
          <React.Fragment>
            <input
              id="fileUpload"
              name="profile-image-upload"
              className="invisible"
              type="file"
              onChange={(event) => onChangeHandler(field, event)}
            />
            {!enableAction && (
              <div className={fileClassName}>{fileMessage}</div>
            )}
            {field.viewMode.actions && enableAction && (
              <React.Fragment>
                <div className="d-flex">
                  <button
                    className="eep-btn eep-btn-cancel mr-3 eep-btn-xsml"
                    type="button"
                    onClick={onClickResetHandler}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="eep-btn eep-btn-success eep-btn-xsml"
                    onClick={onClickUploadHandler}
                  >
                    Upload
                  </button>
                </div>
              </React.Fragment>
            )}
          </React.Fragment>
        )}
      </div>
    </div>
  );
};
export default FileField;
