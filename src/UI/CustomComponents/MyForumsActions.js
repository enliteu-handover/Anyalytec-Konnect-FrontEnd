import React from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

const MyForumsActions = (props) => {

  const { data, unPostForum, postForum, deleteForum, editForum, usersPic } = props;

  const eepHistory = useHistory();
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);

  const viewModeModal = (fData) => {
    setTimeout(() => {
      eepHistory.push('forumdetailview', { forumData: fData, usersPicData: usersPic });
    }, 10);
  };

  const unPostModeModal = (arg) => {
    unPostForum(arg);
  };

  const postModeModal = (arg) => {
    postForum(arg);
  };

  const deleteModeModal = (arg) => {
    deleteForum(arg);
  };

  const editModeModal = (arg) => {
    editForum(arg);
  };

  return (
    <React.Fragment>
      <div className="ans-type text-center c1">
        <span
          className="eep_kebab_btn"
          data-toggle="dropdown"
          aria-expanded="false"
          dangerouslySetInnerHTML={{
            __html: svgIcons && svgIcons.colon,
          }}
        ></span>

        <div className="eep-dropdown-menu dropdown-menu dropdown-menu-right shadow pt-4 pb-4">
          <a
            className="dropdown-item"
            onClick={() => editModeModal(data)}
          >
            Edit
          </a>
          {data.active &&
            <a
              className="dropdown-item"
              onClick={() => unPostModeModal(data)}
            >
              Unpost
            </a>
          }
          {!data.active &&
            <a
              className="dropdown-item"
              onClick={() => postModeModal(data)}
            >
              Post
            </a>
          }
          <a
            className="dropdown-item"
            onClick={() => deleteModeModal(data)}
          >
            Delete
          </a>
          <a
            className="dropdown-item"
            onClick={() => viewModeModal(data)}
          >
            View
          </a>
        </div>
      </div>

    </React.Fragment>
  );
};
export default MyForumsActions;
