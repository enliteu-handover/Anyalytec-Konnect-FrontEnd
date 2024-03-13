import React, { useEffect, useState } from "react";

const SocialWallLeftContent = (props) => {
	
	const {rankingLists, usersPicProps} = props;

	const initUserLogeed = rankingLists ? rankingLists.userLogeed : {};
	const initSocialWallUserList = rankingLists ? rankingLists.users : {};
	const [userLogeedInfo , setuserLogeedInfo] = useState(initUserLogeed);
	const [SocialWallUserList , setSocialWallUserList] = useState(initSocialWallUserList);

	useEffect(() => {
		setuserLogeedInfo(rankingLists.userLogeed);
		setSocialWallUserList(rankingLists.users);
	}, [rankingLists]);

	let userPicIndex;
	const getUserPicture = (uID) => {
		userPicIndex = usersPicProps.findIndex(x => x.id === uID);
		return userPicIndex !== -1 ? usersPicProps[userPicIndex].pic : process.env.PUBLIC_URL + "/images/user_profile.png";
	}

	return (
		<React.Fragment>
			<div className="bg-f5f5f5 brtl-15 brtr-15 h-100">
				<div className="bg-f0efef brtl-15 brtr-15">
					<div className="d_user_basic_details p-3">
						<img src={getUserPicture(userLogeedInfo.user.id)} className="sr_u_pic" alt="Profile Image" title="Arvind - Engineer" />
						<div className="d_u_details">
							<label className="d_u_name font-helvetica-m my-0">{userLogeedInfo.user?.fullName}</label>
							<p className="d_u_dept">{userLogeedInfo.user?.department?.name}</p>
						</div>
					</div>
				</div>
				<div className="bg-f5f5f5 brtl-0 brtr-0 brbr-15 brbl-15 eep_scroll_y socialRankers_div">
					<div className="socialRankersInfo">
						<div className="sr_info">
							<label htmlFor="" className="sr_lbl font-helvetica-m">Current Ranking</label>
							<label htmlFor="" className="sr_val">{userLogeedInfo.ranking}</label>
						</div>
						<div className="sr_info">
							<label htmlFor="" className="sr_lbl font-helvetica-m">Available Points</label>
							<label htmlFor="" className="sr_points">{userLogeedInfo.totalPoint}</label>
						</div>
					</div>
					<div className="eep-dropdown-divider"></div>
					<div className="socialRankList">
						{SocialWallUserList && SocialWallUserList?.map((item,index) =>{
							return(
								<div className="sr_rank_list" key={`SocialWallUserList_`+index}>
									<div className="sr_rank_holder">
										{/* <img src={ userPicIndex !== -1 ? usersPicProps[userPicIndex].pic : `${process.env.PUBLIC_URL}/images/user_profile.png`} className="sr_rank_pic" alt="Profile Image" title="Arvind - Engineer" /> */}
										<img src={getUserPicture(item.user.id)} className="sr_rank_pic" alt="Profile Image" title={item?.user?.fullName} />
										
										<label htmlFor="" className="sr_rank_nm">{item?.user?.fullName}</label>
									</div>
									<div className="sr_rank_val">
										<label htmlFor="" className="sr_rank_nm">{item?.ranking}</label>
									</div>
								</div>
							)
						})}
					</div>
				</div>
			</div>
    </React.Fragment>
	)
}
export default SocialWallLeftContent;