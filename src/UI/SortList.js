import React, { useState } from "react";
import Select from "react-select";

const SortList = (props) => {
 
  const { readAllCommunicationsFromList, feedFilter, onChangeValues, communicationPostLists, dateReceivedOrder, isFeed } = props;

  const [isDateReceived, setIsDateReceived] = useState(false);

  let checker = arr => arr.every(v => v.ideaIsRead === true);

  const markAllAsRead = () => {

    var checkBox = document.getElementById("postCheckbox");
    if (checkBox.checked === true) {
      if (!checker(communicationPostLists)) {
        readAllCommunicationsFromList(true);
      }
    }
  }

  const sortDateReceived = () => {
    setIsDateReceived((prevState) => !prevState);
    dateReceivedOrder(!isDateReceived);
  }

  const initOptions = [
    {
      label: "All Post",
      value: 'allpost'
    },
    {
      label: "My Post",
      value: 'mypost'
    }
  ]

  return (
    <div className="row sticky-top bg-white mb-3" style={{ height: "30px" }}>
      <div className="col-12 bg-white">
        <div className="filter bg-white">
          <div className="arrow_div feedback_arrow_div">
            {isFeed ?
              <div className="flex">
                <Select
                  styles={{ height: "20px", maxHeight: "20px" }}
                  options={initOptions}
                  placeholder="Select..."
                  classNamePrefix="eep_select_common eep_select_common_sort select"
                  className="border_none select-with-bg"
                  onChange={(event) => {
                    onChangeValues(event)
                    dateReceivedOrder(false);
                  }}
                  value={feedFilter}
                />
                {
                  isDateReceived ? <span className="c1 i_position" onClick={sortDateReceived}>Oldest
                    <i className="fa fa-angle-up arrow_postion" style={{ fontSize: "15px", marginTop: 1.5 }}></i>
                  </span> :
                    <span className="c1 i_position" onClick={sortDateReceived}>Newest
                      <i className="fa fa-angle-down arrow_postion" style={{ fontSize: "15px", marginTop: 1.5 }}></i>
                    </span>
                }
              </div>
              :
              <span className="c1 i_position" onClick={sortDateReceived}>Date Received
                {!isDateReceived &&
                  <i className="fa fa-angle-up arrow_postion" style={{ fontSize: "15px" }}></i>
                }
                {isDateReceived &&
                  <i className="fa fa-angle-down arrow_postion" style={{ fontSize: "15px" }}></i>
                }
              </span>
            }
          </div>
          {!isFeed && <div className="form-check pr-2" style={{ display: "flex", alignItems: "center" }}>
            <input type="checkbox" className="form-check-input" id="postCheckbox" onChange={markAllAsRead} style={{ marginTop: "1px" }} />
            <label className="form-check-label" htmlFor="postCheckbox"> Mark all as read </label>
          </div>}
        </div>
      </div>
    </div >
  );
}

export default SortList;