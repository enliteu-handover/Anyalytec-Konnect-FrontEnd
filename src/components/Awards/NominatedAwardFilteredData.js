import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const  NominatedAwardFilteredData = (props) => {

	const {filterData, closeShowDetails} = props;
	const initialData = filterData ? filterData : [];
	const [clickeddAwardData, setclickeddAwardData] = useState(initialData);

	const closeShowAwardDetals = () => {
		closeShowDetails(false);
	}

	const getHashTag = (arg) => {
		const arr = [];
		arg?.map((res) => {
			arr.push(res.hashtagName);
		});
		return arr.join(", ");
	};

	useEffect(() => {
		setclickeddAwardData(clickeddAwardData);
	},[clickeddAwardData]);

	return(
		<div className="box-content br-15">
			<div className="c_nm_award_pts_div">
				{clickeddAwardData.award.points > 0  &&
					<label className="c_nm_award_pts font-helvetica-m">{clickeddAwardData.award.points > 1 ? (clickeddAwardData.award.points +" pts") : ""}</label>
				}
			</div>
			<div className="c_nm_award_div px-3">
				<img src={clickeddAwardData.imageByte.image} className="c_nm_award_img eep_r_icons_bg" alt="Award Icon" title={clickeddAwardData.imageByte.name} /> 
				<label className="c_nm_award_lbl font-helvetica-m">{clickeddAwardData.award.name}</label>
			</div>
			<div className="c_nm_award_cat_div px-x">
        <p className="c_nm_award_cat my-2 text-uppercase">{getHashTag(clickeddAwardData?.award?.hashTag)}</p>
				<p className="c_nm_award_dept mb-0">{clickeddAwardData.nominatorId.department.name}</p>
			</div>
			<ul className="icon" onClick={closeShowAwardDetals}>
				<li>
					<Link to="#" className="c_nm_back">
						<i className="fas fa-chevron-left"></i>
					</Link>
				</li>
			</ul>
		</div>
	)
}
export default NominatedAwardFilteredData; 