import React, { useState } from "react";

const SortList = (props) => {

  const {readAllCommunicationsFromList, communicationPostLists, dateReceivedOrder} = props;

  const [isDateReceived, setIsDateReceived] = useState(false);

  let checker = arr => arr.every(v => v.ideaIsRead === true);

  const markAllAsRead = () => {
    var checkBox = document.getElementById("postCheckbox");
    if(checkBox.checked === true) {
      if(!checker(communicationPostLists)) {
        readAllCommunicationsFromList(true);
      }
    }
  }

  const sortDateReceived = () => {
    setIsDateReceived((prevState) => !prevState);
    dateReceivedOrder(!isDateReceived);
  }

	return (
		<div className="row sticky-top bg-white mb-3">
			<div className="col-12 bg-white">
				<div className="filter bg-white">
					<div className="arrow_div" onClick={sortDateReceived}>
						<span className="c1 i_position">Date Received 
              {!isDateReceived &&
                <i className="fa fa-angle-up arrow_postion" style={{ fontSize: "15px" }}></i>
              }
              {isDateReceived &&
                <i className="fa fa-angle-down arrow_postion" style={{ fontSize: "15px" }}></i>
              }
            </span>
					</div>
					<div className="form-check pr-2">
						<input type="checkbox" className="form-check-input" id="postCheckbox" onChange={markAllAsRead} />
						<label className="form-check-label" htmlFor="postCheckbox"> Mark all as read </label>
					</div>
				</div>
			</div>
		</div>
	);
}

export default SortList;