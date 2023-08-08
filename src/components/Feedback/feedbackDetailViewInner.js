import EmojiPicker, { Emoji, SuggestionMode } from 'emoji-picker-react';
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import ReactTooltip from "react-tooltip";
import ResponseInfo from "../../UI/ResponseInfo";
import { eepFormatDateTime } from "../../shared/SharedService";
import FeedbackDetailViewMore from "./more";



const FeedbackDetailViewInner = (props) => {

  const { ideaDetail, usersPic, handleCommand, likeAnIdea, likeAnIdeaChild, isDetailView } = props;

  const loggedUserData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};
  const [isDetailListMode, setIsDetailListMode] = useState(false);
  const [state, setState] = useState({
    more: null,
    openicon: false,
    childopenicon: null
  });

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPic.findIndex(x => x.id === uID);
    return userPicIndex !== -1 ? usersPic[userPicIndex].pic : process.env.PUBLIC_URL + "/images/user_profile.png";
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

  const onClearMore = () => {
    setState({ ...state, more: null })
  }

  const onClickEmoji = (emojiData, ideaDetail) => {
    setState({ ...state, openicon: false })
    likeAnIdeaHandler({ iData: ideaDetail, emojiData })
  }

  const onClickChildEmoji = (emojiData, ideaDetail) => {
    setState({ ...state, childopenicon: emojiData?.id })
    likeAnIdeaChild({ iData: ideaDetail, emojiData })
  }

  const renderChildComponent = (data, a) => {
    var padding = a + 6;
    return data && data?.children?.map((cmtData, index) => {
      return (
        <div className="ideaCommentLists ideaCommentListsChild ideaCommentListsChild-f p-2" key={"commentList_" + index}
          style={{ marginLeft: padding }}
        >
          {/* <div style={{
            width: padding,
            height: '1px',
            background: 'grey',
            marginTop: '12px'
          }}></div> */}
          <div>
            <div className="box-content mb-1">
              <img src={getUserPicture(cmtData?.createdBy.id)} alt="profile" className="rounded-circle ideabox-profile-img-size" />
              <div className="reply_user_name">
                <label className="mb-0">{cmtData?.createdBy?.firstname + " " + cmtData?.createdBy?.lastname}
                  &nbsp;<span style={{ fontSize: 11, color: "#717074" }}>{eepFormatDateTime(cmtData?.createdAt)}</span></label>
              </div>
            </div>
            <p className="eep_command_posts">{cmtData?.message}</p>
            {cmtData?.feedbackCommentAttach && cmtData?.feedbackCommentAttach.length > 0 &&
              <div className="eep_command_attachements">
                {cmtData?.feedbackCommentAttach.map((atthData, atthIndex) => {
                  return (
                    <div className="eep_command_attachements_inner_content" key={"cmdAtthList_" + atthIndex}>
                      <a href={atthData.docByte?.image} target="_thapa" download={atthData?.ideaAttachmentsFileName}>
                        <img src={atthData.docByte?.image ? atthData.docByte?.image
                          : fileTypeAndImgSrcArray['default']} className="image-circle c1 attach_img_sm" alt="icon" title={atthData?.ideaAttachmentsFileName} />
                      </a>
                    </div>
                  )
                })}
              </div>
            }
            <div className="item_blog_like_a_feedback text-left mb-2" style={{ display: "flex", alignItems: 'center' }}>

              <div style={{ height: "30px" }}>{cmtData?.forumCommentLikes && Object.keys(cmtData?.forumCommentLikes)?.map((v, i) => {
                return <>
                  <ReactTooltip
                    effect='solid'
                    id={`tooltip${i}${v}`}
                  >{cmtData?.forumCommentLikes?.[v]?.map(c => c?.username)?.join(', ')?.replaceAll(loggedUserData?.username, 'You')}</ReactTooltip>
                  <div
                    className="emoji"
                    data-tip data-for={`tooltip${i}${v}`}
                    onClick={(e) => {
                      onClickChildEmoji(
                        cmtData?.forumCommentLikes?.[v]?.find(c => c.emoji?.unified === v)?.emoji, cmtData)
                    }}
                  > <Emoji
                      unified={v}
                      size={16}
                    />{cmtData?.forumCommentLikes?.[v]?.map(v => v.username)?.length}</div>
                </>
              })}
              </div>
              <span className={"c1"} onClick={() => setState({ ...state, childopenicon: cmtData?.id === state?.childopenicon ? null : cmtData?.id })}>

                {state?.childopenicon === cmtData?.id && <EmojiPicker
                  onEmojiClick={(e) => onClickChildEmoji(e, cmtData)}
                  suggestedEmojisMode={SuggestionMode.RECENT}
                  skinTonesDisabled />}

                <img src={`${process.env.PUBLIC_URL}/images/Canvas.svg`} alt="like" className="post_heart"
                //  onClick={() => likeAnIdeaHandler({ isLike: true, iData: ideaDetail })}
                />
                &nbsp;React
              </span>&nbsp;
              ●&nbsp;<span
                className="text-left mb-0 eep_dt replay">{cmtData?.children?.length + (cmtData?.children?.length === 1 ?
                  ' Replay' : ' Replies')}</span>
              ●&nbsp;<span
                onClick={() => handleCommand(cmtData)}
                className="text-left mb-0 eep_dt replay">Replay</span>
            </div>

            {/* <span dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.view_reply_icon }} className="mr-2"></span> */}

            {renderChildComponent(cmtData, padding)}
          </div>
        </div>
      )
    })
  }

  return (
    <React.Fragment>
      {state?.more?.length > 0 && <FeedbackDetailViewMore data={state?.more} onClearMore={onClearMore} />}
      {ideaDetail && Object.keys(ideaDetail).length > 0 &&
        <React.Fragment>
          <div className="sticky-top right_profile_div_r right_profile_div_r-feed">
            <div className="ideabox-profile-expand-container ideabox-profile-expand-container-header">
              <div className="ideabox-profile-expand-container header-content-wrapperone align-items-center">
                <div className="rounded-circle" style={{ fontSize: 33 }}>{ideaDetail?.logo}</div>
                {/* <img src={getUserPicture(ideaDetail.createdBy.id)} alt="profile" className="rounded-circle" /> */}
                <div className="wrapper-one-content">
                  <div className="ideabox-font-style header-user-name font-helvetica-m">{ideaDetail?.title}</div>
                  <div className="header-user-destination ideabox_contentt_size">{ideaDetail?.category}</div>
                </div>
              </div>
              <div className="ideabox-profile-expand-inner-container header-content-wrapper-two">
                <div className="header-user-post-date ideabox_contentt_size ideabox-date">
                  {eepFormatDateTime(ideaDetail.createdAt)}
                </div>
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
                      <Link
                        to="#"
                        data-target="#collapseBirthday"
                        data-toggle="modal"
                        style={{ color: "#fff" }}
                        onClick={() => setState({ ...state, more: ideaDetail?.feedbackAttachmentFileName })}
                      >
                        {'+' + ideaDetail?.feedbackAttachmentFileName?.slice(3, ideaDetail?.feedbackAttachmentFileName?.length)?.length}
                      </Link>
                    </div>}
                  </div>
                </div>
              }
              <div className="item_blog_like_a_feedback text-left mb-2">

                <div style={{ display: "flex" }}>{ideaDetail?.feedbackLikes && Object.keys(ideaDetail?.feedbackLikes)?.map((v, i) => {
                  return <>
                    <ReactTooltip
                      effect='solid'
                      id={`tooltip${i}${v}`}
                    >{ideaDetail?.feedbackLikes?.[v]?.map(c => c?.username)?.join(', ')?.replaceAll(loggedUserData?.username, 'You')}</ReactTooltip>
                    <div
                      className="emoji"
                      data-tip data-for={`tooltip${i}${v}`}
                      onClick={(e) => {
                        onClickEmoji(
                          ideaDetail?.feedbackLikes?.[v]?.find(c => c.emoji?.unified === v)?.emoji, ideaDetail)
                      }}
                    > <Emoji
                        unified={v}
                        size={16}
                      />{ideaDetail?.feedbackLikes?.[v]?.map(v => v.username)?.length}</div>
                  </>
                })}
                </div>
                <div className="eep-dropdown-divider"></div>

                <div className='parent'>
                  <div>   <span className={"c1"} onClick={() => setState({ ...state, openicon: !state.openicon })}>

                    {state?.openicon && <EmojiPicker
                      onEmojiClick={(e) => onClickEmoji(e, ideaDetail)}
                      suggestedEmojisMode={SuggestionMode.RECENT}
                      skinTonesDisabled />}

                    <img src={`${process.env.PUBLIC_URL}/images/Canvas.svg`} alt="like" className="post_heart"
                    //  onClick={() => likeAnIdeaHandler({ isLike: true, iData: ideaDetail })}
                    />
                    &nbsp;React
                  </span>
                    <span className={"c1 c2"}
                      onClick={() => handleCommand()}>
                      <img src={`${process.env.PUBLIC_URL}/images/icons8-comments-50-2.svg`} alt="command" className="post_heart"
                      />
                      &nbsp;Comment   </span>
                  </div>
                  <div className='replay' onClick={() => {
                    setIsDetailListMode(!isDetailListMode)
                    handleCommand("replay", !isDetailListMode)
                  }} >{ideaDetail?.children?.length === 0 ? 'No ' : ideaDetail?.children?.length} {
                      ideaDetail?.children?.length === 1 ? 'Replay' : 'Replies'}</div>
                </div>
              </div>

              {isDetailListMode && ideaDetail?.children?.length > 0 &&
                <React.Fragment>
                  {renderChildComponent(ideaDetail, 0)}
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