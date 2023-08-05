import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import SortList from "../../UI/SortList";
import { eepFormatDateTime } from "../../shared/SharedService";

const FeedbackList = (props) => {

  const { feedbackListsData, usersPic, viewIdeaData, readIdeaData, markImportant, readAllIdeas, dateReceived } = props;
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const [ideaLists, setIdeaLists] = useState(feedbackListsData ? feedbackListsData : []);

  useEffect(() => {
    setIdeaLists(feedbackListsData);
  }, [feedbackListsData]);

  const viewIdea = (arg) => {
    viewIdeaData(arg);
  }

  const readIdea = (arg) => {
    readIdeaData(arg, false, true);
  }

  const unReadIdea = (arg) => {
    readIdeaData(arg, false, false);
  }

  const markImportantIdea = (arg) => {
    markImportant(arg, true);
  }

  const markUnimportantIdea = (arg) => {
    markImportant(arg, false);
  }

  let userPicIndex;
  const getUserPicture = (uID) => {
    userPicIndex = usersPic.findIndex(x => x.id === uID);
    return userPicIndex !== -1 ? usersPic[userPicIndex].pic : process.env.PUBLIC_URL + "/images/user_profile.png";
  }

  const readAllCommunicationsFromList = (arg) => {

    readAllIdeas(arg);
  }

  const dateReceivedOrder = (isSortState) => {
    dateReceived(isSortState);
  }

  return (
    <React.Fragment>
      <SortList
        readAllCommunicationsFromList={readAllCommunicationsFromList}
        communicationPostLists={feedbackListsData}
        dateReceivedOrder={dateReceivedOrder} />
      <div className="ideashorting_div">
        {ideaLists && ideaLists?.map((item, index) => {
          return (
            <div className={`ideabox-profile-container ideashorting_div_child ${item.feedBackIsRead ? "ideaMarkedAsRead" : ""} ${item.feedBackIsActive ? "idebox-active-navigation" : ""}`} key={"ideabox_" + index}>
              <div className="ideabox-profile-image c1" onClick={() => viewIdea(item)}>
                <div className="ideabox-profile-img-size rounded-circle" style={{ fontSize: 33 }}>{item?.logo}</div>
              </div>
              <div className="ideabox-font-style idea_box_heading ">
                <div className="ideabox_username_fav_div">
                  <div className="ideabox_descriptions_div c1" onClick={() => viewIdea(item)}>
                    <h5 className="ideabox-font-style ideabox_user_name_size">{item?.title}</h5>
                    <p className="ideabox-font-style ideabox-message-content-heading ideabox_truncate ideabox_contentt_size">{item?.show_as}</p>
                  </div>
                  <div className="funtional_parts" id="funtional_parts">
                    <div className="ideabox-star-position ">
                      {!item.feedBackIsImportant && <img src={`${process.env.PUBLIC_URL}/images/icons/static/StarDefault.svg`} className="ideabox-star-img-size c1" alt="Un Favorite" onClick={() => markImportantIdea(item)} />}
                      {item.feedBackIsImportant && <img src={`${process.env.PUBLIC_URL}/images/icons/static/StarFavourite.svg`} className="ideabox-star-img-size c1" alt="Favorite" onClick={() => markUnimportantIdea(item)} />}
                    </div>
                    {!item.feedBackIsActive &&
                      <div className="three_dot px-1">
                        <div className="dropdown c-c1c1c1 c1 eep_custom_dropdown">
                          <span className="eep_kebab_btn" data-toggle="dropdown" aria-expanded="false" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.eep_kebab }}></span>
                          <div className="dropdown-menu eep-dropdown-menu eep_custom_dropdown_bg" x-placement="bottom-start">
                            {!item.feedBackIsRead && <label className="eep-options-item dropdown-item mb-0 c1" onClick={() => readIdea(item)}>Mark as Read</label>}
                            {item.feedBackIsRead && <label className="eep-options-item dropdown-item mb-0 c1" onClick={() => unReadIdea(item)}>Mark as Unread</label>}
                            {!item.feedBackIsImportant && <label className="eep-options-item dropdown-item mb-0 c1" onClick={() => markImportantIdea(item)}>Mark as Important</label>}
                            {item.feedBackIsImportant && <label className="eep-options-item dropdown-item mb-0 c1" onClick={() => markUnimportantIdea(item)}>Mark as Unimportant</label>}
                          </div>
                        </div>
                      </div>
                    }

                  </div>
                </div>
                <div className="ideabox-font-style ideabox-date clicked_content">{eepFormatDateTime(item.createdAt)}</div>
              </div>
            </div>
          )
        })}
      </div>
    </React.Fragment>
  )
}

export default FeedbackList;