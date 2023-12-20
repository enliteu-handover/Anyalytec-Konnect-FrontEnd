/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";

const RedomModalDetails = (props) => {

    const user_points = (((JSON.parse(props?.userDetails)?.allPoints ?? 0)) * parseInt(props?.value_peer_points)) ?? 0;
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

                              <img width="100%" src={images?.thumbnail ?? ''} style={{maxWidth: '466px',    height: '204px',marginBottom:'12px'}}/> 
                                  
                             
                                <label className="redeemIcon_label font-helvetica-m titlesx">
                          {name}
                        </label>
                        <label className="redeemIcon_label font-helvetica-m discription">
                          {description}
                        </label>
                                <br />
                                <label>Min : {price?.min} </label>,
                                <label>Max : {price?.max}</label>
                                <br />
                                <label>Qty : </label>
                                <input value={props?.qty ?? ''} onChange={(e) => props?.handleChange(e.target.value, price)} />
                                {/* Min: 1, Max: {parseInt(price?.max) / user_points} */}
                                Min: 1, Max: {Math.round(parseInt(price?.max) / user_points)}
                                <a
                                    style={{
                                        width:'100%',
                                        color: "#fff",
                                        textAlign:'center',
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