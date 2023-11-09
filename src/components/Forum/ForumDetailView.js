import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import PageHeader from "../../UI/PageHeader";
import { httpHandler } from "../../http/http-interceptor";
import { REST_CONFIG, URL_CONFIG } from "../../constants/rest-config";
import EEPSubmitModal from "../../modals/EEPSubmitModal";
import Heart from "../../UI/CustomComponents/Heart";
import CommentReply from "./CommentReply";
import ForumCommentsList from "./ForumCommentsList";
import ConfirmStateModal from "../../modals/ConfirmStateModal";
import axios from "axios";

const ForumDetailView = () => {
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const currentUserData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};
  const getLocation = useLocation();
  //console.log("getLocation", getLocation);
  //const forumDataVal = getLocation.state ? getLocation.state?.forumData : "";
  //const usersPicDataVal = getLocation.state ? getLocation.state?.usersPicData : "";
  const initialVal = getLocation.state ? getLocation.state?.forumData : {};
  const initialPicVal = getLocation.state ? getLocation.state?.usersPicData : [];
  const [forumData, setForumData] = useState({});
  const [forumCommentData, setForumCommentData] = useState([]);
  const [attachementShow, setAttachementShow] = useState(false);
  const [heartAnimateState, setHeartAnimateState] = useState(false);
  const [usersPics, setUsersPics] = useState([]);
  const [toggleComment, setToggleComment] = useState(false);
  const [toggleCommentSetting, setToggleCommentSetting] = useState({});
  const [forumComment, setForumComment] = useState("");
  const [forumTempData, setForumTempData] = useState({});
  const [confirmModalState, setConfirmModalState] = useState(false);
  const [toggleReplyState, setToggleReplyState] = useState({ isToggle: false, cmtData: {}, type: "" });
  const maxTextAreaLength = 255;
  const [showModal, setShowModal] = useState({ type: null, message: null });
  const hideModal = () => {
    let collections = document.getElementsByClassName("modal-backdrop");
    for (var i = 0; i < collections.length; i++) {
      collections[i].remove();
    }
    setShowModal({ type: null, message: null });
    setConfirmModalState(false);
    setForumTempData({});
  };

  const fileTypeAndImgSrcArray = {
    "application/pdf": process.env.PUBLIC_URL + "/images/icons/special/pdf.svg",
    "application/mspowerpoint": process.env.PUBLIC_URL + "/images/icons/special/ppt.svg",
    "application/powerpoint": process.env.PUBLIC_URL + "/images/icons/special/ppt.svg",
    "application/vnd.ms-powerpoint": process.env.PUBLIC_URL + "/images/icons/special/ppt.svg",
    "application/x-mspowerpoint": process.env.PUBLIC_URL + "/images/icons/special/ppt.svg",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": process.env.PUBLIC_URL + "/images/icons/special/ppt.svg",
    "application/vnd.ms-excel": process.env.PUBLIC_URL + "/images/icons/special/xlsx.svg",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": process.env.PUBLIC_URL + "/images/icons/special/xlsx.svg",
    "application/zip": process.env.PUBLIC_URL + "/images/icons/special/zip.svg",
    "application/x-zip-compressed": process.env.PUBLIC_URL + "/images/icons/special/zip.svg",
    "application/msword": process.env.PUBLIC_URL + "/images/icons/special/word.svg",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": process.env.PUBLIC_URL + "/images/icons/special/word.svg",
    "image/jpeg": process.env.PUBLIC_URL + "/images/icons/special/jpeg.svg",
    "image/jpg": process.env.PUBLIC_URL + "/images/icons/special/jpeg.svg",
    "image/png": process.env.PUBLIC_URL + "/images/icons/special/jpeg.svg",
    "image/gif": process.env.PUBLIC_URL + "/images/icons/special/gif.svg",
    "image/svg+xml": process.env.PUBLIC_URL + "/images/icons/special/jpeg.svg",
    "application/octet-stream": process.env.PUBLIC_URL + "/images/icons/special/doc.svg",
    "default": process.env.PUBLIC_URL + "/images/icons/special/default-doc.svg",
    "image/xlsx": process.env.PUBLIC_URL + "/images/icons/special/icons8-excel-48.png",
  };

  useEffect(() => {
    if (Object.keys(initialVal).length > 0) {
      //setForumData({...initialVal});
      //setForumCommentData(getCustomizedData(initialVal.forumComments));
      getForumById(initialVal);
      setUsersPics(initialPicVal);
    }
  }, [initialVal, initialPicVal]);

  const disableExistModal = () => {
    setConfirmModalState(false);
    setShowModal({ type: null, message: null });
  }

  const getSubChildren = (arg, ret) => {
    for (var i = 0; i < arg?.children?.length; i++) {
      arg.children[i]['prentInfo'] = { id: arg?.id, message: arg?.message, createdBy: arg?.createdBy };
      if (arg?.children?.[i]?.createdAt) {
        arg.children[i].createdAt = arg.children?.[i]?.createdAt;
      }

      ret.push(arg.children[i]);
      if (arg?.children?.[i]?.children?.length) {
        getSubChildren(arg.children[i], ret);
      }
    }
    return ret;
  }

  const getCustomizedData = (data) => {
    if (data) {
      data.map((res) => {
        res['subChildren'] = getSubChildren(res, []);
      });
      return data;
    }
  }

  const clickCommentSubmitHandler = (fData) => {
    if (forumComment.length > 0 && fData) {
      const payOptions = {
        message: forumComment,
        forum: {
          id: fData.id
        }
      }
      const obj = {
        url: URL_CONFIG.FORUM_COMMENTS,
        method: "post",
        payload: payOptions
      };
      httpHandler(obj).then(() => {
        getForumById(fData);
      }).catch((error) => {
        const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
        setShowModal({
          ...showModal,
          type: "danger",
          message: errMsg,
        });
      });
    }
  }

  const updateCommentHandler = (cmtVal, cmtData, fData) => {
    if (cmtVal.length > 0 && fData) {
      const payOptions = {
        id: cmtData.id,
        message: cmtVal,
        forum: {
          id: fData.id
        }
      }
      const obj = {
        url: URL_CONFIG.FORUM_COMMENTS,
        method: "put",
        payload: payOptions
      };
      httpHandler(obj).then(() => {
        getForumById(fData);
      }).catch((error) => {
        const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
        setShowModal({
          ...showModal,
          type: "danger",
          message: errMsg,
        });
      });
    }
  }

  const clickCommentReplySubmitHandler = (fData, parentData, replyCommentVal) => {
    
    if (replyCommentVal.length > 0 && fData) {
      const payOptions = {
        message: replyCommentVal,
        parent: {
          id: parentData.id
        }
      }
      const obj = {
        url: URL_CONFIG.FORUM_COMMENTS_REPLY,
        method: "post",
        payload: payOptions
      };
      httpHandler(obj).then(() => {
        setToggleReplyState({ isToggle: false, cmtData: {}, type: "" });
        getForumById(fData);
      }).catch((error) => {
        const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
        setShowModal({
          ...showModal,
          type: "danger",
          message: errMsg,
        });
      });
    }
  }

  const updateCommentReplyHandler = (cmtVal, cmtData, fData) => {
    if (cmtVal.length > 0 && fData) {
      const payOptions = {
        id: cmtData.id,
        message: cmtVal,
        parent: {
          id: cmtData.prentInfo.id
        }
      }
      const obj = {
        url: URL_CONFIG.FORUM_COMMENTS_REPLY,
        method: "put",
        payload: payOptions
      };
      httpHandler(obj).then(() => {
        getForumById(fData);
      }).catch((error) => {
        const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
        setShowModal({
          ...showModal,
          type: "danger",
          message: errMsg,
        });
      });
    }
  }

  let followEnliteIndex;
  const forumCommentsEnlite = (arg) => {
    
    setHeartAnimateState(false);
    if (arg) {
      let obj;
      if (arg.isEnlite) {
        obj = {
          url: URL_CONFIG.ENLITE_FORUM,
          // + "?id=" + arg.cmtData.id,
          payload: { id: arg.cmtData.id },
          method: "post"
        }
      } else if (!arg.isEnlite) {
        followEnliteIndex = arg.cmtData.forumLikes.findIndex(x => x.userId?.user_id === currentUserData.id);
        obj = {
          url: URL_CONFIG.ENLITE_FORUM + "?id=" + arg.cmtData.forumLikes[followEnliteIndex].id,
          method: "delete"
        }
      }
      httpHandler(obj).then((response) => {
        
        if (arg?.isEnlite) {
          setHeartAnimateState(true);
        }
        // if (response?.data?.message) {
        //   setShowModal({
        //     ...showModal,
        //     type: "danger",
        //     message: response?.data?.message,
        //   });
        // }
        getForumById(arg?.cmtData);
      }).catch((error) => {
        
        const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
        setShowModal({
          ...showModal,
          type: "danger",
          message: errMsg,
        });
      });
    }
  }

  const getForumById = (arg) => {
    
    const obj = {
      url: URL_CONFIG.FORUM_BY_ID + "?id=" + arg.id,
      method: "get"
    }
    httpHandler(obj).then((response) => {
      //console.log("getforum by id response :", response.data);
      setForumData({ ...response?.data });
      setForumCommentData([...getCustomizedData(response?.data?.forumComments)]);
      setToggleComment(false);
      setToggleReplyState({ isToggle: false, cmtData: {}, type: "" });
    })
    // .catch((error) => {
    //   const errMsg =
    //     error.response?.data ?
    //       error.response?.data?.message
    //       : "Not able to fetch forum details. Something went wrong contact administarator";
    //   setShowModal({
    //     ...showModal,
    //     type: "danger",
    //     message: errMsg,
    //   });
    // });
  }

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPics.findIndex(x => x.id === uID);
    return userPicIndex !== -1 ? usersPics[userPicIndex].pic : process.env.PUBLIC_URL + "/images/user_profile.png";
  };

  const toggleCommentHandler = (isToggleComment, fCommentValue, toggleSetting) => {
    setForumComment(fCommentValue);
    setToggleReplyState({ isToggle: false, cmtData: {}, type: "" });
    setToggleComment(!isToggleComment);
    setToggleCommentSetting(toggleSetting);
    if (!isToggleComment) {
      setTimeout(() => {
        document.getElementById("comment").focus();
      }, 0);
    }
  }

  const editCommentHandler = (cmtData) => {
    toggleCommentHandler(toggleComment, cmtData.message, { type: "edit", cmtData: cmtData });
  }

  const toggleReply = (arg, tType) => {
    
    setToggleComment(false);
    setToggleReplyState({ isToggle: true, cmtData: arg, type: tType });
  }

  const editCommentReplyHandler = (cmtData) => {
    
    toggleReply(cmtData, "edit");
  }

  const closeReply = () => {
    setToggleReplyState({ isToggle: false, cmtData: {}, type: "" });
  }

  const toggleReplyList = (replyItem, tState) => {
    let forumCommentDataTemp = JSON.parse(JSON.stringify(forumCommentData));
    console.log("toggleReplyList", replyItem);
    if (forumCommentDataTemp.length > 0) {
      forumCommentDataTemp.map((item) => {
        if (item.id === replyItem.id) {
          item.toggleReplyState = !tState;
          return setForumCommentData([...forumCommentDataTemp]);
        }
      });
    }
    //setForumCommentData()
  }

  const showAttachements = () => {
    setToggleComment(false);
    setAttachementShow(!attachementShow);
    setToggleReplyState({ isToggle: false, cmtData: {}, type: "" });
  }

  const commentLikeHandler = (cmtData, fData) => {
		
    const obj = {
      url: URL_CONFIG.FORUM_COMMENT_LIKE_UNLIKE,
      //  + "?id=" + cmtData.id,
      payload: { id: cmtData.id },
      method: "post"
    }
    httpHandler(obj).then(() => {
      getForumById(fData);
    }).catch((error) => {
      const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
      setShowModal({
        ...showModal,
        type: "danger",
        message: errMsg,
      });
    });
  }

  let unLikeIndex;
  const commentUnLikeHandler = (cmtData, fData) => {
    
    unLikeIndex = cmtData.forumCommentLikes.findIndex(x => x.userId?.user_id === currentUserData.id);
    //console.log("unLikeIndex", unLikeIndex);
    const obj = {
      url: URL_CONFIG.FORUM_COMMENT_LIKE_UNLIKE,
      //  + "?id=" + cmtData.forumCommentLikes[unLikeIndex].id,
      payload: { id: cmtData.forumCommentLikes[unLikeIndex].id },
      method: "delete"
    }
    axios.delete(`${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL}/api/v1${URL_CONFIG.FORUM_COMMENT_LIKE_UNLIKE}`, 
    { data: { id: cmtData.forumCommentLikes[unLikeIndex].id } })
    // httpHandler(obj)
    .then(() => {
      getForumById(fData);
    }).catch((error) => {
      const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
      setShowModal({
        ...showModal,
        type: "danger",
        message: errMsg,
      });
    });
  }

  const deleteCommentHandler = (cmdData, fData) => {
    disableExistModal();
    setForumTempData({ cmdData: cmdData, fData: fData });
    setConfirmModalState(true);
  }

  const confirmState = (isConfirmed) => {
    if (isConfirmed) {
      disableExistModal();
      console.log("Perform Delete", forumTempData);
      let httpObj = {
        url: URL_CONFIG.FORUM_DELETE_COMMENT + "?id=" + forumTempData.cmdData.id,
        method: "delete"
      };
      httpHandler(httpObj)
        .then(() => {
          getForumById(forumTempData.fData);
        })
        .catch((error) => {
          const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Oops! Something went wrong. Please contact administrator.";
          setShowModal({
            ...showModal,
            type: "danger",
            message: errMsg,
          });
        });
    } else {
      setForumTempData({});
    }
  }

  const onChangeForumComment = (e) => {
    setForumComment(e.target.value);
  }

  const checkIsReplyLiked = (rData) => {
    //console.log("checkIsReplyLiked rData", rData);
    let rLikeIndex = rData.forumCommentLikes.findIndex(x => x.userId?.user_id === currentUserData.id);
    //console.log("rLikeIndex", rLikeIndex);
    if (rLikeIndex === -1) {
      return false;
    } else {
      return true;
    }
  }

  //console.log("setForumData:", forumData, forumCommentData);

  return (
    <React.Fragment>
      <PageHeader title="Forum Pot" navLinksLeft={<Link to="forum" className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.lessthan_circle }}></Link>} />
      {showModal.type !== null && showModal.message !== null && (
        <EEPSubmitModal
          data={showModal}
          className={`modal-addmessage`}
          hideModal={hideModal}
          successFooterData={
            <Link to="#" type="button" className="eep-btn eep-btn-xsml eep-btn-success" onClick={hideModal}> Ok </Link>
          }
          errorFooterData={
            <button type="button" className="eep-btn eep-btn-xsml eep-btn-danger" data-dismiss="modal" onClick={hideModal}>Close</button>
          }
        ></EEPSubmitModal>
      )}

      {confirmModalState &&
        <ConfirmStateModal
          hideModal={hideModal}
          confirmState={confirmState}
          confirmTitle={"Are you sure?"}
          confirmMessage={"Do you really want to delete this comment. Make sure the entire replies will be also deleted."}
        />
      }

      {forumData && Object.keys(forumData).length > 0 &&
        <div className="row no-gutters forum_discussion_containerr">
          <div className="tab-content col-md-12 h-100">
            <div className="forum_main_topic">
              <div className="forum_profile_container pr-0">
                <div className="forum_profile_image">
                  <img src={getUserPicture(forumData.createdBy.id)} alt="forum_profile_picture" className="rounded-circle forum_profile_image_size" />
                </div>
                <div className="forum_profile_content">
                  <p className="forum_content_title">{forumData.title}</p>
                  <p className="forum_user_name mb-0">{forumData.createdBy?.firstname + " " + forumData.createdBy?.lastname}</p>
                </div>
                {forumData.forumAttachmentFileName.length > 0 &&
                  <div className="fd_attachements_button" onClick={() => showAttachements()}>
                    <p className="c1 mb-0">{forumData.forumAttachmentFileName.length} {forumData.forumAttachmentFileName.length > 0 ? (forumData.forumAttachmentFileName.length === 1 ? "Attachement" : "Attachements") : "Attachements"}</p>
                  </div>
                }
              </div>
              <div className="eep-dropdown-divider pb-1"></div>
              {forumData.forumAttachmentFileName.length > 0 && attachementShow &&
                <div className="fd_attachemnt_list">
                  {forumData.forumAttachmentFileName.map((atthData, index) => {
                    return (
                      <div className="attachment_parent" key={"attachmentLists_" + index}>
                        <a href={atthData.docByte?.image} target="_thapa" download={atthData.ideaAttachmentsFileName}>
                          <img src={fileTypeAndImgSrcArray[atthData.contentType]
                             ? fileTypeAndImgSrcArray[atthData.contentType] : 
                             fileTypeAndImgSrcArray['default']} 
                             className="image-circle c1 attachment_image_size" alt="icon" title={atthData.ideaAttachmentsFileName} />
                        </a>
                      </div>
                    )
                  })
                  }
                </div>
              }
              <div className="d-block">
                <div className="forum_content">
                  <p className="forum_message_style">{forumData.description}</p>
                </div>
                <div className="d-flex">
                  <div className="flex-grow-1"></div>
                  <div className={`mr-2 liked_heart c1 ${forumData.forumIsEntitled ? "clicked" : " "}`} >
                    <div className="fd_enlided_icon">
                      {forumData.forumIsEntitled &&
                        <React.Fragment>
                          <div onClick={() => forumCommentsEnlite({ isEnlite: false, cmtData: forumData })}>
                            {heartAnimateState && <Heart />}
                            <span dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.enlited_icon }}></span>
                          </div>
                        </React.Fragment>
                      }
                      {!forumData.forumIsEntitled &&
                        <React.Fragment>
                          <div onClick={() => forumCommentsEnlite({ isEnlite: true, cmtData: forumData })}>
                            <span dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.enlite_icon }}></span>
                          </div>
                        </React.Fragment>
                      }
                    </div>
                  </div>
                  <div className="reply_button_style main_topic_reply_button text-right" username="admin" onClick={() => toggleCommentHandler(toggleComment, "", { type: "new", cmtData: {} })}>
                    <img src={`${process.env.PUBLIC_URL}/images/icons/static/comment.svg`} alt="reply-icon" className="forum-following-img-size c1" style={{ width: "30px", height: "30px" }} />
                  </div>
                </div>
              </div>
              {forumData.forumIsfollowing &&
                <div className="forum_following_topics_img">
                  <img src={`${process.env.PUBLIC_URL}/images/icons/static/Follow.svg`} className="forum-eep-img-size" />
                </div>
              }
            </div>
            {toggleComment &&
              <div className="forum_reply_message forum_append_class_container">
                <div className="forum_profile_container" style={{ border: "0px" }}>
                  <div className="forum_profile_image">
                    <img src={getUserPicture(currentUserData.id)} alt="forum_profile_picture" className="rounded-circle forum_profile_image_size" />
                  </div>
                  <div className="forum_profile_content">
                    <label className="forum_user_name mb-0">{currentUserData.fullName}</label>
                    <label className="forum_nofpostes d-flex align-items-center mb-0" style={{ fontSize: "12px" }}>
                      <div className="d-flex cursor_help mb-0" title={forumData.title}><i className="eep_truncate eep_truncate_max">Comment to - <span>{forumData.title}</span></i></div>
                    </label>
                  </div>
                </div>
                <div className="eep-dropdown-divider pb-1"></div>
                <div className="forumMainTopicreplyTextArea">
                  <div className="replyTextArea px-3">
                    <textarea id="comment" className="eep_scroll_y" rows="3" maxLength={maxTextAreaLength} value={forumComment} onChange={(event) => onChangeForumComment(event)}></textarea>
                  </div>
                  <div className="d-flex align-items-center justify-content-between px-3">
                    <span id="rchars">{forumComment.length}/{maxTextAreaLength}</span>
                    {toggleCommentSetting.type === "new" &&
                      <div
                        className={`${forumComment.length > 0 ? "eep_post_icon c1" : ""}`}
                        onClick={() => clickCommentSubmitHandler(forumData)}>
                        <span dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.send_icon }}></span>
                      </div>
                    }
                    {toggleCommentSetting.type === "edit" &&
                      <div
                        className={`${forumComment.length > 0 ? "eep_post_icon c1" : ""}`}
                        onClick={() => updateCommentHandler(forumComment, toggleCommentSetting.cmtData, forumData)}>
                        <span dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.send_icon }}></span>
                      </div>
                    }
                  </div>
                </div>
                <div className="forumRplayClose c1" onClick={() => setToggleComment(false)}>
                  <i className="fa fa-times" aria-hidden="true"></i>
                </div>
              </div>
            }
            <div className="fd_comments_count m-2 p-2" id="commentsSize" style={{ borderTop: "1px solid #DBDBDB" }}>
              <span className="fd_count_number">{forumData?.forumComments?.length}</span> <span style={{ color: "#646464" }}> comments</span>
            </div>
            {forumData?.forumComments?.length > 0 &&
              <ForumCommentsList
                forumData={forumData}
                comments={forumCommentData}
                getUserPicture={getUserPicture}
                deleteCommentHandler={deleteCommentHandler}
                commentUnLikeHandler={commentUnLikeHandler}
                commentLikeHandler={commentLikeHandler}
                toggleReply={toggleReply}
                editCommentHandler={editCommentHandler}
                editCommentReplyHandler={editCommentReplyHandler}
                toggleReplyList={toggleReplyList}
                checkIsReplyLiked={checkIsReplyLiked}
              />
            }
            {toggleReplyState.isToggle &&
              <CommentReply toggleReplyState={toggleReplyState} forumData={forumData} closeReply={closeReply} getUserPicture={getUserPicture} clickCommentReplySubmitHandler={clickCommentReplySubmitHandler} updateCommentReplyHandler={updateCommentReplyHandler} />
            }
          </div>
        </div>
      }
      {/* {forumData && Object.keys(forumData).length <= 0 &&
        <div className="alert alert-danger" role="alert">Not able to fetch property data. Please try again from beginning.</div>
      } */}
    </React.Fragment>
  );

}

export default ForumDetailView;