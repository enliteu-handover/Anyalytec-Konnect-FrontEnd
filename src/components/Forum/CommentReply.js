import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const CommentReply = (props) => {

  const { toggleReplyState, forumData, closeReply, getUserPicture, clickCommentReplySubmitHandler, updateCommentReplyHandler } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const currentUserData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};
  const [forumCommentReply, setForumCommentReply] = useState("");
  const maxTextAreaLength = 255;

  useEffect(() => {
    setForumCommentReply("");
    if (toggleReplyState.isToggle) {
      if (toggleReplyState.type === "edit") {
        setForumCommentReply(toggleReplyState.cmtData.message);
      }
      setTimeout(() => {
        document.getElementById("forumReplyTextArea").focus();
      }, 0);
    }
  }, [toggleReplyState]);

  const OnChangeForumCommentReply = (e) => {
    setForumCommentReply(e.target.value);
  }

  return (
    <div className="forum_reply_message forum_append_class_container">
      <div className="forum_profile_container" style={{ border: "0px" }}>
        <div className="forum_profile_image">
          <img src={getUserPicture(currentUserData.id)} alt="forum_profile_picture" className="rounded-circle forum_profile_image_size" />
        </div>
        <div className="forum_profile_content">
          <p className="forum_user_name mb-0">{
            ((currentUserData?.firstName ?? '') + ' ' + (
              currentUserData?.lastName ?? ''
            ))}</p>
          <p className="forum_nofpostes mb-0" style={{ fontSize: "12px" }}><i>Reply to - {toggleReplyState.cmtData.message}</i></p>
        </div>
      </div>
      <div className="eep-dropdown-divider pb-1"></div>
      <div className="forumMainTopicreplyTextArea">
        <div className="replyTextArea px-3">
          <textarea id="forumReplyTextArea" className="eep_scroll_y" rows="3" value={forumCommentReply} maxLength={maxTextAreaLength} col="50" onChange={(event) => OnChangeForumCommentReply(event)}></textarea>
        </div>
        <div className="d-flex align-items-center justify-content-between px-3">
          <span id="rchars">{forumCommentReply.length}/{maxTextAreaLength}</span>
          {toggleReplyState.type === "new" &&
            <div
              className={`${forumCommentReply.length > 0 ? "eep_post_icon c1" : ""}`}
              onClick={() => clickCommentReplySubmitHandler(forumData, toggleReplyState.cmtData, forumCommentReply)}
            >
              <span dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.send_icon }}></span>
            </div>
          }
          {toggleReplyState.type === "edit" &&
            <div
              className={`${forumCommentReply.length > 0 ? "eep_post_icon c1" : ""}`}
              onClick={() => updateCommentReplyHandler(forumCommentReply, toggleReplyState.cmtData, forumData)}
            >
              <span dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.send_icon }}></span>
            </div>
          }
        </div>
      </div>
      <div className="forumRplayClose c1" onClick={() => closeReply()}>
        <i className="fa fa-times" aria-hidden="true"></i>
      </div>
    </div>
  )
}

export default CommentReply;