import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CreatMessageModal from "../../modals/CreatMessageModal";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import DeleteECardTemplateModal from "../../modals/DeleteECardTemplateModal";
import ResponseInfo from "../../UI/ResponseInfo";

const MessageTemplate = (props) => {

  const {templateType, getMessageTemplate} = props;

  const messageObj = {
    message: "",
    category: templateType.category ? templateType.category : null,
    scheduled:false,
    settingsId:0,
  }
  const [createTemplatMsgeData, setCreateTemplatMsgeData] = useState(messageObj);
  const [messageData, setMessageData] = useState([]);
  const [scheduledMessageData, setScheduledMessageData] = useState([]);
  const [modalFlag, setModalFlag] = useState(false);
  const [deletionState, setDeletionState] = useState(false);
  const [deletionData, setDeletionData] = useState([]);
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
  };

  const triggerAddMessage = () => {
    setModalFlag(true);
  }

  const fetchMessageData = () => {
    setMessageData([]);
    getMessageTemplate([]);
    const obj = {
      url: URL_CONFIG.GET_TEMPLATE_MESSAGE,
      method: "get",
      params: { type: templateType.category },
    };
    httpHandler(obj)
    .then((response) => {
      //console.log("response", response);
      setMessageData(response.data);
      getMessageTemplate(response.data);
      let scheduledMessageDataTemp = [];
        response.data.length && response.data.map((item) => {
          if(item.scheduled) {
            scheduledMessageDataTemp.push(item);
          }
          return scheduledMessageDataTemp;
        });
        setScheduledMessageData(scheduledMessageDataTemp);
    })
    .catch((error) => {
      console.log("fetchMessageData errorrrr", error);
    });
  }

  const fetchAnniversaryMessageData = () => {
    setMessageData([]);
    getMessageTemplate([]);  
    const obj = {
      url: URL_CONFIG.ANNIVERSARY_ECARD,
      method: "get",
      params: { int: templateType.yearInfo?.id },
    };
    httpHandler(obj)
    .then((response) => {
      //console.log("response", response);
      setMessageData(response.data.message);
      getMessageTemplate(response.data.message);
      let scheduledMessageDataTemp = [];
        response.data.message.length && response.data.message.map((item) => {
          if(item.scheduled) {
            scheduledMessageDataTemp.push(item);
          }
          return scheduledMessageDataTemp;
        });
        setScheduledMessageData(scheduledMessageDataTemp);
    })
    .catch((error) => {
      console.log("fetchAnniversaryMessageData errorrrr", error);
    });
  }

  useEffect(() => {
    let createTemplatMsgeDataTemp = JSON.parse(JSON.stringify(createTemplatMsgeData));
    createTemplatMsgeDataTemp.category = templateType.category;
    setCreateTemplatMsgeData(createTemplatMsgeDataTemp);
    fetchMessageData();
  }, [])

  useEffect(() => {
    if(templateType.category === 'anniversary' && templateType.yearInfo) {
      let createTemplatMsgeDataTemp = JSON.parse(JSON.stringify(createTemplatMsgeData));
      createTemplatMsgeDataTemp.category = templateType.category;
      createTemplatMsgeDataTemp.settingsId = templateType.yearInfo?.id;
      setCreateTemplatMsgeData(createTemplatMsgeDataTemp);
      fetchAnniversaryMessageData();
    }
    return () => {
      setCreateTemplatMsgeData(messageObj);
    }
  }, [templateType])

  const insertMessageData = (arg) => {
    const obj = {
      url: URL_CONFIG.CREATE_TEMPLATE_MESSAGE,
      method: "post",
      payload: arg,
    };
    if(arg.message !== "") {
      httpHandler(obj)
      .then((response) => {
        //console.log("response", response?.data?.message);
        if(templateType.category === 'anniversary') {
          fetchAnniversaryMessageData();
        } else {
          fetchMessageData();
        }
      })
      .catch((error) => {
        //console.log("errorrrr", error);
        //const errMsg = error?.response?.data?.message;
        setShowModal({
          ...showModal,
          type: "danger",
          message: error?.response?.data?.message,
        });
      });
    }
  }

  const getMessageData = (arg) => {
    let createTemplatMsgeDataTemp = JSON.parse(JSON.stringify(createTemplatMsgeData));
    console.log("createTemplatMsgeDataTemp", createTemplatMsgeDataTemp);
    createTemplatMsgeDataTemp.message = arg;
    setCreateTemplatMsgeData(createTemplatMsgeDataTemp);
    insertMessageData(createTemplatMsgeDataTemp);
    setModalFlag(false);
  }

  const handleScheduleState = (arg) => {
    let messageDataTmp = [...messageData];
    for(let i=0; i<messageDataTmp.length; i++){
      if(arg.id === messageDataTmp[i].id){
        messageDataTmp[i].scheduled = !messageDataTmp[i].scheduled;
        break;
      }
    }
    setMessageData(messageDataTmp);
    getMessageTemplate(messageDataTmp);
  }

  const handleCardDeletion = (arg) => {
    setDeletionData(arg);
    setDeletionState(true);
  }

  const confirmState = (arg) => {
    if(arg) {
      const obj = {
        url: URL_CONFIG.DELETE_TEMPLATE_MESSAGE+"?id="+deletionData.data.id,
        method: "delete"
      };
      httpHandler(obj)
        .then((response) => {
          //console.log("handleBirthdayTemplate resMsg", response);
          if(templateType.category === 'anniversary') {
            fetchAnniversaryMessageData();
          } else {
            fetchMessageData();
          }
        })
        .catch((error) => {
          //console.log("confirmState errorrrr", error);
          setShowModal({
          ...showModal,
          type: "danger",
          message: error?.response?.data?.message,
        });
      });
    } else {
      setDeletionData([]);
      setDeletionState(false);
    }
  }

    return(
      <React.Fragment>
        {modalFlag && <CreatMessageModal getMessageData={getMessageData} /> }
        {deletionState && <DeleteECardTemplateModal confirmState={confirmState} />}
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

        {templateType.isSchedule && (
          <div className="row eep-templates-setting-message p-0 m-0">
            <div className="d-flex">
              <h4 className="c-2c2c2c mb-0">Choose your message</h4>
            </div>
            <div className="col-md-12 templates_message_div templates_card_whole_div px-0">
              <div className="d-flex justify-content-end">
                <ul className="nav nav-pills py-2 mb-2 px-0" id="pills-tab" role="tablist">
                  <li className="nav-item">
                    <a className="nav-link active" id="showallmessage-tab" data-toggle="pill" href="#showallmessage" role="tab" aria-controls="showallmessage" aria-selected="true">All</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" id="scheduledmessage-tab" data-toggle="pill" href="#scheduledmessage" role="tab" aria-controls="scheduledmessage" aria-selected="false">Scheduled</a>
                  </li>
                </ul>
              </div>
              <div className="row mx-0 px-0">
                <div className="tab-content col-md-12" id="pills-tabContent">
                  <div className="tab-pane fade col-md-12 show active" id="showallmessage" role="tabpanel" aria-labelledby="showallmessage-tab">
                    {messageData && messageData.length > 0 && messageData.map((item, index) => {
                      return (
                        <div className="Portfolio col-md-4 mb-3" key={"messageTemp_"+index}>
                          <div 
                            className={`div_msgData ${item.scheduled ? "m_scheduled" : ""}`}
                            onClick={() => handleScheduleState(item)}
                          >
                            <p>{item.message}</p>
                          </div>
                          <div className="delete_template_div">
                          <Link to="#">
                            <img src={`${process.env.PUBLIC_URL}/images/icons/tasks/delete.svg`} className="delete_template" alt="Delete Icon" onClick={() => handleCardDeletion({type:"message", data:item})} data-toggle="modal" data-target="#deleteECardTemplateModal" />
                          </Link>
                          </div>
                        </div>
                      )
                    })}
                    <div className="Portfolio col-md-2 mb-3 add_msg_template_div sample_div">
                      <div className="inner samplev">
                        <img 
                          src={`${process.env.PUBLIC_URL}/images/icons/plus-white.svg`} 
                          className="add_msg_template sample_img c1" 
                          alt="Add Msg Icon"  
                          data-toggle="modal" 
                          data-target="#addMessageModal"
                          onClick={triggerAddMessage}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="tab-pane fade col-md-12" id="scheduledmessage" role="tabpanel" aria-labelledby="scheduledmessage-tab">
                    {scheduledMessageData && scheduledMessageData.length > 0 && scheduledMessageData.map((item, index) => {
                      return (
                        <div className="Portfolio col-md-4 mb-3" key={"scheduledMessageTemp_"+index}>
                          <div className="div_msgData m_scheduled">
                            <p>{item.message}</p>
                          </div>
                          <div className="delete_template_div">
                            <Link to="#">
                              <img src={`${process.env.PUBLIC_URL}/images/icons/tasks/delete.svg`} className="delete_template" alt="Delete Icon" onClick={() => handleCardDeletion({type:"message", data:item})} data-toggle="modal" data-target="#deleteECardTemplateModal" />
                            </Link>
                          </div>
                        </div>
                      );
                    })}
                    {scheduledMessageData && scheduledMessageData.length <= 0 && (
                      <ResponseInfo title="No record found." responseImg="noRecord" responseClass="response-info" />
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {!templateType.isSchedule && (
          <div className="row eep-templates-setting-message p-0 m-0">
            <div className="d-flex mb-3">
              <h4 className="c-2c2c2c mb-0">Add Message(s)</h4>
            </div>
            <div className="col-md-12 templates_message_div templates_card_whole_div px-0">
              {messageData && messageData.length > 0 && messageData.map((item, index) => {
                return (
                  <div className="Portfolio col-md-4 mb-3" key={"messageTemp_"+index}>
                    <div className="div_msgData">
                      <p>{item.message}</p>
                    </div>
                    <div className="delete_template_div">
                    <Link to="#">
                      <img src={`${process.env.PUBLIC_URL}/images/icons/tasks/delete.svg`} className="delete_template" alt="Delete Icon" onClick={() => handleCardDeletion({type:"message", data:item})} data-toggle="modal" data-target="#deleteECardTemplateModal" />
                    </Link>
                    </div>
                  </div>
                )
              })}
              <div className="Portfolio col-md-2 mb-3 add_msg_template_div sample_div">
                <div className="inner samplev">
                  <img 
                    src={`${process.env.PUBLIC_URL}/images/icons/plus-white.svg`} 
                    className="add_msg_template sample_img c1" 
                    alt="Add Msg Icon"  
                    data-toggle="modal" 
                    data-target="#addMessageModal"
                    onClick={triggerAddMessage}
                  />
                </div>
              </div>
            </div>
          </div>
        )}


      </React.Fragment>
    );
};
export default MessageTemplate;