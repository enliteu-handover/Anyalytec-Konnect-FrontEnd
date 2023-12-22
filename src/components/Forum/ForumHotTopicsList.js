import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { eepFormatDateTime } from "../../shared/SharedService";

const ForumHotTopicsList = (props) => {

	const {forumList, usersPic} = props;

  const eepHistory = useHistory();
  const initForumList = forumList ? forumList : [];
  const [hotForumList, setHotForumList] = useState([]);
  const hotForumMaxCommentList = 5;
  const hotForumMaxList = 5;

  useEffect(() => {
    if(initForumList && initForumList.length > 0) {
      let hotForumList = [];
      let ak = 1;
      initForumList && initForumList.length > 0 && initForumList.sort((a, b) => (a.forumComments.length < b.forumComments.length) ? 1 : -1).map((hotData) => {
        if(hotData.forumComments.length > hotForumMaxCommentList && ak <= hotForumMaxList) {
          hotForumList.push(hotData);
          ak++;
          return [hotForumList, ak];
        }
      });
      setHotForumList([...hotForumList]);
    }
  }, [initForumList]);

  let userPicIndex;
	const getUserPicture = (uID) => {
		userPicIndex = usersPic.findIndex(x => x.id === uID);
		return userPicIndex !== -1 ? usersPic[userPicIndex].pic : process.env.PUBLIC_URL + "/images/user_profile.png";
	}

  const viewForumDetail = (arg) => {
    eepHistory.push('forumdetailview', { forumData: arg, usersPicData: usersPic });
  }

	return (
		<div className="hot_comments">
      {hotForumList && hotForumList.length > 0 && hotForumList.map((fData, index) => {
        return (
          <div className="forum_right_side_container forumj_right_container c1" key={"hotTopics_"+index}>
            <div className="forum_right_side_inner">
              <div className="forum_profile_image">
                <Link to="#">
                  <img src={getUserPicture(fData.createdBy.id)} alt="User Pic" title={fData.createdBy?.firstname + " " +fData.createdBy?.lastname} className="rounded-circle forum_profile_image_size" />
                </Link>
              </div>
              <div className="forum_profile_content">
                <p className="forum_content_title forum_content_title_truncate" onClick={() => viewForumDetail(fData)}>{fData.title}</p>
                <Link to="#" className="a_hover_txt_deco_none">
                  <p className="forum_user_name">{fData.createdBy?.firstname + " " +fData.createdBy?.lastname}</p>
                </Link>
                <div className="forum_responce_container_hot" onClick={() => viewForumDetail(fData)}>
                  <div>
                    <div className="forum_responce_commants forum_responce d-md-inline-block mr-3">
                      {fData.forumComments.length > 0 &&
                        <img src={`${process.env.PUBLIC_URL}/images/icons/static/Message.svg`} alt="commant-icon" className="forum-eep-img-size" />
                      }
                      {fData.forumComments.length <= 0 &&
                        <img src={`${process.env.PUBLIC_URL}/images/icons/static/MessageDefault.svg`} alt="commant-icon" className="forum-eep-img-size" />
                      }
                      <span className="forum_responce_commants_counts "> {fData.forumComments.length} {fData.forumComments.length > 0 ? (fData.forumComments.length === 1 ? "comment" : "comments") : "comment"}</span>
                    </div>
                    <div className="forum_responce_likes forum_responce  d-md-inline-block">
                      {fData.forumLikes.length > 0 &&
                        <img src={`${process.env.PUBLIC_URL}/images/icons/static/Heart.svg`} alt="heart_icon" className="forum-eep-img-size" />
                      }
                      {fData.forumLikes.length <= 0 &&
                        <img src={`${process.env.PUBLIC_URL}/images/icons/static/HeartDefault.svg`} alt="heart_icon" className="forum-eep-img-size" />
                      }
                      <span className="forum_responce_likes_counts "> {fData.forumLikes.length} {fData.forumLikes.length > 0 ? (fData.forumLikes.length === 1 ? "like" : "likes") : "like"}</span>
                    </div>
                  </div>
                  <div className="forum_responce_posted_time">
                    <span className=""> {eepFormatDateTime(fData.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
			

		</div>
	);

}

export default ForumHotTopicsList;