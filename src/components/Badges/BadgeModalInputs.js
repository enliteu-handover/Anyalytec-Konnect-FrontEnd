import React, { useEffect, useState } from "react";
import Select from "react-select";
import BootstrapSwitchButton from "bootstrap-switch-button-react";

const BadgeModalInputs = (props) => {

  const {modalInputData, deptInputOptions, getWallPostStatus, getSelectedDept, getHashValues, getRegonitionMsg, showBadgeModal} = props;
  const [recogMessage, setRecogMessage] = useState("");
  const [deptValue, setDeptValue] = useState([]);
  const [toggleSwitch, setToggleSwitch] = useState(false);
  const [hashId, setHashId] = useState([]);
  const msgMaxLength = 120;

  useEffect(() => {
    setDeptValue([]);
    setToggleSwitch(false);
    setHashId([]);
    setRecogMessage("");
    const checkBox = document.getElementsByClassName('socialHashTag');
    for(let i=0; i< checkBox.length; i++)
    {
      checkBox[i].checked = false;
    }

  },[modalInputData, showBadgeModal])

  const handleonKeyUp = (e) => {
    e.target.value = e.target.value.substring(0,msgMaxLength);
    setRecogMessage(e.target.value);
    getRegonitionMsg(e.target.value);
  }
  
  const toggleSwitchHandler = () => {
    setToggleSwitch(prev => !prev)
    let toggleSwitch1 = !toggleSwitch;
    let obj = { wallPost: toggleSwitch1 };
    getWallPostStatus(obj);
  }

  const onDeptChangeHandler = (eve) => {
    getSelectedDept(eve);
    setDeptValue(eve);
  };

  const hashOnChangeHandler = (eve) => {
    const { value, checked } = eve.target;
    var hashIdTemp = hashId;
    if(checked){
      hashIdTemp.push({id:value})
    }else{
      for(let i=0; i<hashIdTemp.length; i++){
        if(value === hashIdTemp[i].id){
          hashIdTemp.splice(i,1);
          break;
        }
      }
    }
    setHashId(hashIdTemp);
    getHashValues(hashIdTemp);
  }

  return (
    <React.Fragment>
      <div className="badge_modal_left_col_inner h-100">
        <div className="row">
          <div className="col-md-12 text-right">
            <div className="eep_recog_enable">
              <BootstrapSwitchButton checked={toggleSwitch} width={140} onstyle="success" onlabel="WALL POST" offlabel=""  style="toggle_switch" onChange={toggleSwitchHandler} />
            </div>
          </div>
          <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 mb-3">
            <div className="text-center">
              <div className="n_badge_add_col_inner_frombadge position-relative bg-white">
                <img
                  src={modalInputData?.imageByte?.image ? modalInputData.imageByte.image : `${process.env.PUBLIC_URL}/images/icons/static/No-Icon.svg`}
                  className="batch_img_modal"
                  alt="Badge Icon"
                  title={modalInputData["name"]}
                />
                {modalInputData["points"] > 0 && (
                  <h5 className="points_highlights">
                    <span>{modalInputData["points"]}</span>
                    <span>{modalInputData["points"] > 1 ? " pts" : " pt"}</span>
                  </h5>
                )}
              </div>
              <label className="n_badge_add_label"> {modalInputData["name"]} </label>
            </div>
          </div>
          <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12">
            <div className=" bg-f5f5f5 p-4 br-10">
              <div className="col-md-12 d-flex justify-content-between px-0 eep_popupLabelMargin">
                <label className="font-helvetica-m  mb-0 c-404040">Department</label>
                <div className="selectall_department_checkbox mr-2">
                  <label className="mb-0">{deptValue.length + "/" + deptInputOptions.length}</label>
                </div>
              </div>
              <div className="col-md-12 form-group text-left eep-badge-select2-dropdown_div px-0">                
                <Select
                  options={[{ label: "Select All", value: "all" },...deptInputOptions]}
                  // options={deptInputOptions}
                  isSearchable={true}
                  className={`form-group select_bgwhite p-0`}
                  name="BadgeSelect"
                  id="badgeselect"
                  defaultValue=""
                  onChange={(event) => {event.length && event.find(option => option.value === 'all') ? onDeptChangeHandler(deptInputOptions) : onDeptChangeHandler(event)}}
                  disabled=""
                  classNamePrefix="eep_select_common select"
                  isClearable={true}
                  isMulti={true}
                  style={{ height: "auto" }}
                  maxMenuHeight={150}
                  value={deptValue}
                />
              </div>
              <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 px-0">
                <textarea
                  name="message"
                  className="form-control badge_recog_msg"
                  id="badge_recog_msg"
                  rows="2"
                  placeholder="Message"
                  maxLength={msgMaxLength} 
                  onChange={handleonKeyUp}
                  value={recogMessage}
                ></textarea>
                <div className="eep_tags_group_div">
                  <span className="help-block">
                    <p id="characterLeft" className="help-block ">
                      <span>{recogMessage.length}</span><span>{`/ ${msgMaxLength}`}</span>
                    </p>
                  </span>
                  <div className="eep-dropdown-divider"></div>
                  <div className="btn-group eep_tags_group hashTag eep_scroll_y" style={{height: "70px"}}>
                    {modalInputData["hashTag"] &&
                      modalInputData["hashTag"].map((dataHash, i) => (
                        <div className="eep_tags" key={"hash_" + i}>
                          <input
                            type="checkbox"
                            className="btn-check socialHashTag"
                            name="hashtag"
                            id={"check" + i}
                            value={dataHash.id}
                            autoComplete="off"
                            onChange={hashOnChangeHandler}
                          />
                          <label
                            className="btn btn-outline-primary"
                            htmlFor={"check" + i}
                          >
                            {dataHash.hashtagName}
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default BadgeModalInputs;
