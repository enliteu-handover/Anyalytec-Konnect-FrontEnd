import React from "react";
import PDF from "react-pdf-js";

const CertificatePreviewModal = (props) => {
  const { previewDataUri } = props;

  return (
    <div className="eepModalDiv">
      <div className="modal fade show" id="certPreviewModal">
        <div className="modal-dialog w-75">
          <div className="modal-content p-4">
            <div className="modal-header p-0 border-bottom-0">
              <button type="button" className="close closed" data-dismiss="modal" title="Close"></button>
            </div>
            <div className="modal-body py-0 px-0 eep_scroll_y">
              <div className="row justify-content-md-center">
                {Object.keys(previewDataUri).length && (
                  <div className="col-md-12 col-lg-12 col-xs-12 col-sm-12">
                    <div className="thumbnailWrapper" style={{ margin: "0px; padding: 0px", height: "calc(100vh - 125px)", }}>
                      {previewDataUri.isIframe && (
                        <div className="iframeWrapper eep-content-section eep_scroll_y" style={{ margin: "0px", padding: "0px" }}>

                          <PDF
                            file={previewDataUri?.dataSrc} />
                          {/* <iframe src={previewDataUri.dataSrc + "#toolbar=0"} controlsList="nodownload" className="certPreviewModal"
                            title="Certificate" style={{ width: "100%", height: "100%" }} height="100%" width="100%"></iframe> */}
                        </div>
                      )}
                      {!previewDataUri.isIframe && previewDataUri.dataSrc.hasOwnProperty('pdfByte') && previewDataUri.dataSrc?.pdfByte !== null && (
                        <div className="iframeWrapper eep-content-section eep_scroll_y" style={{ margin: "0px", padding: "0px" }}>
                          <PDF
                            file={previewDataUri?.dataSrc?.pdfByte?.image} />
                          {/* <iframe src={previewDataUri.dataSrc.pdfByte.image
                          //  + "#toolbar=0"
                          } 
                          // controlsList="nodownload" 
                          sandbox="allow-scripts"
                          className="certPreviewModal"
                           title="Certificate" style={{ width: "100%", height: "100%" }} height="100%" width="100%"></iframe> */}
                        </div>
                      )}
                      {!previewDataUri?.isIframe && !previewDataUri?.dataSrc.hasOwnProperty('pdfByte') && (
                        <div className="iframeWrapper eep-content-section eep_scroll_y" style={{ margin: "0px", padding: "0px" }}>
                          <img src={previewDataUri?.dataSrc?.imageByte?.image} className="w-100" alt={previewDataUri?.dataSrc?.name} title={previewDataUri?.dataSrc?.name} />
                        </div>
                      )}
                      {!previewDataUri.isIframe && previewDataUri.dataSrc === null && (
                        <div className="alert alert-danger" role="alert"> Certificate not found. </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default CertificatePreviewModal;