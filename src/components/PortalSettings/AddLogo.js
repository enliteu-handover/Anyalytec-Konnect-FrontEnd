import React, { useEffect, useState } from "react";

const AddLogo = (props) => {

  const { clickId, settings } = props;
  const [showAdd, setShowAdd] = useState(true);
  const [imageByte, setImageByte] = useState({ image: "", name: "" });
  const initFileMessage = "Click to add/change Logo";
  const initFileClassName = "mt-2 eep-text-light-grey";
  const [fileMessage, setFileMessage] = useState(initFileMessage);
  const [fileClassName, setFileClassName] = useState(initFileClassName);
  const [imgArry, setImgArry] = useState(settings.uploadImgArry);

  const addLogoHandler = () => {
    let tempfile = document.getElementById(clickId);
    tempfile.value = '';
    document.getElementById(clickId).click();
  };

  const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];

  const logoUploadHandlerIsNew = (event) => {
    var file = event.target.files[0];
    settings.checkKey(settings?.key, file);
  };

  const logoUploadHandler = (event) => {
    var file = event.target.files[0];
    if (file) {
      var fileType = file["type"];
      if (validImageTypes.includes(fileType)) {
        var tempFileName = file.name;
        tempFileName = tempFileName.replace(/\s/g, "");
        var reader = new FileReader();
        reader.onload = function () {
          let obj = { image: reader.result, name: tempFileName };
          setImageByte(obj);
          setShowAdd(false);
          let tempImgArry = imgArry;
          console.log("tempImgArry", tempImgArry);
          let imgObj = { id: settings.imgId, imgData: obj };
          if (!tempImgArry.length) {
            tempImgArry.push(imgObj);
            setImgArry(tempImgArry);
          }
          else {
            tempImgArry.map((item) => {
              console.log("RK item:", item);
              settings.checkKey(item, imgObj);
            });
          }
        };
        reader.readAsDataURL(file);
        setFileClassName(initFileClassName);
        setFileMessage(initFileMessage);
      }
      else {
        setImageByte({ image: "", name: "" });
        setShowAdd(true);
        setFileClassName("mt-2 eep-text-warn");
        setFileMessage("Invalid file! Please choose JPEG, JPG, PNG or SVG");
      }
    } else {
      clearImage("", true);
    }
  };

  const clearImage = (arg, val = true) => {
    if (arg === settings.imgId) {
      document.getElementById(arg).src = " ";
      let tempimgArry = imgArry;
      tempimgArry.map((item, index) => {
        if (item.id === arg) {
          tempimgArry.splice(index, 1);
        }
      });
      setImgArry(tempimgArry);
      setShowAdd(true);
      settings.clearImageHandler({ clear: false, clearImgId: "" });
      if (val) {
        let tempfile = document.getElementById(clickId);
        tempfile.value = '';
        document.getElementById(clickId).click();
      }
    }
  }

  useEffect(() => {
    if (settings && settings.isClear.clear && !showAdd) {
      let clrId = settings.isClear.clearImgId;
      clearImage(clrId);
    }
  }, [settings]);

  return (
    <React.Fragment>
      <div className="img_container" title="Add Logo">
        {showAdd &&
          <React.Fragment>
            <div className="img_box c1 mx-auto" style={{ width: settings.imgWidth, height: settings.imgHeight }} onClick={addLogoHandler}>
              <img src={process.env.PUBLIC_URL + "/images/icons/plus-white.svg"} className="plus_white_img img_outter" alt="Plus White" title="Add Logo" />
            </div>
            <div className={`pl-1 text-center ${fileClassName}`}>{fileMessage}</div>
          </React.Fragment>
        }
        {!showAdd &&
          <div className="img_box mx-auto bg-transparentt Logo-width" style={{ width: settings.imgWidth, height: settings.imgHeight }}>
            <img id={settings.imgId} src={settings && imageByte.image} width="100%" height="100%" title={settings && imageByte.name} alt="Logo" onClick={() => clearImage(settings.imgId)} />
          </div>
        }
        <input id={clickId} className="d-none" type="file" onChange={(event) => settings?.isNew ? logoUploadHandlerIsNew(event) : logoUploadHandler(event)} />
      </div>
    </React.Fragment>
  );
};
export default AddLogo;