import React, { useEffect, useState } from "react";
import { base64ToFile } from "../../helpers";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";

const AddRecognitionIcon = (props) => {

  const { libImageData, getImageData } = props;
  let initRecognitionIcon = libImageData ? libImageData.image : null;
  const [recognitionIcon, setRecognitionIcon] = useState(initRecognitionIcon);
  let initIconName = libImageData ? libImageData.name : "";
  const [fileName, setFileName] = useState(initIconName);
  const [recognitionIconValue, setRecognitionIconValue] = useState({});
  const initFileMessage = libImageData ? "" : "Click to add/change icon";
  const initFileClassName = "mt-2 eep-text-light-grey";
  const [fileMessage, setFileMessage] = useState(initFileMessage);
  const [fileClassName, setFileClassName] = useState(initFileClassName);

  useEffect(() => {
    let obj = { image: recognitionIcon, name: fileName };
    getImageData(obj);
  }, [recognitionIconValue, recognitionIcon, fileName])

  const addIconClickHandler = () => {
    document.getElementById("recognition-file-upload").click();
  };

  const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
  const onChangeHandler = (event) => {
    setFileMessage("");
    var file = event.target.files[0];
    var fileType = file["type"];
    if (validImageTypes.includes(fileType)) {
      var tempFileName = file.name;
      tempFileName = tempFileName.replace(/\s/g, "");
      setFileName(tempFileName);
      var reader = new FileReader();
      reader.onload = async function () {

        const file = base64ToFile(reader?.result?.replace(/^data:image\/\w+;base64,/, ''))

        const formData = new FormData();
        formData.append("image", file);
        const obj_ = {
          url: URL_CONFIG.UPLOAD_FILES,
          method: "post",
          payload: formData,
        };
        await httpHandler(obj_)
          .then((res) => {
            const img = res?.data?.data?.[0]?.url ?? ""
            let obj = { image: img, name: tempFileName };
            document.getElementById("recognition-icon").src = img;
            setRecognitionIcon(img);
            getImageData(obj);
            setRecognitionIconValue(obj);
          })
      };
      reader.readAsDataURL(file);
    } else {
      setRecognitionIcon(null);
      setFileName("");
      getImageData({});
      setRecognitionIconValue({});
      setFileClassName("mt-2 eep-text-warn");
      setFileMessage("Invalid file! Please choose JPEG, JPG, PNG or SVG");
    }
  };

  return (
    <React.Fragment>
      <div className={`n_badge_add_col_inner ${libImageData ? "" : "c1"}`} title="Add Icon">
        <div className="n_badge_add_col adding_n">
          <div className="outter">
            {libImageData && (
              <img
                src={recognitionIcon}
                id="recognition-icon"
                className="plus_white_img"
                alt={fileName ? fileName : "Plus Icon"}
                title={fileName}
              />
            )}
            {!libImageData && (
              <img
                src={recognitionIcon ? recognitionIcon : process.env.PUBLIC_URL + "/images/icons/plus-white.svg"}
                id="recognition-icon"
                className={`${recognitionIconValue && recognitionIconValue.image ? "" : "inner_padding"} plus_white_img`}
                alt={recognitionIconValue && recognitionIconValue.name ? recognitionIconValue?.name : "Plus Icon"}
                title={recognitionIconValue && recognitionIconValue.name ? recognitionIconValue?.name : "Recognition Icon"}
                onClick={addIconClickHandler}
              />
            )}
          </div>
        </div>
        <div className={fileClassName}>{fileMessage}</div>
      </div>
      {!libImageData && (
        <input
          id="recognition-file-upload"
          className="invisible"
          type="file"
          accept="image/png, image/jpg, image/jpeg"
          onChange={(event) => onChangeHandler(event)}
        />
      )}
    </React.Fragment>
  );
};

export default AddRecognitionIcon;
