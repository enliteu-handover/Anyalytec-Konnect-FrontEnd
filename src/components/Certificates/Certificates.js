import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import PageHeader from "../../UI/PageHeader";
import { URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import CertificatePreviewModal from "../../modals/CertificatePreviewModal";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import { TabsActions } from "../../store/tabs-slice";
import MyCertificate from "./MyCertificate";
import { base64ToFile } from "../../helpers";

const Certificates = () => {
  const [certificateRecognitionData, setCertificateRecognitionData] = useState([]);
  const [currUserData, setCurrUserData] = useState({});
  const [userData, setUserData] = useState([]);
  const [eMailData, setEMailData] = useState([]);
  const userSessionData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [myCertificateModalShow, setMyCertificateModalShow] = useState(false);
  const [previewDataUri, setPreviewDataUri] = useState(null);

  const dispatch = useDispatch();
  const activeTab = useSelector((state) => state.tabs.activeTab);
  const location = useLocation();
  const history = useHistory();
  let routerData = location.state || { activeTab: "certificate" };

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "RECOGNITION",
      link: "app/recognition",
    },
    {
      label: "CERTIFICATE",
      link: "app/certificate",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Certificate",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  useEffect(() => {
    let tabConfig = [];
    if (userRolePermission.certificateSend) {
      tabConfig = [
        {
          title: "Certificates",
          id: "certificate",
        },
        {
          title: "My Certificates",
          id: "mycertificate",
        }
      ];
    }

    if (routerData?.activeTab) {
      const activeTabId = routerData.activeTab;
      tabConfig.map((res) => {
        if (res.id === activeTabId) {
          res.active = true
        }
      });

      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
      // history.replace({ pathname: history.location.pathname, state: {} });
    } else {
      dispatch(
        TabsActions.updateTabsconfig({
          config: tabConfig,
        })
      );
    }

    return () => {
      dispatch(
        TabsActions.updateTabsconfig({
          config: [],
        })
      );
    };
  }, [userRolePermission]);

  const fetchCertificateData = () => {
    const obj = {
      url: URL_CONFIG.ALL_CERTIFICATE,
      method: "get"
    };
    httpHandler(obj)
      .then((cData) => {
        setCertificateRecognitionData(cData.data);
      })
      .catch((error) => {
        console.log("fetchCertificateData error", error.response?.data?.message);
        //const errMsg = error.response?.data?.message;
      });
  }

  const fetchCurrentUserData = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: "get",
      params: { id: userSessionData.id },
    };
    httpHandler(obj)
      .then((uData) => {
        setCurrUserData(uData?.data?.[0]);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
        console.log("errMsg", errMsg);
      });
  };

  const fetchUserData = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: "get",
      params: {
        active: true
      }
    };
    httpHandler(obj)
      .then((userDatas) => {
        let uDataTemp = [];
        let uEmailDataTemp = [];
        userDatas.data.length > 0 && userDatas.data.map((item) => {
          if (item.id !== userSessionData.id) {
            return uDataTemp.push({ value: item.id, label: item.fullName + " - " + item.department.name });
          }
        });
        userDatas.data.length > 0 && userDatas.data.map((item) => {
          return uEmailDataTemp.push({ value: item.id, label: item.email });
        });
        setUserData(uDataTemp);
        setEMailData(uEmailDataTemp);
      })
      .catch((error) => {
        console.log("error", error);
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchCertificateData();
    fetchCurrentUserData();
    fetchUserData();
  }, []);

  const validImageTypes = ["image/jpeg", "image/jpg", "image/png", "image/svg+xml"];
  const addCertificateHandler = (event) => {

    var file = event.target.files[0];
    var fileType = file["type"];
    if (validImageTypes.includes(fileType)) {
      var tempFileName = file.name;
      tempFileName = tempFileName.replace(/\s/g, "");
      tempFileName = tempFileName.split('.').slice(0, -1).join('.');
      var reader = new FileReader();
      reader.onload = function () {
        //setRecognitionIcon(reader.result);
        let obj = { imageByte: { image: reader.result, name: tempFileName }, name: tempFileName };


        const base64Data = (obj?.imageByte?.image).replace(/^data:image\/\w+;base64,/, '');
        const file = base64ToFile(base64Data);

        const formData = new FormData();
        formData.append("image", file);
        const obj_ = {
          url: URL_CONFIG.UPLOAD_FILES,
          method: "post",
          payload: formData,
        };
        httpHandler(obj_)
          .then((res) => {
            obj.imageByte.image = res?.data?.data?.[0]?.url ?? ""
            history.push('composecertificate',
              { isCustomCertificate: true, certData: obj, currUserData: currUserData, userData: userData, eMailData: eMailData });
          })
      };
      reader.readAsDataURL(file);
    } else {
      //setFileClassName("mt-2 eep-text-warn");
      //setFileMessage("Invalid file! Please choose JPEG, JPG, PNG or SVG");
    }
  };

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
      {myCertificateModalShow && (<CertificatePreviewModal previewDataUri={previewDataUri} />)}
      <div className="row eep-content-section-data no-gutters">
        <div className="tab-content col-md-12 h-100">
          <div id="mycertificate" className="tab-pane h-100 active">
            {activeTab?.id === 'mycertificate' && <MyCertificate />}
          </div>
          <div id="certificate" className="tab-pane h-100">
            {activeTab && activeTab.id === 'certificate' &&
              <React.Fragment>
                <PageHeader title="Certificates"></PageHeader>
                <div className="row certificate_row_div mt-4 " id="content-start">
                  <div className="col-md-4 col-lg-4 col-xs-12 col-sm-12 n_cert_add_col_div cert_col_div">
                    <div className="n_cert_add_col_inner n_cert_add_col_inner_a" title="Add Certificate">
                      <div className="n_cert_add_col">
                        <div className="outter">
                          <img src={process.env.PUBLIC_URL + "/images/icons/plus-white.svg"} className="plus_white_img" alt="Plus White" title="Compose Certificate" onClick={() => { document.getElementById("certificatePath").click(); }} />
                          <input type="file" className="invisible d-none" onChange={(event) => addCertificateHandler(event)} id="certificatePath" />
                        </div>
                      </div>
                      <label className="n_cert_add_label">compose Certificate</label>
                    </div>
                  </div>
                  {certificateRecognitionData && certificateRecognitionData.map((data, index) => {
                    return (
                      <div className="col-md-4 col-lg-4 col-xs-12 col-sm-12 text-center cert_col_div" key={"certificateRecognition_" + index}>
                        <div className="mycert_list_div mycert_modal_a box9">
                          <div className="mycert_assign_div">
                            <div className="outter">
                              <img src={`${process.env.PUBLIC_URL}/images/certificates/certificateThumbnail.svg`} className="mycert_img" alt="Certificate" title={data.pdfByte?.name} />
                            </div>
                          </div>
                          <div className="box-content">
                            <h3 className="title">{data?.name}</h3>
                            <ul className="icon">
                              <li>
                                <Link to="#" className="mycert_modal_a fa fa-eye" onClick={() => certPreviewModalHandler(data)} data-toggle="modal" data-target="#certPreviewModal"></Link>
                              </li>
                              <li>
                                <Link to={{ pathname: "composecertificate", state: { isCustomCertificate: false, certData: data, currUserData: currUserData, userData: userData, eMailData: eMailData, }, }} className="mycert_modal_a fa fa-eyee">
                                  <span dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.pencil, }}></span>
                                </Link>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </React.Fragment>
            }
          </div>
        </div>
      </div>

    </React.Fragment>
  );
};

export default Certificates;