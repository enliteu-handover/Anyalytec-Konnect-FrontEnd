/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React from "react";

const RedomModalDetails = (props) => {

    const user_points = (((JSON.parse(props?.userDetails)?.allPoints ?? 0)) * parseInt(props?.value_peer_points)) ?? 0;
    const { name, description, images, price } = props?.data;
    return (
        <div className="eepModalDiv reedem" >
            <div className="modal fade" id="RedomModalDetails" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-confirm modal-addmessage" role="document">
                    <div className="modal-content">
                        <div className="modal-header flex-column p-0">
                            <button className="close closed" type="button" data-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body eep_scroll_y p-0">
                            <div className="modalBodyHeight">
                                <label className="redeemIcon_label font-helvetica-m details-titlesx">
                                    {name}
                                </label>
                                <div className="reedem-details-flex">
                                    <div>
                                        <img width="100%" src={images?.thumbnail ?? ''} className="details-img" />
                                    </div>
                                    <div className="details">

                                        <div style={{ marginTop: '6px' }}>
                                            <div style={{ fontSize: '14px', marginBottom: '6px', fontWeight: '500' }}>Enter Points:</div>
                                            <input placeholder="Points" type="text" className="form-control field-input-outline"
                                                // value={props?.qty ?? ''}
                                                defaultValue={10}

                                            //  onChange={(e) => props?.handleChange(e.target.value, price)} style={{}}
                                            />
                                            <div className="min-max"> Min: {price?.min}, Max: {price?.max}</div><br />
                                            <div style={{ fontSize: '14px', marginBottom: '6px', fontWeight: '500' }}>Quantity:</div>
                                            <input placeholder="Quantity" type="text" className="form-control field-input-outline"
                                                //  value={props?.qty ?? ''}
                                                defaultValue={1}
                                            // onChange={(e) => props?.handleChange(e.target.value, price)}
                                            />
                                            <div className="min-max"> Min: 1, Max: {Math.round(parseInt(price?.max) / user_points)}</div>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ fontSize: '14px', marginBottom: '10px', fontWeight: '500' }}>Description:</div>
                                <label className="redeemIcon_label discription">
                                    {description}
                                </label>

                                <a
                                    style={{ width: '100%', color: "#fff", textAlign: 'center' }}
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