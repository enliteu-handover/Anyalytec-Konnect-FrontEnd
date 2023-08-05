import React, { useEffect, useState } from "react";
import { eepFormatDateTime } from "../../shared/SharedService";
import ResponseInfo from "../../UI/ResponseInfo";

const FeedbackDetailViewInner = (props) => {

  const { ideaDetail, usersPic, likeAnIdea, isDetailView } = props;

  const initIsDetailView = isDetailView ? isDetailView : false;
  const [toggleAttachements, setToggleAttachements] = useState(false);
  const loggedUserData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};
  const [isDetailListMode, setIsDetailListMode] = useState(true);

  useEffect(() => {
    if (initIsDetailView) {
      setIsDetailListMode(false);
    } else {
      setIsDetailListMode(true);
    }
  }, [initIsDetailView]);

  const toggleAttachement = () => {
    setToggleAttachements(!toggleAttachements);
  }

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPic.findIndex(x => x.id === uID);
    return userPicIndex !== -1 ? usersPic[userPicIndex].pic : process.env.PUBLIC_URL + "/images/user_profile.png";
  }

  let iLikedIndex;
  const isIdeaLiked = (uID, feedbackLikes) => {

    iLikedIndex = feedbackLikes.findIndex(x => x.userId?.user_id === uID);
    if (iLikedIndex !== -1) {
      return { isLiked: true, likedID: feedbackLikes[iLikedIndex].id };
    } else {
      return { isLiked: false, likedID: null };
    }
  }

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
  };

  const likeAnIdeaHandler = (arg) => {
    likeAnIdea(arg);
  };

  return (
    <React.Fragment>
      {ideaDetail && Object.keys(ideaDetail).length > 0 &&
        <React.Fragment>
          <div className="ideabox-border bg-efefef sticky-top right_profile_div_r">
            <div className="ideabox-profile-expand-container ideabox-profile-expand-container-header">
              <div className="ideabox-profile-expand-container header-content-wrapperone align-items-center">
                <div className="ideabox-profile-img-size rounded-circle" style={{ fontSize: 33 }}>{ideaDetail?.logo}</div>
                {/* <img src={getUserPicture(ideaDetail.createdBy.id)} alt="profile" className="ideabox-profile-img-size rounded-circle" /> */}
                <div className="wrapper-one-content">
                  <div className="ideabox-font-style header-user-name font-helvetica-m">{ideaDetail?.title}</div>
                  <div className="header-user-destination ideabox_contentt_size">{ideaDetail?.category}</div>
                </div>
              </div>
              <div className="ideabox-profile-expand-inner-container header-content-wrapper-two">
                <div className="header-user-post-date ideabox_contentt_size ideabox-date">{eepFormatDateTime(ideaDetail.createdAt)}</div>
              </div>
            </div>

          </div>

          <p className="ideabox-font-style ideacontent_heading_feedback ideabox_contentt_size font-helvetica-m">{ideaDetail?.show_as}</p>
          <div style={{ display: "flex" }}>
            <img src={getUserPicture(ideaDetail?.createdBy?.id)} alt="profile" className="feedback-profile-img-size rounded-circle" />
            <div className="ideabox_ideacontent msg_content">
              <p className="ideacontent_content ideabox_contentt_size">
                <div dangerouslySetInnerHTML={{ __html: ideaDetail?.description }} />
              </p>
              {ideaDetail?.feedbackAttachmentFileName?.length > 0 &&
                <div className="w-100 bg-f5f5f5 attachment_toggle_feedback eep_scroll_y" style={{ maxHeight: "75px" }}>
                  <div className="attachement-display-flex">
                    {ideaDetail?.feedbackAttachmentFileName?.slice(0, 3).map((atthData, index) => {
                      return (
                        <div className="attachment_parent" key={"attachmentLists_" + index}>
                          <a href={atthData.docByte?.image} target="_thapa" download={atthData.ideaAttachmentsFileName}>

                            <img src={'/images/icons8-downloading-updates-50.svg'} alt="profile"
                              className="feedback-download-profile-img-size rounded-circle" />

                            <img src={atthData.docByte?.image ? atthData.docByte?.image
                              : fileTypeAndImgSrcArray['default']} className="image-circle c1 attachment_image_size" alt="icon"
                              title={atthData.ideaAttachmentsFileName} />
                          </a>
                        </div>
                      )
                    })}
                    {ideaDetail?.feedbackAttachmentFileName?.slice(3, ideaDetail?.feedbackAttachmentFileName?.length)?.length !== 0 && <div className="attachment_parent_feedback_more" key={"attachmentLists_"}>
                      <a>
                        {ideaDetail?.feedbackAttachmentFileName?.slice(3, ideaDetail?.feedbackAttachmentFileName?.length)?.length + ' +'}
                      </a>
                    </div>}
                  </div>
                </div>
              }
              <div className="item_blog_like_a_feedback text-left mb-2">
                <span className={"c1"}>
                  <img src={`${process.env.PUBLIC_URL}/images/icons/static/HeartDefault.svg`} alt="like" title="Dislike" className="post_heart" onClick={() => likeAnIdeaHandler({ isLike: true, iData: ideaDetail })} />
                  &nbsp;React   </span>
                <span className={"c1 c2"}>
                  <img src={`${process.env.PUBLIC_URL}/images/icons8-comments-50-2.svg`} alt="like" title="Dislike" className="post_heart" onClick={() => likeAnIdeaHandler({ isLike: true, iData: ideaDetail })} />
                  &nbsp;Comment   </span>
              </div>

              {ideaDetail?.ideaComments.length > 0 &&
                <React.Fragment>
                  {!isDetailListMode && ideaDetail.ideaComments.sort((a, b) => (a.id > b.id) ? 1 : -1).map((cmtData, index) => {
                    return (
                      <div className="ideaCommentLists p-2" key={"commentList_" + index}>
                        <div className="box-content mb-1">
                          <img src={getUserPicture(cmtData.createdBy.id)} alt="profile" className="ideabox-profile-img-size rounded-circle" />
                          <div className="reply_user_name">
                            <label className="mb-0">{cmtData.createdBy?.firstname + " " + cmtData.createdBy?.lastname}</label>
                          </div>
                        </div>
                        <p className="eep_command_posts">{cmtData.comments}</p>
                        {cmtData.ideaCommentAttach && cmtData.ideaCommentAttach.length > 0 &&
                          <div className="eep_command_attachements">
                            {cmtData.ideaCommentAttach.map((atthData, atthIndex) => {
                              return (
                                <div className="eep_command_attachements_inner_content" key={"cmdAtthList_" + atthIndex}>
                                  <a href={atthData.docByte?.image} target="_thapa" download={atthData.ideaAttachmentsFileName}>
                                    <img src={atthData.docByte?.image ? atthData.docByte?.image
                                      // fileTypeAndImgSrcArray[atthData.contentType] ? fileTypeAndImgSrcArray[atthData.contentType]
                                      : fileTypeAndImgSrcArray['default']} className="image-circle c1 attach_img_sm" alt="icon" title={atthData.ideaAttachmentsFileName} />
                                  </a>
                                </div>
                              )
                            })}
                          </div>
                        }
                        <p className="text-right mb-0 eep_dt">{eepFormatDateTime(cmtData.createdAt)}</p>
                      </div>
                    )
                  })}
                  {!isDetailView &&
                    <div className="comment_length text-right mt-2">
                      {isDetailListMode && <div className="v_commants v_post_comments c1 ideabox_contentt_size" onClick={() => setIsDetailListMode(false)}><label className="idea_viewComments c1">View all <span>{ideaDetail.ideaComments.length}</span> <span>{ideaDetail.ideaComments.length === 1 ? "comment" : "comments"}</span></label></div>}
                      {!isDetailListMode && <div className="v_commants v_post_comments c1 ideabox_contentt_size" onClick={() => setIsDetailListMode(true)}><label className="idea_viewComments c1">View less</label> </div>}
                    </div>
                  }
                </React.Fragment>
              }

            </div>
          </div>
        </React.Fragment>
      }
      {ideaDetail && Object.keys(ideaDetail).length <= 0 &&
        <ResponseInfo
          title="Fetching property data. Please wait for the response."
          responseImg="noRecord"
          responseClass="response-err eep_blank_message"
        />
      }
    </React.Fragment>
  );
}

export default FeedbackDetailViewInner;