import React from "react";
//import React, { useEffect, useState } from "react";
//import Slider from "react-slick";

const SocialWallRightContent = (props) => {

	const { hastagList } = props;
	let hastagMaxVal = hastagList?.length ? hastagList[0]?.totalTagCount : 0;
	let defaultColorCode = "#4e73df";
	let indeMax = 10;
	let hasMaxCount = 10;

	/*
	const [eventSlider, setEventSlider] = useState({});

  const fetchEventSlider = () => {
	fetch(`${process.env.PUBLIC_URL}/data/ecards.json`)
	.then((response)=> response.json())
	.then((data) => {
	  let tempData = data[0].birtdaycards;
	  setEventSlider(tempData);      
	})
  }

	useEffect(() => {
	fetchEventSlider();
	},[]);

  var settings = {
	dots: false,
	autoplay:true,
	autoplaySpeed:2000,
	arrows: true,
	infinite: true,
	speed: 500,
	slidesToShow: 1,
	adaptiveHeight: true,
	slidesToScroll: 1,
	padSlides: false,
	responsive: [
	  {
		breakpoint: 1024,
		settings: {
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  infinite: true,
		  dots: false,
		},
	  },
	  {
		breakpoint: 600,
		settings: {
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  initialSlide: 2,
		},
	  },
	  {
		breakpoint: 480,
		settings: {
		  slidesToShow: 1,
		  slidesToScroll: 1,
		},
	  },
	],
  };
	*/

	return (
		<React.Fragment>
			<div className="bg-f7f7f7 br-15 socialTrendingTags">
				<div className="tt_head text-center">
					<label htmlFor="" className="text-center mb-0 tt_lbl">Top Trending Tags</label>
				</div>
				<div className="socialTagsLists">
					{hastagList?.map((item, index) => {
						let hastagItemVal = item.totalTagCount;
						let percent = (hastagItemVal / hastagMaxVal) * 100;
						let ColorCode = (item.hashTag.colorCode !== '' && item.hashTag.colorCode !== null) ? item.hashTag.colorCode : defaultColorCode;
						if (index <= indeMax && item.totalTagCount >= hasMaxCount) {
							return (
								<div className="tt_lists" key={"hastag_" + index}>
									<p className="tt_nm">#{item.hashTag.hashtagName}</p>
									<div className="tt_info">
										<div className="tt_progress progress rounded-pill">
											<div role="progressbar" aria-valuenow="74" aria-valuemin="0" aria-valuemax="100" className="progress-bar rounded-pill progress-bar-striped progress-bar-animated" style={{ backgroundColor: ColorCode, width: percent + "%" }}></div>
										</div>
										<div className="tt_val">{item.totalTagCount}</div>
									</div>
								</div>
							)
						}
					})}
				</div>
			</div>

			{/*
			<div className="bg-f7f7f7 br-15 socialEventSlider">
				<div className="tt_head text-center">
					<label htmlFor="" className="text-center mb-0 tt_lbl">Events</label>
				</div>
				{eventSlider && eventSlider.length > 0 && (
					<Slider {...settings}>
						{eventSlider.map((item, index) => {
							return (
								<div className="parent_slider_img c1" key={"birthdayTemplate_" + index}>
									<img src={`${process.env.PUBLIC_URL}/images/temp/${item.image}`} className="slider_image" id={index} alt="E-Card" title={item.name}/>
								</div>
							);
						})}
					</Slider>
				)}				
			</div> 
		*/}

		</React.Fragment>
	)
}
export default SocialWallRightContent;