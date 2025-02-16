import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PageHeader from "../../UI/PageHeader";
import ResponseInfo from "../../UI/ResponseInfo";
import YearFilter from "../../UI/YearFilter";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import CertificatePreviewModal from "../../modals/CertificatePreviewModal";

const MyCertificate = () => {

  const yrDt = new Date().getFullYear();
  const [yearFilterValue, setYearFilterValue] = useState({ filterby: yrDt });
  const [myCertificateData, setMyCertificateData] = useState([]);
  const [myCertificateModalShow, setMyCertificateModalShow] = useState(false);
  const [previewDataUri, setPreviewDataUri] = useState(null);

  const fetchMyCertificateData = (paramData = {}) => {
    const obj = {
      url: URL_CONFIG.MY_CERTIFICATES,
      method: "get",
    };
    if (paramData && Object.keys(paramData).length > 0 && paramData !== "") {
      obj["params"] = paramData;
    }
    httpHandler(obj)
      .then((cData) => {
        setMyCertificateData(cData.data);
      })
      .catch((error) => {
        console.log("myCertificate error", error.response?.data?.message);
      });
  };

  useEffect(() => {
    fetchMyCertificateData(yearFilterValue);
  }, []);

  const onFilterChange = (filterValue) => {
    setYearFilterValue({ filterby: filterValue.value });
    fetchMyCertificateData({ filterby: filterValue.value });
  }

  const certPreviewModalHandler = (arg) => {
    setMyCertificateModalShow(true);
    let obj = {
      isIframe: false,
      dataSrc: arg,
    };
    setPreviewDataUri(obj);
  }

  return (
    <React.Fragment>
      <PageHeader title="My Certificates"
        filter={
          <YearFilter onFilterChange={onFilterChange} />
        }
      />
      {myCertificateModalShow && (<CertificatePreviewModal previewDataUri={previewDataUri} />)}
      <div className={`${myCertificateData.length <= 0 ? "h-100 " : "mt-4"} row eep-content-start eep-myCertificate-div`} id="content-start">
        {myCertificateData && myCertificateData.length > 0 && myCertificateData.map((data, index) => (
          <div className="col-md-4 col-lg-4 col-xs-12 col-sm-12 text-center cert_col_div" key={'myCertificate_' + index}>
            <div className="mycert_list_div mycert_modal_a box9">
              <div className="mycert_assign_div">
                <div className="outter">
                  <img src={`${process.env.PUBLIC_URL}/images/certificates/certificateThumbnail.svg`} className="mycert_img" alt="Certificate" title={data.imageByte?.name} />
                  {/* <img src={data.imageByte ? data.imageByte.image : `${process.env.PUBLIC_URL}/images/certificates/certificate-default.png`} className="mycert_img" alt="Certificate" title={data.imageByte?.name} /> */}
                  {/* <embed src={data.pdfByte ? data.pdfByte.image : `${process.env.PUBLIC_URL}/images/certificates/certificate-default.png`} type="application/pdf" className="mycert_img" alt="Certificate" title={data.imageByte?.name} width="100%" height="auto" style={{ overflow: "hidden !imporatnt", maxWidth: "100%" }} /> */}
                </div>
              </div>
              <div className="box-content">
                <h3 className="title">{data?.certificate ? data?.certificate?.name : ""}</h3>
                <ul className="icon">
                  <li>
                    <a className="mycert_modal_a fa fa-eye c1" onClick={() => certPreviewModalHandler(data)} data-toggle="modal" data-target="#certPreviewModal"></a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        ))}
        {myCertificateData && myCertificateData.length <= 0 && (
          <ResponseInfo title="No certificate found" responseImg="noRecord" responseClass="response-info" />
        )}
      </div>
    </React.Fragment>
  );
};
export default MyCertificate;