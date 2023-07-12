import React from "react";
import TableComponent from "../UI/tableComponent";

const CreateBulkUploadModal = (props) => {
    const { isUpload, userBulkDataTableHeaders, data, onSucess, downloadExcel } = props;
    return (
        <div className="eepModalDiv">
            <div className="modal fade" id="CreateBulkUploadModal" tabIndex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-confirm modal-addmessage" role="document" style={{ width: !isUpload ? "auto" : "460px" }}>
                    <div className="modal-content">
                        <div className="modal-header flex-column p-0">
                            <button className="close closed" type="button" data-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body eep_scroll_y p-0">
                            {isUpload && <div className="modalBodyHeight">
                                <h5 className="modal-title w-100 text-center mt-3 bulk_exampleModalLabel"
                                >
                                    {'User Bulk Upload'}
                                </h5>
                                <div className="eep-dropdown-divider"></div>
                                <div className="d-flex">
                                    <br /> <div className="align-items-start align-content-center bulk_user_upload">
                                        <div className="sample__header_xlsx">Sample File</div>
                                        <div className="sample_xlsx action-border">
                                            <div className="download_icon"><img src='/images/icons8-download.svg' /></div>
                                            <div className="sample_text">
                                                <img src={'/images/icons8-microsoft-excel.svg'} /> <br /><br />
                                                sample.xlsx</div>
                                        </div>
                                    </div>

                                    <div className="align-items-start align-content-center bulk_user_upload bulk_user_upload_xl">
                                        <div className="sample__header_xlsx">Upload</div>
                                        <div className="sample_xlsx action-border">
                                            <div className="sample_text">
                                                <input type="file"
                                                    onChange={(e) => onSucess(e)}
                                                    accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
                                                <img src={'/images/Group 106594.svg'} /> <br /><br />
                                                Drag and drop files here</div>
                                        </div>
                                    </div>
                                </div>
                                <br />  <div className="eep-dropdown-divider"></div>
                                <div className="modal-footer justify-content-center p-0">
                                    <button className="eep-btn eep-btn-cancel eep-btn-xsml" type="button" data-dismiss="modal">
                                        {'Cancel'}
                                    </button>
                                    <button type="submit" className="eep-btn eep-btn-success eep-btn-xsml add_newdepartment"
                                    >
                                        {'Upload'}
                                    </button>
                                </div>
                            </div>}
                            {!isUpload && <div className="modalBodyHeight">
                                {data?.length > 0 && <>
                                    <TableComponent
                                        data={data ?? []}
                                        actionHidden={true}
                                        searchHidden={true}
                                        columns={userBulkDataTableHeaders ?? []}
                                    /><br />
                                    <button onClick={() => downloadExcel(data)} className="eep-btn eep-btn-success"

                                    >
                                        {'Download Failure & Modify'}
                                    </button> </>}
                            </div>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default CreateBulkUploadModal;