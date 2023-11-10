import React from "react";
import { useSelector } from "react-redux";
import SortList from "../../UI/SortList";
import { eepFormatDateTime } from "../../shared/SharedService";

const ForumList = (props) => {
  const { forumList, userImageArr, readForum, unReadForum, unFollowForum, followForum, readAll, dateReceived } = props;

  //console.log("forumList, props .. =>", props);

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = userImageArr.findIndex(x => x.id === uID);
    return userPicIndex !== -1 ? userImageArr[userPicIndex].pic : process.env.PUBLIC_URL + "/images/user_profile.png";
  }

  const readHandler = (arg) => {
    readForum(arg);
  }

  const unReadHandler = (arg) => {
    unReadForum(arg);
  }

  const followHandler = (arg) => {
    followForum(arg);
  }

  const unFollowingHandler = (arg) => {
    unFollowForum(arg);
  }

  const readAllList = (arg) => {
    readAll(arg)
  }

  const dateReceivedOrder = (isSortState) => {
    dateReceived(isSortState);
  }

  return (
    <React.Fragment>
      <SortList readAllCommunicationsFromList={readAllList} dateReceivedOrder={dateReceivedOrder} communicationPostLists={forumList} />
      <div className="forumshorting_div forumj_left_container_wrapper pr-1">
        {forumList && forumList.length > 0 && forumList.map((item, index) => {
          return (
            <div className={`eep_communication_container forumj_left_container forumshorting_div_child ${item.forumIsRead ? "eep_communication_container_forum_bg" : "unread_container_bordeer"}`} key={"forumList_" + index}>
              <div className="forum_profile_image forumj_redirect" onClick={() => readHandler({ fData: item, isRedirect: true })}>
                <img src={getUserPicture(item?.createdBy?.id)} alt="forum_profile_picture" className="rounded-circle forum_profile_image_size c1" />
              </div>
              <div className="forum_profile_content_parent_div">
                <div className="forum_profile_content_div">
                  <div className="forum_profile_content" onClick={() => readHandler({ fData: item, isRedirect: true })}>
                    <p className="forum_content_title forum_content_title_truncate c1">{item.title}</p>
                    <p className="forum_user_name c1">{item?.createdBy?.firstname + " " + item?.createdBy?.lastname}</p>
                  </div>
                  <div className="forum_actions_div d-flex">
                    {item.forumIsfollowing &&
                      <div className="forum_following_topics_img forumj_follow_img eep_forum_follow c1">
                        <img src={`${process.env.PUBLIC_URL}/images/icons/static/Follow.svg`} className="forum-eep-img-size" alt="Follow" title="Follow" />
                      </div>
                    }
                    <div className="forum_three_dot">
                      <div className="dropdown c-c1c1c1 c1 eep_custom_dropdown">
                        <span className="eep_kebab_btn" data-toggle="dropdown" aria-expanded="false" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.eep_kebab }}></span>
                        <div className="dropdown-menu eep-dropdown-menu eep_custom_dropdown_bg" x-placement="bottom-start">
                          {!item.forumIsRead && <label className="eep-options-item dropdown-item mb-0 c1" onClick={() => readHandler({ fData: item, isRedirect: false })}>Mark as Read</label>}
                          {item.forumIsRead && <label className="eep-options-item dropdown-item mb-0 c1" onClick={() => unReadHandler(item)}>Mark as Unread</label>}
                          {!item.forumIsfollowing && <label className="eep-options-item dropdown-item mb-0 c1" onClick={() => followHandler(item)}>Follow</label>}
                          {item.forumIsfollowing && <label className="eep-options-item dropdown-item mb-0 c1" onClick={() => unFollowingHandler(item)}>Unfollow</label>}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="forum_responce_container">
                  <div className="forum_responce">
                    <span className="forum_responce_commants">
                      {item.forumComments.length > 0 &&
                        <img src={`${process.env.PUBLIC_URL}/images/icons/static/Message.svg`} alt="commant-icon" className="forum-eep-img-size" />
                      }
                      {item.forumComments.length <= 0 &&
                        <img src={`${process.env.PUBLIC_URL}/images/icons/static/MessageDefault.svg`} alt="commant-icon" className="forum-eep-img-size" />
                      }
                      <span className="forum_responce_commants_counts "> {item.forumComments.length} {item.forumComments.length > 0 ? (item.forumComments.length === 1 ? "comment" : "comments") : "comment"}</span>
                    </span>
                    <span className="forum_responce_likes">
                      {item.forumLikes.length > 0 &&
                        <img src={`${process.env.PUBLIC_URL}/images/icons/static/Heart.svg`} alt="heart_icon" className="forum-eep-img-size" />
                      }
                      {item.forumLikes.length <= 0 &&
                        <img src={`${process.env.PUBLIC_URL}/images/icons/static/HeartDefault.svg`} alt="heart_icon" className="forum-eep-img-size" />
                      }
                      <span className="forum_responce_likes_counts "> {item.forumLikes.length} {item.forumLikes.length > 0 ? (item.forumLikes.length === 1 ? "like" : "likes") : "like"}</span>
                    </span>
                  </div>
                  <div className="forum_responce_posted_time">
                    <span className=""> {eepFormatDateTime(item.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}

      </div>
    </React.Fragment>
  )
}

export default ForumList;