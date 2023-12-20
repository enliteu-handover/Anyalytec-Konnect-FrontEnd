import React from "react";

const RedomModalDetails = (props) => {
    
    const user_points = JSON.parse(props?.userDetails)?.allPoints ?? 0;
    const { name, description, images, price } = props?.data;
    return (
        <div className="eepModalDiv">
            <div className="modal fade" id="RedomModalDetails" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-confirm modal-addmessage" role="document">
                    <div className="modal-content">
                        <div className="modal-header flex-column p-0">
                            <button className="close closed" type="button" data-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body eep_scroll_y p-0">
                            <div className="modalBodyHeight">

                                <img width="80px" src={images
                                    ?.thumbnail ?? ''} />
                                <br />
                                <h5 className="modal-title w-100 text-center mt-3 bulk_exampleModalLabel"
                                >{name ?? ''}                                </h5>

                                <br />
                                <p>{description ?? ''}</p>
                                <br />
                                <label>Min : {price?.min} </label>,
                                <label>Max : {price?.max}</label>
                                <br />
                                <label>Qty : </label>
                                <input value={props?.qty ?? ''} onChange={(e) => props?.handleChange(e.target.value, price)} />
                                Min: 1, Max: {parseInt(price?.max) / user_points}
                                <a
                                    style={{
                                        marginBottom: 14,
                                        marginRight: 10,
                                        color: "#fff"
                                    }}
                                    className="eep-btn eep-btn-success eep-btn-xsml add_bulk_upload_button c1"
                                    data-toggle="modal"
                                    data-target="#RedomModal"
                                    onClick={() => props?.redeemPonts(props?.data)}
                                >Redeem Now</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
};
export default RedomModalDetails;