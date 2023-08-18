import Slider from "react-slick";

const FeedbackDetailViewMore = ({ data, onClearMore }) => {

    var settings = {
        arrows: data?.length > 1 ? true : false,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        dots: false,
        centerMode: data?.length > 1 ? true : false,
    };

    return (
        <div
            id="collapseBirthday"
            className="modal fade"
            aria-modal="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="card-body-feedback">
                        {/* <div className="row birthdy_div">
                            <div className="col-md-12"> */}

                        <Slider {...settings}>
                            {data?.map((item, index) => {
                                return (
                                    <div
                                        className="parent_slider_img c1"
                                        key={"birthdayTemplate_" + index}
                                        onClick={() => onClearMore()}
                                    >
                                        <div
                                            style={{ width: "100%", height: "200px" }}
                                        >
                                            <img
                                                src={item?.docByte?.image}
                                                className="slider_image"
                                                id={index}
                                                alt="E-Card"
                                                title={item?.name}
                                                style={{
                                                    width: "100%", height: "100%",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </Slider>
                        {/* </div>
                        </div>*/}
                    </div>
                </div>
            </div>
        </div>)
}
export default FeedbackDetailViewMore;
