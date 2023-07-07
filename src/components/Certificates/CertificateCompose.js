import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import PageHeader from "../../UI/PageHeader";
import { Link, useLocation } from "react-router-dom";
import ReactTooltip from "react-tooltip";
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import CertificatePreviewModal from "../../modals/CertificatePreviewModal";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import Select from "react-select";
import EEPSubmitModal from "../../modals/EEPSubmitModal";

const CertificateCompose = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const dispatch = useDispatch();
  const [previewDataUri, setPreviewDataUri] = useState({});
  const [userData, setUserData] = useState([]);
  const [eMailData, setEMailData] = useState([]);
  const [toValue, setToValue] = useState([]);
  const [ccValue, setCCValue] = useState([]);
  const [openMenu, setOpenMenu] = useState(false);
  const [openCCMenu, setOpenCCMenu] = useState(false);
  const [cDataValue, setCDataValue] = useState({});
  const [isCustomCertificateValue, setIsCustomCertificateValue] = useState(true);
  const [isSendDisabled, setIsSendDisabled] = useState(true);
  const [currUserInfo, setCurrUserInfo] = useState({});
  const msgMaxLength = 160;
  const signMaxHeight = 60;
  const getLocation = useLocation();
  const cDataValues = getLocation.state ? getLocation.state?.certData : "";
  const isCustomCertificateValues = getLocation.state ? getLocation.state?.isCustomCertificate : true;
  const currUserInfos = getLocation.state ? getLocation.state?.currUserData : "";
  const userDatas = getLocation.state ? getLocation.state?.userData : "";
  const eMailDatas = getLocation.state ? getLocation.state?.eMailData : "";
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  useEffect(() => {
    setCDataValue(cDataValues);
    setCurrUserInfo(currUserInfos);
    setUserData(userDatas);
    setEMailData(eMailDatas);
    setIsCustomCertificateValue(isCustomCertificateValues);
  }, [cDataValues, currUserInfos, userDatas, eMailDatas, isCustomCertificateValues]);

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

  const [toName, setToName] = useState("");
  const [certificateName, setCertificateName] = useState("");
  const [message, setMessage] = useState("");
  const [certificatePreviewModalShow, setCertificatePreviewModalShow] = useState(false);

  const previewHandler = () => {
    debugger
    setCertificatePreviewModalShow(true);
    const obj = {
      tnm: toName,
      cnm: certificateName.toUpperCase(),
      cmsg: message,
      cbtn: 'preview'
    }

    if (!isCustomCertificateValue) {
      modifyPdf(obj)
    }
    if (isCustomCertificateValue) {
      let obj = {
        isIframe: false,
        dataSrc: cDataValue,
      };
      setPreviewDataUri(obj);
    }
  }

  const sendCertHandler = () => {
    
    setCertificatePreviewModalShow(false);
    const obj = {
      tnm: toName,
      cnm: certificateName.toUpperCase(),
      cmsg: message,
      cbtn: 'send'
    }
    if (!getLocation.state?.isCustomCertificate) {
      modifyPdf(obj)
    }
    if (getLocation.state?.isCustomCertificate) {
      handleSendCertificate({ isTemplateCertificate: false, cData: cDataValue, pdfDataUrlVal: null });
    }
  }

  async function modifyPdf(obj) {
    
    const defaultParameters = JSON.parse('[{"toField":[{"fontsize":33},{"fontname":"HelveticaNue"},{"textalign":"center"},{"maxwidth":"fullwidth"},{"coordinates":["center",348]},{"rgbcolor":[111,113,121]}]},{"certNameField":[{"fontsize":24},{"fontname":"HelveticaNue"},{"textalign":"center"},{"maxwidth":"fullwidth"},{"coordinates":["center",454]},{"rgbcolor":[111,113,121]}]},{"certMsgField":[{"fontsize":20},{"fontname":"HelveticaNue"},{"textalign":"center"},{"maxwidth":562},{"coordinates":[153,285]},{"rgbcolor":[111,113,121]}]},{"certdateField":[{"fontsize":18},{"fontname":"HelveticaNue"},{"textalign":"center"},{"maxwidth":189},{"coordinates":[126,113]},{"rgbcolor":[111,113,121]}]},{"certsignField":[{"fontsize":18},{"fontname":"HelveticaNue"},{"textalign":"center"},{"maxwidth":189},{"coordinates":[556,85]},{"rgbcolor":[111,113,121]}]},{"certsignimgField":[{"imgalign":"center"},{"maxwidth":189},{"coordinates":[556,107]},{"imgsize":[138,36]}]},{"certSource":"certificate-3.pdf"}]');
    const parseJsonValue = Object.keys(cDataValue).length ? JSON.parse(cDataValue.parameters) : defaultParameters;

    const { tnm, cnm, cmsg, cbtn } = obj;
    const certURL = cDataValue?.pdfByte?.image || cDataValue?.imageByte?.image;
    const existingPdfBytes = await fetch(certURL).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    pdfDoc.registerFontkit(fontkit);
    const HelveticaNeueFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const textSize = parseJsonValue[0]["toField"][0]["fontsize"];
    const textWidth = HelveticaNeueFont.widthOfTextAtSize(tnm, textSize);
    let tnm_coordination = [0, 0];
    const rgbcolor = [(parseJsonValue[0]["toField"][5]["rgbcolor"][0] / 255), (parseJsonValue[0]["toField"][5]["rgbcolor"][1] / 255), (parseJsonValue[0]["toField"][5]["rgbcolor"][2] / 255)];
    if (parseJsonValue[0]["toField"][3]["maxwidth"] === 'fullwidth') {
      if (parseJsonValue[0]["toField"][2]["textalign"] === 'center') {
        tnm_coordination = [(firstPage.getWidth() / 2 - textWidth / 2), (parseJsonValue[0]["toField"][4]["coordinates"][1])];
      } else {
        tnm_coordination = [(firstPage.getWidth() / 2 - textWidth / 2), (parseJsonValue[0]["toField"][4]["coordinates"][1])];
      }
    } else {
      tnm_coordination = [(parseJsonValue[0]["toField"][4]["coordinates"][0]), (parseJsonValue[0]["toField"][4]["coordinates"][1])];
    }
    firstPage.drawText(tnm, {
      x: tnm_coordination[0],
      y: tnm_coordination[1],
      size: textSize,
      font: HelveticaNeueFont,
      color: rgb(rgbcolor[0], rgbcolor[1], rgbcolor[2]),
    });
    /* Name Field End */

    /* CertificateName Field Start */
    const cnm_textSize = parseJsonValue[1]["certNameField"][0]["fontsize"];
    const cnm_textWidth = HelveticaNeueFont.widthOfTextAtSize(cnm, cnm_textSize);
    let cnm_coordination = [0, 0];
    const cnm_rgbcolor = [(parseJsonValue[1]["certNameField"][5]["rgbcolor"][0] / 255), (parseJsonValue[1]["certNameField"][5]["rgbcolor"][1] / 255), (parseJsonValue[1]["certNameField"][5]["rgbcolor"][2] / 255)];
    if (parseJsonValue[1]["certNameField"][3]["maxwidth"] === 'fullwidth') {
      if (parseJsonValue[1]["certNameField"][2]["textalign"] === 'center') {
        cnm_coordination = [(firstPage.getWidth() / 2 - cnm_textWidth / 2), (parseJsonValue[1]["certNameField"][4]["coordinates"][1])];
      } else {
        //akak notchecked
        cnm_coordination = [(firstPage.getWidth() / 2 - cnm_textWidth / 2), (parseJsonValue[1]["certNameField"][4]["coordinates"][1])];
      }
    } else {
      //akak notchecked
      cnm_coordination = [(parseJsonValue[1]["certNameField"][4]["coordinates"][0]), (parseJsonValue[1]["certNameField"][4]["coordinates"][1])];
    }

    firstPage.drawText(cnm, {
      x: cnm_coordination[0],
      y: cnm_coordination[1],
      size: cnm_textSize,
      font: HelveticaNeueFont,
      //color: rgb(0.2, 0.84, 0.67),
      color: rgb(cnm_rgbcolor[0], cnm_rgbcolor[1], cnm_rgbcolor[2]),
    });
    /* CertificateName Field End */

    /* Message Field Start */
    function fillParagraph(f_text, f_font, f_fontSize, f_maxWidth) {
      var paragraphs = f_text.split('\n');
      for (let index = 0; index < paragraphs.length; index++) {
        var paragraph = paragraphs[index];
        if (f_font.widthOfTextAtSize(paragraph, f_fontSize) > f_maxWidth) {
          var words = paragraph.split(' ');
          var newParagraph = [];
          var i = 0;
          newParagraph[i] = [];
          for (let k = 0; k < words.length; k++) {
            var word = words[k];
            newParagraph[i].push(word);
            if (f_font.widthOfTextAtSize(newParagraph[i].join(' '), f_fontSize) > f_maxWidth) {
              newParagraph[i].splice(-1); // retira a ultima palavra
              i = i + 1;
              newParagraph[i] = [];
              newParagraph[i].push(word);
            }
          }
          paragraphs[index] = newParagraph.map(p => p.join(' ')).join('\n');
        }
      }
      return paragraphs.join('\n');
    }

    const msg_textSize = parseJsonValue[2]["certMsgField"][0]["fontsize"];
    const msg_maxwidth = parseJsonValue[2]["certMsgField"][3]["maxwidth"];
    let cmsg_coordination = [0, 0];
    const msg_rgbcolor = [(parseJsonValue[2]["certMsgField"][5]["rgbcolor"][0] / 255), (parseJsonValue[2]["certMsgField"][5]["rgbcolor"][0] / 255), (parseJsonValue[2]["certMsgField"][5]["rgbcolor"][0] / 255)];
    const msg_fillparagraph = fillParagraph(cmsg, HelveticaNeueFont, msg_textSize, msg_maxwidth);
    if (parseJsonValue[2]["certMsgField"][3]["maxwidth"] === 'fullwidth') {
      //akak notchecked
      if (parseJsonValue[2]["certMsgField"][2]["textalign"] === 'center') {
        //cmsg_coordination = [ (firstPage.getWidth() / 2 - cnm_textWidth / 2), (parseJsonValue[2]["certMsgField"][4]["coordinates"][1])];
      } else {
        //cmsg_coordination = [ (firstPage.getWidth() / 2 - cnm_textWidth / 2), (parseJsonValue[2]["certMsgField"][4]["coordinates"][1])];
      }
    } else {
      cmsg_coordination = [(parseJsonValue[2]["certMsgField"][4]["coordinates"][0]), (parseJsonValue[2]["certMsgField"][4]["coordinates"][1])];
    }
    firstPage.drawText(msg_fillparagraph, {
      x: cmsg_coordination[0],
      y: cmsg_coordination[1],
      size: msg_textSize,
      font: HelveticaNeueFont,
      color: rgb(msg_rgbcolor[0], msg_rgbcolor[1], msg_rgbcolor[2]),
    });
    /* Message Field End */

    /* Date Field Start */
    const dt_textSize = parseJsonValue[3]["certdateField"][0]["fontsize"];
    let c_today = new Date();
    // const dt_date = c_today.toShortFormat();
    const dt_date = c_today.toLocaleDateString();
    let dt_coordination = [0, 0];
    let dt_width_x = 0;
    const dt_rgbcolor = [(parseJsonValue[3]["certdateField"][5]["rgbcolor"][0] / 255), (parseJsonValue[3]["certdateField"][5]["rgbcolor"][1] / 255), (parseJsonValue[3]["certdateField"][5]["rgbcolor"][2] / 255)];
    const dt_textWidth = HelveticaNeueFont.widthOfTextAtSize(dt_date, dt_textSize);
    if (parseJsonValue[3]["certdateField"][3]["maxwidth"] === 'fullwidth') {
      if (parseJsonValue[3]["certdateField"][2]["textalign"] === 'center') {
        //akak notchecked
        //dt_coordination = [ (firstPage.getWidth() / 2 - cnm_textWidth / 2), (parseJsonValue[3]["certdateField"][4]["coordinates"][1])];
      }
      if (parseJsonValue[3]["certdateField"][2]["textalign"] === 'left') {
        dt_coordination = [(parseJsonValue[3]["certdateField"][4]["coordinates"][0]), (parseJsonValue[3]["certdateField"][4]["coordinates"][1])];
      }
      if (parseJsonValue[3]["certdateField"][2]["textalign"] === 'right') {
        //akak notchecked
        //dt_coordination = [ (parseJsonValue[3]["certdateField"][4]["coordinates"][0]), (parseJsonValue[3]["certdateField"][4]["coordinates"][1])];
      }
    } else {
      if (parseJsonValue[3]["certdateField"][2]["textalign"] === 'center') {
        dt_width_x = (parseJsonValue[3]["certdateField"][3]["maxwidth"] / 2 - dt_textWidth / 2);
        dt_coordination = [(parseJsonValue[3]["certdateField"][4]["coordinates"][0] + dt_width_x), (parseJsonValue[3]["certdateField"][4]["coordinates"][1])];
      } else {
        //akak notchecked
        dt_coordination = [(parseJsonValue[3]["certdateField"][4]["coordinates"][0]), (parseJsonValue[3]["certdateField"][4]["coordinates"][1])];
      }
    }
    firstPage.drawText(dt_date, {
      x: dt_coordination[0],
      y: dt_coordination[1],
      size: dt_textSize,
      font: HelveticaNeueFont,
      color: rgb(dt_rgbcolor[0], dt_rgbcolor[1], dt_rgbcolor[2]),
    });
    /* Date Field End */

    /* Signature Field Start */
    // var signURL = currUserInfo.signatureByte !== null ? (currUserInfo.signatureByte.image ? currUserInfo.signatureByte?.image : "") : "";
    var signURL = currUserInfo.signatureByte !== null ?
      (currUserInfo.signatureByte.image ? currUserInfo.signatureByte?.image : "") : "";
    
    if (signURL) {
      let sg_img_coordination_x = parseJsonValue[5]["certsignimgField"][2]["coordinates"][0];
      let sg_img_coordination_y = parseJsonValue[5]["certsignimgField"][2]["coordinates"][1];
      let sg_img_maxwidth = parseJsonValue[5]["certsignimgField"][1]["maxwidth"];
      var signImageBytes = '';
      var signImage = '';
      //var signDims = '';
      let signImage_w = 0;
      // const signExtension = currUserInfo.signatureByte.image.substring("data:image/".length, currUserInfo.signatureByte.image.indexOf(";base64"));
      const signExtension = signURL.split(".")[signURL.split(".").length - 1]
      if (signExtension === 'jpg' || signExtension === 'jpeg') {
        //signURL = `${process.env.PUBLIC_URL}/images/certificates/signatures/signature_jpeg.jpg`;
        signImageBytes = await fetch(signURL).then((res) => res.arrayBuffer());
        signImage = await pdfDoc.embedJpg(signImageBytes);
        if (signImage.width > sg_img_maxwidth) {
          // console.log("Ifff");
          let signImage_scale = sg_img_maxwidth / signImage.width;
          signImage_w = signImage.scale(signImage_scale);
        } else {
          // console.log("Else");
          signImage_w = signImage.width;
          sg_img_coordination_x += sg_img_maxwidth / 2 - signImage_w / 2;
        }
      }
      if (signExtension === 'png') {
        //signURL = `${process.env.PUBLIC_URL}/images/certificates/signatures/signature1_png.png`;
        signImageBytes = await fetch(signURL).then((res) => res.arrayBuffer());
        signImage = await pdfDoc.embedPng(signImageBytes);
        if (signImage.width > sg_img_maxwidth) {
          let signImage_scale = sg_img_maxwidth / signImage.width;
          signImage_w = signImage.scale(signImage_scale);
        } else {
          signImage_w = signImage.width;
        }
      }
      if (signExtension === 'pdf') {
        //signURL = `${process.env.PUBLIC_URL}/images/certificates/signatures/signature1_png.png`;
        signImageBytes = await fetch(signURL).then((res) => res.arrayBuffer());
        signImage = await pdfDoc.embedPdf(signImageBytes);
        if (signImage.width > sg_img_maxwidth) {
          let signImage_scale = sg_img_maxwidth / signImage.width;
          signImage_w = signImage.scale(signImage_scale);
        } else {
          signImage_w = signImage.width;
        }
      }
      firstPage.drawImage(signImage, {
        x: sg_img_coordination_x,
        y: sg_img_coordination_y,
        width: signImage_w.width,
        height: (signImage_w.height > signMaxHeight) ? signMaxHeight : signImage_w.height,
      });
    }

    const sg_textSize = parseJsonValue[4]["certsignField"][0]["fontsize"];
    const sg_name = currUserInfo?.fullName;
    let sg_width_x = 0;
    let sg_coordination = [0, 0];
    const sg_rgbcolor = [(parseJsonValue[4]["certsignField"][5]["rgbcolor"][0] / 255), (parseJsonValue[4]["certsignField"][5]["rgbcolor"][1] / 255), (parseJsonValue[4]["certsignField"][5]["rgbcolor"][2] / 255)];
    const sg_textWidth = HelveticaNeueFont.widthOfTextAtSize(sg_name, sg_textSize);
    if (parseJsonValue[4]["certsignField"][3]["maxwidth"] === 'fullwidth') {
      //akak notchecked
      if (parseJsonValue[4]["certsignField"][2]["textalign"] === 'center') {
        //sg_coordination = [ (firstPage.getWidth() / 2 - sg_textWidth / 2), (parseJsonValue[4]["certsignField"][4]["coordinates"][1])];
      }
      if (parseJsonValue[4]["certsignField"][2]["textalign"] === 'left') {
        //sg_coordination = [ (parseJsonValue[4]["certsignField"][4]["coordinates"][0]), (parseJsonValue[3]["certdateField"][4]["coordinates"][1])];
      }
      if (parseJsonValue[4]["certsignField"][2]["textalign"] === 'right') {
        //sg_coordination = [ (parseJsonValue[4]["certsignField"][4]["coordinates"][0]), (parseJsonValue[3]["certdateField"][4]["coordinates"][1])];
      }
    } else {
      if (parseJsonValue[4]["certsignField"][2]["textalign"] === 'center') {
        sg_width_x = (parseJsonValue[4]["certsignField"][3]["maxwidth"] / 2 - sg_textWidth / 2);
        sg_coordination = [(parseJsonValue[4]["certsignField"][4]["coordinates"][0] + sg_width_x), (parseJsonValue[4]["certsignField"][4]["coordinates"][1])];
      } else {
        //akak notchecked
        sg_coordination = [(parseJsonValue[4]["certsignField"][4]["coordinates"][0]), (parseJsonValue[4]["certsignField"][4]["coordinates"][1])];
      }
    }

    firstPage.drawText(sg_name, {
      x: sg_coordination[0],
      y: sg_coordination[1],
      size: sg_textSize,
      font: HelveticaNeueFont,
      color: rgb(sg_rgbcolor[0], sg_rgbcolor[1], sg_rgbcolor[2]),
    });
    /* Signature Field End */

    const pdfDataUrl = await pdfDoc.saveAsBase64({ dataUri: true });

    if (cbtn === 'preview') {
      let obj = {
        isIframe: true,
        dataSrc: pdfDataUrl,
      };
      setPreviewDataUri(obj);
    }

    if (cbtn === 'send') {
      let obj = {
        isIframe: true,
        dataSrc: pdfDataUrl,
      };
      setPreviewDataUri(obj);
      handleSendCertificate({ isTemplateCertificate: true, cData: cDataValue, pdfDataUrlVal: pdfDataUrl });
    }
  }

  const handleSendCertificate = async (cValue) => {
    
    if (!isSendDisabled) {

      let imgUrl = ''
      if (cValue?.isTemplateCertificate) {
        const base64Data = (cValue.pdfDataUrlVal).replace(/^data:application\/\w+;base64,/, '');

        const binaryString = atob(base64Data);
        const byteNumbers = new Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          byteNumbers[i] = binaryString.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'application/pdf' });
        const file = new File([blob], 'filename.pdf', { type: 'application/pdf' });

        const formData = new FormData();
        formData.append("image", file);
        const obj = {
          url: URL_CONFIG.UPLOAD_FILES,
          method: "post",
          payload: formData,
        };
        await httpHandler(obj)
          .then((res) => {
            imgUrl = res?.data?.data?.[0]?.url ?? ""
          })
      }

      let ccValueArr = [];
      ccValue.length > 0 && ccValue.map((res) => {
        return ccValueArr.push(res.value);
      });
      let payOptions = {
        certificateTo: toValue?.value,
        ccMail: ccValueArr,
        certificateMessage: message,
        certificateName: certificateName.toUpperCase(),
        certificate: cValue.isTemplateCertificate ? { id: cDataValue.id } : null,
        sendmail: true,
        certificateByte:
          cValue?.isTemplateCertificate ? imgUrl : cValue?.cData?.imageByte?.image ?? ""
        //  cValue.isTemplateCertificate ?
        //  { image: cValue.pdfDataUrlVal, name: cValue.cData.name } : 
        //  { image: cValue.cData.imageByte.image, name: cValue.cData.name }
      }
      const payloadObj = {
        url: URL_CONFIG.ASSIGN_CERTIFICATE,
        method: "post",
        payload: payOptions,
      };
      httpHandler(payloadObj)
        .then((response) => {
          setToValue([]);
          setToName("");
          setCCValue([]);
          setMessage("");
          setCertificateName("");
          setShowModal({
            ...showModal,
            type: "success",
            message: response?.data?.message,
          });
        })
        .catch((error) => {
          console.log("error", error);
          setShowModal({
            ...showModal,
            type: "danger",
            message: error?.response?.data?.message,
          });
        });
    }
  }

  const handleInputChange = (evt) => {
    setToValue(evt);
    setOpenMenu(false);
    setToName(evt.label);
    isValidSend();
  }

  const handleRecipientChange = (evt) => {
    setCCValue(evt);
    setOpenCCMenu(false);
  }

  const handleCertificateName = (evt) => {
    setCertificateName(evt.target.value.toUpperCase());
    isValidSend();
  }

  const handleCertificateMessage = (evt) => {
    setMessage(evt.target.value);
    isValidSend();
  }

  const menuHideShow = (arg) => {
    setOpenMenu(arg);
  }

  const ccMenuHideShow = (arg) => {
    setOpenCCMenu(arg);
  }

  const isValidSend = () => {
    if (toValue !== "undefined" && toValue !== "" && certificateName !== "" && message !== "") {
      setIsSendDisabled(false);
    } else {
      setIsSendDisabled(true);
    }
  }

  return (
    <React.Fragment>
      <ReactTooltip effect="solid" />
      <PageHeader title="Compose Certificate"
        navLinksLeft={
          <Link className="text-right c-c1c1c1 mr-2 my-auto eep_nav_icon_div eep_action_svg" to="/app/certificates"
            dangerouslySetInnerHTML={{
              __html: svgIcons && svgIcons.lessthan_circle,
            }}
          ></Link>
        }
      />
      {certificatePreviewModalShow && <CertificatePreviewModal previewDataUri={previewDataUri} />}

      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-success"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Ok
            </button>
          }
          errorFooterData={
            <button
              type="button"
              className="eep-btn eep-btn-xsml eep-btn-danger"
              data-dismiss="modal"
              onClick={hideModal}
            >
              Close
            </button>
          }
        ></EEPSubmitModal>
      )}

      <div className="row compose_cert_row_div mt-4 eep_scroll_y">
        <div className="col-md-5 col-lg-5 col-xs-12 col-sm-12 text-center">
          <div className="bg-white br-15 h-100">
            <div className="p-3 mt-3 h-100 w-10">
              <div className="certificate_img_div my-auto">
                <img id="certificateImg" src={`${process.env.PUBLIC_URL}/images/certificates/certificateThumbnail.svg`} className="compose_certificate" alt="Certificate" title={cDataValue.name} />
                <div className="mt-3">
                  <button type="button" className="btn eep-btn-default eep-btn-default-hover certPreviewBtn" id="certPreviewBtn" onClick={previewHandler} data-toggle="modal" data-target="#certPreviewModal">
                    <i className="fa fa-eye mr-2" aria-hidden="true"></i>Preview
                  </button>
                </div>
                <div className="eep_page_popover" data-tip="Please ensure your signatue on your profile." dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.info_icon }}>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-7 col-lg-7 col-xs-12 col-sm-12 text-center messagecompose_div">
          <div className="bg-f4f4f4 br-15">
            <div className="p-3">
              <div className="row">
                <div className="compose_mail_img_div">
                  <img src={`${process.env.PUBLIC_URL}/images/icons/tasks/compose.png`} className="compose_mail_img" alt="compose-img" />
                </div>
                <div className="col-md-12">
                  <h4 className="text-center cc_color my-3 font-helvetica-m font-weight-bold">Compose Certificate</h4>
                </div>
                <div className="col-md-12 compose_text">
                  <div className="mb-4 row">
                    <label htmlFor="certificateTo" className="col-sm-1 col-form-label">To:</label>
                    <div className="col-sm-11">
                      <Select
                        options={userData}
                        placeholder="Enter User Name or Department Name"
                        isSearchable={true}
                        className={`form-group select_bgwhite p-0 mb-0`}
                        name="UserSelect"
                        id="userselect"
                        defaultValue=""
                        onChange={(event) => handleInputChange(event)}
                        onBlur={() => menuHideShow(false)}
                        onKeyDown={() => menuHideShow(true)}
                        classNamePrefix="eep_select_common eep_compose_inputs select"
                        style={{ height: "auto" }}
                        maxMenuHeight={150}
                        value={toValue}
                        menuIsOpen={openMenu}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-4 row">
                    <label htmlFor="ccEmail" className="col-sm-1 col-form-label">CC:</label>
                    <div className="col-sm-11 ccEmail_div">
                      <Select
                        options={eMailData}
                        placeholder="Add more recipient's"
                        isSearchable={true}
                        className={`form-group select_bgwhite p-0 mb-0`}
                        name="recipientSelect"
                        id="recipientselect"
                        defaultValue=""
                        onChange={(event) => handleRecipientChange(event)}
                        onBlur={() => ccMenuHideShow(false)}
                        onKeyDown={() => ccMenuHideShow(true)}
                        classNamePrefix="eep_select_common eep_compose_inputs select"
                        style={{ height: "auto" }}
                        maxMenuHeight={150}
                        value={ccValue}
                        menuIsOpen={openCCMenu}
                        isMulti={true}
                        isClearable={false}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-4 row">
                    <label htmlFor="ccEmail" className="col-sm-1 col-form-label"></label>
                    <div className="col-sm-11">
                      <input autoComplete="off" type="text" className="form-control text-center text-uppercase border-0" id="certificateName" name="certificateName" placeholder="CERTIFICATE NAME" value={certificateName} onChange={(e) => handleCertificateName(e)} />
                    </div>
                  </div>
                </div>
                <div className="col-md-12">
                  <div className="mb-4 row">
                    <label htmlFor="ccEmail" className="col-sm-1 col-form-label"></label>
                    <div className="col-sm-11">
                      <textarea className="form-control certificateMessage" id="certificateMessage" rows="3" placeholder="Message" value={message} maxLength={msgMaxLength} onChange={(e) => handleCertificateMessage(e)}></textarea>
                      <span className="help-block">
                        <p id="characterLeft" className="help-block ">{message.length}/{msgMaxLength}</p>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row align-items-center">
                <div className="col-sm-1"></div>
                <div className="col-sm-11">
                  <div className="row align-items-center">
                    <div className="col-md-6 text-left">
                      <Link to="certificates" className="c-2c2c2c a_hover_txt_deco_none">Cancel</Link>
                    </div>
                    <div className="col-md-6 text-right">
                      <button type="button" className="eep-btn eep-btn-success eep-btn-xsml certSubmitBtn" id="certSubmitBtn" disabled={isSendDisabled} onClick={sendCertHandler}>
                        <span dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.eye }}></span>
                        <span> Send </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default CertificateCompose;