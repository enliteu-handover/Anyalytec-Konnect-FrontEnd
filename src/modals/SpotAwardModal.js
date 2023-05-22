import React, { useState } from "react";
import AssignAwardModalInfo from "../components/Awards/AssigAwardModalInfo";
import SpotAwardModalInput from "../components/Awards/SpotAwardModalInput";
import { httpHandler } from "../http/http-interceptor";
import { URL_CONFIG } from "../constants/rest-config";

const SpotAwardModal = (props) => {
  const { deptOptions, assignAwardData } = props;
  const [selectedDept, setSelectedDept] = useState([]);
  const [awardResponseMsg, setAwardResponseMsg] = useState("");
  const [awardResponseClassName, setAwardResponseClassName] = useState("");

  const getSelectedDeptment = (arg) => {
    const deptArr = [];
    arg.map(res => {
      return deptArr.push({ id: res.value });
    })
    setSelectedDept(deptArr);
  }

  const recognizeAwardOnClickHandler = () => {
    const regData = {
      award: {
        id: assignAwardData.data.id
      },
      departmentId: selectedDept
    }
    const obj = {
      url: URL_CONFIG.SPOT_AWARD,
      method: "post",
      payload: regData,
    };
    httpHandler(obj)
      .then((response) => {
        const resMsg = response?.data?.message;
        setAwardResponseMsg(resMsg);
        setAwardResponseClassName("response-succ");
      })
      .catch((error) => {
        console.log("errorrrr", error);
        const errMsg = error?.response?.data?.message;
        setAwardResponseMsg(errMsg);
        setAwardResponseClassName("response-err");
      });
  }

  return (
    <div className="eepModalDiv">
      <div className="modal fade" id="SpotAwardModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog w-75" role="document">
          <div className="modal-content">
            <div className="modal-header p-1 border-0 flex-column">
              <button className="close closed" type="button" data-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body eep_scroll_y">
              <div className="modalBodyHeight">
                <div className="row justify-content-md-center mb-4">
                  {assignAwardData && Object.keys(assignAwardData).length && <AssignAwardModalInfo awardInfo={assignAwardData} />}
                  <SpotAwardModalInput deptOptions={deptOptions} getSelectedDeptment={getSelectedDeptment} />
                </div>
                <div className="modal-footer border-0 flex-column">
                  <div className="row justify-content-md-center">
                    <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12 text-center">
                      {!awardResponseMsg && (
                        <button type="button" className="btn eep-btn eep-btn-success" disabled="" onClick={recognizeAwardOnClickHandler}> Done </button>
                      )}
                      {awardResponseMsg && (
                        <div className="response-div m-0">
                          <p className={`${awardResponseClassName} response-text`}>{awardResponseMsg}</p>
                        </div>
                      )}
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
export default SpotAwardModal;
