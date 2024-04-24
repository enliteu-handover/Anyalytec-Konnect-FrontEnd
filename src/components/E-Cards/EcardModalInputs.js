import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Select from "react-select";

const EcardModalInputs = (props) => {

  const { ccMessageValue, comoseMessageHandler, composeCardCategory, getComposeInputsData, isDashbaordData } = props;
  let composeCardCategoryVal = composeCardCategory.category;
  const initValue = ccMessageValue[composeCardCategoryVal] ? ccMessageValue[composeCardCategoryVal] : "";
  const initUserOption = composeCardCategory.userData ? composeCardCategory.userData : [];
  const initUserEmailOption = composeCardCategory.userEmailData ? composeCardCategory.userEmailData : [];
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [toggleComposeMessage, setToggleComposeMessage] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [openCCMenu, setOpenCCMenu] = useState(false);
  const [ccMessageArray, setCCMessageArray] = useState([]);
  const [userOptions, setUserOptions] = useState([]);
  const [userEmailOptions, setUserEmailOptions] = useState([]);
  const [toValue, setToValue] = useState([]);
  const [ccValue, setCCValue] = useState([]);
  const inputObj = {
    to: null,
    cc: [],
    type: composeCardCategoryVal,
    message: "",
  }
  const [composeInputs, setComposeInputs] = useState({});

  useEffect(() => {
    setCCMessageArray(initValue);
    setUserOptions(initUserOption);
    setUserEmailOptions(initUserEmailOption);
    setComposeInputs(inputObj);
    setToValue([]);
    setCCValue([]);
    clearComposeMessage();
    if (isDashbaordData && initUserOption?.length > 0) {
      handleInputChange(isDashbaordData)
    }
  }, [initValue, initUserOption, initUserEmailOption]);

  const clearComposeMessage = () => {
    comoseMessageHandler("", "", false);
    var elems = document.querySelectorAll(".ccmesg");
    [].forEach.call(elems, function (el) {
      el.classList.remove("selected");
    });
  }

  const ShowComposeMessageHandler = () => {
    clearComposeMessage();
    setToggleComposeMessage(!toggleComposeMessage);
    let composeInputsTemp = JSON.parse(JSON.stringify(composeInputs));
    composeInputsTemp.message = "";
    setComposeInputs(composeInputsTemp);
    getComposeInputsData(composeInputsTemp);
  }

  const clkComoseMessageHandler = (e, clkMessage, clkState) => {
    comoseMessageHandler(e, clkMessage, clkState);
    let composeInputsTemp = JSON.parse(JSON.stringify(composeInputs));
    composeInputsTemp.message = clkMessage;
    setComposeInputs(composeInputsTemp);
    getComposeInputsData(composeInputsTemp);
  }

  const CustomComposeMessageHandler = (e) => {
    comoseMessageHandler("", e.target.value, false);
    let composeInputsTemp = JSON.parse(JSON.stringify(composeInputs));
    composeInputsTemp.message = e.target.value;
    setComposeInputs(composeInputsTemp);
    getComposeInputsData(composeInputsTemp);
  }

  const menuHideShow = (arg) => {
    setOpenMenu(arg);
  }

  const ccMenuHideShow = (arg) => {
    setOpenCCMenu(arg);
  }

  const handleInputChange = (evt) => {
    setToValue(evt);
    setOpenMenu(false);
    let composeInputsTemp = JSON.parse(JSON.stringify(composeInputs));
    composeInputsTemp.to = evt.value;
    setComposeInputs(composeInputsTemp);
    getComposeInputsData(composeInputsTemp);
  }

  const handleRecipientChange = (evt) => {
    setCCValue(evt);
    setOpenCCMenu(false);
    let composeInputsTemp = JSON.parse(JSON.stringify(composeInputs));
    let ccVal = [];
    evt.length > 0 && evt.map((item) => {
      ccVal.push(item.value);
    })
    composeInputsTemp.cc = ccVal;
    setComposeInputs(composeInputsTemp);
    getComposeInputsData(composeInputsTemp);
  }

  useEffect(() => {
    if (isDashbaordData && initUserOption?.length > 0) {
      handleInputChange(isDashbaordData)
    }
  }, [isDashbaordData]);
  return (
    <React.Fragment>
      <div className="compose_text">
        <img src={`${process.env.PUBLIC_URL}/images/icons/tasks/compose.png`} alt="Icon" />
      </div>
      <h4 className="text-center cc_color my-3 font-helvetica-m font-weight-bold">
        Compose Card
      </h4>
      <form className="form-horizontal">
        <div className="form-group row">
          <label htmlFor="toEmail" className="col-sm-1 col-form-label">
            To:
          </label>
          <div className="col-sm-11">
            <Select
              options={userOptions}
              placeholder="Enter User Name or Department Name"
              isSearchable={true}
              className={`form-group select_bgwhite p-0 mb-0`}
              name="UserSelect"
              id="userselect"
              defaultValue=""
              onChange={(event) => handleInputChange(event)}
              onBlur={() => menuHideShow(false)}
              onKeyDown={() => menuHideShow(true)}
              classNamePrefix="eep_select_common eep_compose_inputs select"
              style={{ height: "auto" }}
              maxMenuHeight={150}
              value={toValue}
              menuIsOpen={openMenu}
            />
          </div>
        </div>
        <div className="form-group row">
          <label htmlFor="ccEmail" className="col-sm-1 col-form-label">
            CC:
          </label>
          <div className="col-sm-11 ccEmail_div">
            <Select
              options={userEmailOptions}
              placeholder="Add more recipient's"
              isSearchable={true}
              className={`form-group select_bgwhite p-0 mb-0`}
              name="recipientSelect"
              id="recipientselect"
              defaultValue=""
              onChange={(event) => handleRecipientChange(event)}
              onBlur={() => ccMenuHideShow(false)}
              onKeyDown={() => ccMenuHideShow(true)}
              classNamePrefix="eep_select_common eep_compose_inputs select"
              style={{ height: "auto" }}
              maxMenuHeight={150}
              value={ccValue}
              menuIsOpen={openCCMenu}
              isMulti={true}
              isClearable={false}
            />
          </div>
        </div>
        <div className="form-group row yourmessage_div">
          <div className="col-sm-1"></div>
          <div className="col-sm-11">
            <div className="bg-white px-3 py-3 yourmessage_inner_div text-center">
              {ccMessageArray && ccMessageArray.length > 0 && (
                <div className="col-sm-12 pb-2 mb-2">Select your message</div>
              )}
              <div className="col-sm-12">
                <div className="row mb-2 eep_scroll_y" style={{ maxHeight: "70px" }}>
                  {ccMessageArray && ccMessageArray.length > 0 && ccMessageArray.map((mesg, index) => {
                    return (
                      <button type="button" key={"msg_" + index} className="btn btn-secondary btn-lg m-1 ccmesg"
                        onClick={(e) => { clkComoseMessageHandler(e, mesg.message, true); setToggleComposeMessage(false) }}>
                        Message {index + 1}
                      </button>
                    )
                  })}
                </div>
                <div className="row col-md-12 px-0 ccMessageAdd_div">
                  <div className="input-group col-md-12 mb-3 ml-2 px-0">
                    <button type="button" className="btn col-md-12 pr-1 ccMessageAdd align-items-center d-flex justify-content-between" onClick={ShowComposeMessageHandler}>
                      <span>Compose your message</span>
                      {!toggleComposeMessage ? <span className="mr-1" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus_sm }}></span> :
                        <span className="mr-1" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.minus_sm }}></span>}
                    </button>
                  </div>
                  {toggleComposeMessage && (
                    <div className="input-group col-md-12 mb-3 ml-2 px-0">
                      <textarea id="ccNewMessage" className="form-control ccNewMessage" rows="3" style={{ resize: "none" }} onKeyUp={CustomComposeMessageHandler}></textarea>
                    </div>
                  )}
                </div>
              </div>
              <input type="hidden" id="ccMessage" className="form-control text-center cc_required ccMessage" />
            </div>
          </div>
        </div>
      </form>
    </React.Fragment>
  );
};

export default EcardModalInputs;
