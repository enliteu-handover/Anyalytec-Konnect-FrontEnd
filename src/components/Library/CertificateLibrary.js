import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { useDispatch } from "react-redux";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import CertificatePreviewModal from "../../modals/CertificatePreviewModal";
import AddCertificateToRecognitionModal from "../../modals/AddCertificateToRecognitionModal";

const Certificates = () => {

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Library",
      link: "app/library",
    },
    {
      label: "Certificates",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Library",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const [certificateData, setCertificateData] = useState([]);
  const [pdfDataUri, setPdfUri] = useState({});
  const [previewState, setPreviewState] = useState(false);
  const [addCertificateState, setAddCertificateState] = useState(false);
  const [certData, setCertData] = useState([]);

  useEffect(() => {
    fetchCertificateData();
  },[]);

  const fetchCertificateData = () => {
    const obj = {
        url: URL_CONFIG.ALL_CERTIFICATE,
        method: "get"
    };
    httpHandler(obj)
      .then((cData) => {
        const existingCertDataTemp = [];
        cData.data.map((item) => {
          return existingCertDataTemp.push(item.name);
        });
        fetchCertificateLibraryData(existingCertDataTemp);
      })
      .catch((error) => {
        console.log("fetchCertificateData error", error.response?.data?.message);
        //const errMsg = error.response?.data?.message;
      });
  }

  const fetchCertificateLibraryData = (arg) => {

    fetch(`${process.env.PUBLIC_URL}/data/certificateLibrary.json`)
      .then((response) => response.json())
      .then((data) => {
        let dataTemp = JSON.parse(JSON.stringify(data));
        dataTemp.map((item) => {
          const isExist = arg.filter((response) => response === item.certificateTitle);
          if(isExist.length) {
            item.isExist = true;
          } else {
            item.isExist = false;
          }
        });
        setCertificateData(dataTemp);
      });
  }

  const handleCertificatePreviewModal = (arg) => {
    if(arg) {
      setAddCertificateState(false);
      setPreviewState(true);
      let obj = {
        isIframe: true,
        dataSrc: arg.dataURI,
      };
      setPdfUri(obj);
    }
  }

  const handleCreateCertificate = (arg) => {
    //let certificatePath = `${process.env.PUBLIC_URL}/certificates/`;
    setPreviewState(false);
    setAddCertificateState(true);
    setCertData(arg);
  }

  return(
    <React.Fragment>
      
      {previewState && <CertificatePreviewModal previewDataUri={pdfDataUri} /> }
      {addCertificateState && <AddCertificateToRecognitionModal certData={certData} fetchCertificateData={fetchCertificateData} /> }

      <div className="eep-content-start">
        <div className="eep-content-section p-4 bg-ebeaea brtl-15 brtr-15 eep_scroll_y">
          <div className="row lib_row_div ">
            
            {certificateData.length > 0 && certificateData.map((item, index) => {
              return (
                <div className="col-md-4 col-lg-4 col-xs-12 col-sm-12 text-center cert_col_div" key={"certificateLibrary_"+index}>
                  <div className="mycert_list_div box9">
                    <div className="mycert_assign_div">
                      <div className="outter">
                        <img src={`${process.env.PUBLIC_URL}/images/certificates/${item?.libraryImage}`} className="mycert_img" alt="Performer" title="Performer" />
                      </div>
                    </div>
                    <div className="box-content">
                      <h3 className="title">{item?.certificateTitle}</h3>
                      {item.isExist && <p className="desc_p">Already added for recognition</p> }
                      {!item.isExist && <p className="desc_p">Add this certificate for recognition</p> }
                      {!item.isExist &&
                        <ul className="icon">
                          <li>
                            <Link 
                              to="#" 
                              className="p_cert_modal_a fas fa-plus" 
                              title="Preview this certificate"
                              data-toggle="modal"
                              data-target="#certRecognitionModal"
                              onClick={() => handleCreateCertificate(item)}
                            ></Link>
                          </li>
                        </ul>
                      }
                      <ul className="icon prev_icon">
                        <li>
                          <Link 
                            to="#" 
                            className="p_cert_modal_a fa fa-eye" 
                            title="Preview this certificate"
                            data-toggle="modal"
                            data-target="#certPreviewModal"
                            onClick={()=>handleCertificatePreviewModal(item)}
                          ></Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                )
              })}
            

          </div>
        </div>
      </div>
    </React.Fragment>
  )
};
export default Certificates;