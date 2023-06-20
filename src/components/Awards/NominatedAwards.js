import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import NominatedAwardFilteredData from "./NominatedAwardFilteredData";

const NominatedAwards = (props) => {

	const {awardList, filterTable} = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
	const initData = awardList ? awardList : [];
	const [nominatedAwardData, setNominatedAwardData] = useState(initData);
	const [clickedAwardDetails, setClickedAwardDetails] = useState([]);
	const [showDetails, setShowDetails] = useState(false);

	useEffect(()=>{
		setNominatedAwardData(awardList);

		return() => {
			setNominatedAwardData([]);
		}

	},[awardList]);

	const filterByAwardHandler = (arg, fetchState) => {
		if(fetchState) {
			setClickedAwardDetails(arg);
			filterTable({isData:true,aValues:arg});
			setShowDetails(true);	
		}
		if(!fetchState) {
			filterTable({isData:false,aValues:[]});
			setShowDetails(false);
		}
	}

	const closeShowDetails = (arg) => {
		setShowDetails(arg);
	}

	return(
		<div className="bg-f1f1f1 mt-3 br-15 h-100 nm_rcol_inner sticky_position eep_scroll_y">
			<div className={`abox15 h-100 ${showDetails ? "clkd" : " "}`}>
				<div className="nm_rcol_inner_one p-4">
					<div className="nm_rcol_lbl_div text-center">
							<label className="nm_rcol_lbl font-helvetica-m">
								Nominated Awards 
								<Link
									to="#"
									className="ml-2 addon_clr"
									dangerouslySetInnerHTML={{
										__html: svgIcons && svgIcons.refresh_icon,
									}}
									onClick={() => filterByAwardHandler("", false)}
								></Link>
						</label>
					</div>			
					<div className="row">
						{nominatedAwardData && nominatedAwardData.map((item,index) => {
							return(
								<div className="col-md-4 col-lg-4 col-xl-4 col-sm-4 nm_award_div text-center" key={"NominatedAward_"+index} onClick={() => filterByAwardHandler(item, true)}>
									<img src={item?.imageByte?.image} className="nm_award_img eep_r_icons_bg"  alt="Award Icon" title={item?.imageByte?.name} /> 
									<label className="nm_award_lbl">{item.award.name}</label>
								</div>
							)
						})}
					</div>
				</div>
				{showDetails && nominatedAwardData &&
					<NominatedAwardFilteredData filterData={clickedAwardDetails} closeShowDetails={closeShowDetails} />
				}
			</div>
		</div>
	);
}

export default NominatedAwards; 