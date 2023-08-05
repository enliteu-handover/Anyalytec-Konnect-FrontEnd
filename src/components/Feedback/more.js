import Slider from "react-slick";

const FeedbackDetailViewMore = ({ data, onClearMore }) => {

    var settings = {
        arrows: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        dots: false,
        centerMode: true,
    };

    return (
        <div
            id="collapseBirthday"
            className="modal fade"
            aria-modal="true"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="card-body">
                        <div className="row birthdy_div">
                            <div className="col-md-12">

                                <Slider {...settings}>
                                    {data?.map((item, index) => {
                                        return (
                                            <div
                                                className="parent_slider_img c1"
                                                key={"birthdayTemplate_" + index}
                                                data-toggle="modal"
                                                data-target="#ComposeCardModal"
                                                onClick={() => onClearMore()}
                                            >
                                                <img
                                                    src={item?.docByte?.image}
                                                    className="slider_image"
                                                    id={index}
                                                    alt="E-Card"
                                                    title={item?.name}
                                                    style={{ height: "400px" }}
                                                />
                                            </div>
                                        );
                                    })}
                                </Slider>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}
export default FeedbackDetailViewMore;
