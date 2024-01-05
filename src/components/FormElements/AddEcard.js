import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EEPSubmitModal from "../../modals/EEPSubmitModal";

const AddEcard = (props) => {
  const { getImageData, eCardCategory } = props;

  const initECardCategory = eCardCategory ? eCardCategory : "";
  const [eCardCategoryVal, setECardCategoryVal] = useState("");
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  useEffect(() => {
    setECardCategoryVal(initECardCategory);
  }, [initECardCategory]);

  const addIconClickHandler = () => {
    document.getElementById("imgFileLoader").value = null;
    document.getElementById("imgFileLoader").click();
  };

  const validImageTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/svg+xml",
  ];
  const onChangeHandler = (event) => {
    var file = event.target.files[0];
    var fileType = file["type"];
    if (validImageTypes.includes(fileType)) {
      var tempFileName = file.name;
      tempFileName = tempFileName.replace(/\s/g, "");
      var reader = new FileReader();
      reader.onload = function () {
        let obj = { image: reader.result, name: tempFileName, contentType: file.type, cat: eCardCategoryVal };
        getImageData(obj);
      };
      reader.readAsDataURL(file);
    } else {
      setShowModal({
        ...showModal,
        type: "danger",
        message: "Invalid file! Please choose JPEG, JPG, PNG or SVG",
      });
    }
  };

  return (
    <React.Fragment>
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <Link
              to="/app/ecardindex"
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
      <div className="n_card_add_col_inner" title="Add Template">
        <div className="add_temp_img n_card_add_col p-3">
          <div className="outter" style={{ justifyContent: 'center' }}>
            <img
              src={`${process.env.PUBLIC_URL}/images/icons/plus-white.svg`}
              className="plus_white_img"
              alt="Plus White"
              title="Add Image"
              onClick={() => { addIconClickHandler() }}
            />
            Max Upload 1Mb
          </div>
        </div>
      </div>
      <input
        id="imgFileLoader"
        className="invisible"
        type="file"
        accept="image/png, image/jpg, image/jpeg"
        onChange={(event) => onChangeHandler(event)}
      />
    </React.Fragment>
  );
};
export default AddEcard;
