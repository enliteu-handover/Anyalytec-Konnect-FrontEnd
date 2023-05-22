import React, { useEffect, useState } from "react";
import Select from "react-select";

const SpotAwardModalInput = (props) => {  
  const {deptOptions, getSelectedDeptment} = props; 

  const optionsOne = [  
    { value: 'Spot', label: 'Spot Award' },
  ];

  const [deptValue, setDeptValue] = useState([]);

  const onDeptChangeHandler = (eve) => {
    setDeptValue(eve);
    getSelectedDeptment(eve);
  };

  return (
    <div className="col-md-8 col-lg-8 col-xs-12 col-sm-12">
      <div className="bg-f5f5f5 br-15 h-100">
        <div className="p-4">
          <div className="r_award_col_div">
            <div className="col-md-12 form-group px-0 eep-recognition-select2-dropdown_div">
              <label className="font-helvetica-m c-404040">Award Type</label>                
              <Select
                options= {optionsOne}
                // placeholder=""
                classNamePrefix="eep_select_common select"
                className={`form-control a_designation basic-single p-0`}
                style={""}
                // menuPlacement=""
                // onChange=""
                defaultValue={optionsOne[0]}
                maxMenuHeight={150}
              />
            </div>
            <div className="col-md-12 form-group text-left eep-badge-select2-dropdown_div px-0">
              <div className="d-flex p-0 mb-2">
                <label className="font-helvetica-m c-404040">Department</label>
              </div>
              <Select
                options={deptOptions}
                isSearchable={true}
                className={`form-group select_bgwhite p-0`}
                name="BadgeSelect"
                id="badgeselect"
                defaultValue=""
                onChange={(event) => {event.length && event.find(option => option.value === 'all') ? onDeptChangeHandler(deptOptions) : onDeptChangeHandler(event)}}
                //onChange={(event) => onDeptChangeHandler(event)}
                disabled=""
                classNamePrefix="eep_select_common select"
                isClearable={true}
                isMulti={true}
                style={{ height: "auto" }}
                maxMenuHeight={150}
                value={deptValue}
              />
            </div>
            <div className="col-md-12 col-lg-12 col-sm-12 col-xs-12 px-0 form-group s_awardDetails_div">
              <div className="bg-white br-10 h-100">
                <div className="p-3">
                  <div className="s_awardDetails_lb text-left">
                    <label className="font-helvetica-m c-404040">Selection Details</label>
                  </div>
                  <div className="row justify-content-md-center">
                    <div className="col-md-10 col-lg-10 col-sm-12 col-xs-12 s_awardDetails_inner">
                      <p className="col-md-6 col-sm-12 s_awardDetails_dept mb-0 text-center"> No. of Depts: <span>{deptValue.length}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SpotAwardModalInput;