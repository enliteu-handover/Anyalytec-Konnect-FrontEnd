import React from "react";

const NomineesInfo = (props) => {

  const {data} = props;

  return (
    <React.Fragment>
      <div className="tb_nominees_nm align-items-center text-left">
        <img src={data.userData?.userId?.pic} className="tb_nominees_dp eep_r_icons_bg" alt="Profile Pic" title={data.userData?.userId?.fullName} />
        <label>{data.userData?.userId?.fullName}</label>
      </div>
    </React.Fragment>
  );
};
export default NomineesInfo;