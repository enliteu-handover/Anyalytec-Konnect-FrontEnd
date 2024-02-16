import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { REST_CONFIG, URL_CONFIG } from "../../constants/rest-config";
import { httpHandler } from "../../http/http-interceptor";
import { eepFormatDateTime } from "../../shared/SharedService";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import SocialWallLeftContent from "./SocialWallLeftContent";
import SocialWallMiddleContent from "./SocialWallMiddleContent";
import SocialWallRightContent from "./SocialWallRightContent";
import { pageLoaderHandler } from "../../helpers";

const SocialWall = () => {

  const [usersPic, setUsersPic] = useState([]);
  const [rankingLists, setRankingLists] = useState({});
  const [hastagList, setHastagList] = useState([]);
  const [socialWallList, setSocialWallList] = useState([]);
  const [heartAnimateState, setHeartAnimateState] = useState({});

  const dispatch = useDispatch();
  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    // {
    //   label: "RECOGNITION",
    //   link: "app/recognition",
    // },
    {
      label: "SOCIALWALL",
      link: "app/socialwall",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Social Wall",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  }, []);

  const fetchSocialWallUserList = async () => {
    const obj = {
      url: URL_CONFIG.SOCIALWALL_GET_USERLIST,
      method: "get"
    };
    await httpHandler(obj)
      .then((response) => {
        setRankingLists(response?.data);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const fetchAllUsers = async () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: "get"
    };
    await httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response?.data?.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push(
              {
                "id": item.id,
                "pic": item?.imageByte?.image
              }
            )
          }
        });
        setUsersPic(userPicTempArry);
      })
      .catch((error) => {
        console.log("ALLUSERS API error => ", error);
      });
  };

  const fetchHashTag = async () => {
    const obj = {
      url: URL_CONFIG.SOCIALWALL_HASTAG_LIST,
      method: "get"
    };
    await httpHandler(obj)
      .then((response) => {
        setHastagList(response.data);
      })
      .catch((error) => {
        console.log("SOCIALWALL_HASTAG_LIST API error => ", error);
      });
  };

  const fetchSocialWallList = async () => {
    const obj = {
      url: URL_CONFIG.SOCIALWALL_LIST,
      method: "get",
      params: {
        direction: "asc",
        //  pageSize: 100
        limit: 100
      }
    };
    //pageSize=2&pageNo=0&sortBy=createdAt&direction=desc
    await httpHandler(obj)
      .then((response) => {
        const data = response.data;
        data && data.length > 0 && data.map(res => {
          return res.createdAt = eepFormatDateTime(res.createdAt);
        });
        setSocialWallList(data);
        pageLoaderHandler('hide')
      })
      .catch((error) => {
        pageLoaderHandler('hide')
        console.log("SOCIALWALL_LIST API error => ", error);
      });
  };

  const likeStatus = (arg) => {
    let val = arg ?? { statee: false, id: 0 };
    setHeartAnimateState(val);
    return;
  }

  const likeSocialWallPostHandle = (arg) => {

    if (arg) {
      if (arg.isLike) {
        let obj = {
          url: URL_CONFIG.SOCIALWALL_LIKE,
          //  + "?id=" + arg.data.id,
          payload: { id: arg?.data?.id },
          method: "post",
          isLoader: false
        };
        httpHandler(obj).then(() => {
          fetchSocialWallSingleData({ id: arg.data.id, indx: arg.indx });
          likeStatus({ statee: arg.isLike, id: arg.data.id });
        })
          .catch((error) => {
            console.log("likeSocialWallPostHandle API error", error);
          });
      }
      if (!arg.isLike) {
        const userData = sessionStorage.userData ? JSON.parse(sessionStorage.userData) : {};
        let isLiked = arg.data.socialWallLike.findIndex(x => x.userId.user_id === userData.id);
        //   obj = {
        //     url: URL_CONFIG.SOCIALWALL_DISLIKE + "?id=" + arg?.data?.socialWallLike[isLiked]?.id,
        //     method: "delete",
        //     isLoader: false
        //   };
        // }
        // httpHandler(obj)
        axios.delete(`${REST_CONFIG.METHOD}://${REST_CONFIG.BASEURL}/api/v1${URL_CONFIG.SOCIALWALL_DISLIKE}` + "?id=" + arg?.data?.socialWallLike[isLiked]?.id
          // , { data: { id: arg?.data?.socialWallLike[isLiked]?.id } }
        )
          .then(() => {
            fetchSocialWallSingleData({ id: arg.data.id, indx: arg.indx });
            likeStatus({ statee: arg.isLike, id: arg.data.id });
          })
          .catch((error) => {

            console.log("likeSocialWallPostHandle API error", error);
          });
      }
    }
  };

  const fetchSocialWallSingleData = (arg) => {
    const obj = {
      url: URL_CONFIG.SOCIALWALL_SINGLE,
      method: "get",
      params: { id: arg.id },
      isLoader: false
    };
    httpHandler(obj)
      .then((response) => {
        const socialWallListTemp = JSON.parse(JSON.stringify(socialWallList));
        for (let i = 0; i < socialWallListTemp.length; i++) {
          if (i === arg.indx) {
            socialWallListTemp[i] = response.data;
            break;
          }
        }
        setSocialWallList([...socialWallListTemp]);
      })
      .catch((error) => {
        console.log("fetchSocialWallSingleData API error => ", error);
      });
  }

  const commentSocialWallPostHandle = (arg) => {
    if (arg) {

      if (arg.postSettings === 'postComment') {
        const payloadData = {
          message: arg.commentData,
          socialWall: {
            id: arg.data.id
          }
        };
        const obj = {
          url: URL_CONFIG.SOCIALWALL_COMMENT,
          method: "post",
          payload: payloadData
        };
        httpHandler(obj)
          .then((response) => {
            fetchSocialWallCommentDataBySocialID(arg);
          })
          .catch((error) => {
            console.log("commentSocialWallPostHandle API error => ", error.response.data);
          });
      }
      if (arg.postSettings === 'listComments') {
        fetchSocialWallCommentDataBySocialID(arg);
      }
      if (arg.postSettings === 'postReply') {
        const payloadData = {
          message: arg.commentData,
          parent: {
            id: arg.subData.id
          }
        };
        const obj = {
          url: URL_CONFIG.SOCIALWALL_REPLY,
          method: "post",
          payload: payloadData
        };
        httpHandler(obj)
          .then((response) => {
            arg.subData.commentState.typeCommentState = false;
            fetchSocialWallCommentDataBySocialID(arg);
          })
          .catch((error) => {
            console.log("commentSocialWallPostHandle API error => ", error.response.data);
          });
      }
    }
  }

  /*
  const getSubChildren = (arg, ret) => {
    for (var i = 0; i < arg.children.length; i++) {
      arg.children[i]['prentInfo'] = { id: arg.id, message: arg.message, createdBy: arg.createdBy };
 
      if (arg.children[i].createdAt) {
        arg.children[i].createdAt = eepFormatDateTime(arg.children[i].createdAt);
      }
      ret.push(arg.children[i]);
 
      if (arg.children[i].children.length) {
        getSubChildren(arg.children[i], ret);
      }
    }
    return ret;
  }
  */

  const fetchSocialWallCommentDataBySocialID = (arg) => {
    const obj = {
      url: URL_CONFIG.SOCIALWALL_COMMENT_LIST,
      method: "get",
      params: { id: arg.data.id }
    };
    httpHandler(obj)
      .then((response) => {
        const socialWallListTemp = JSON.parse(JSON.stringify(socialWallList));
        for (let i = 0; i < socialWallListTemp.length; i++) {
          if (i === arg.indx) {
            socialWallListTemp[i].wallComments = response.data;
            //socialWallListTemp[i].wallComments[i]['subChildren'] = getSubChildren(socialWallListTemp[i].wallComments[i], []);
            socialWallListTemp[i].commentState.typeCommentState = false;
            socialWallListTemp[i].commentState.listCommentState = true;
            break;
          }
        }
        setSocialWallList([...socialWallListTemp]);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
        console.log("List Comments API error => ", errMsg, error);
      });
  }

  useEffect(() => {
    fetchSocialWallUserList();
    fetchAllUsers();
    fetchHashTag();
    fetchSocialWallList();
    pageLoaderHandler('show')
  }, []);

  return (
    <React.Fragment>
      <div id="page-loader-container" className="d-none" style={{ zIndex: "1051" }}>
        <div id="loader">
          <img src={process.env.PUBLIC_URL + "/images/loader.gif"} alt="Loader" />
        </div>
      </div>
     { socialWallList.length > 0 && <div className="row eep-content-section-data">
        <div className="col-sm-12 col-xs-12 col-md-3 col-lg-3 position_sticky">
          {Object.keys(rankingLists).length > 0 &&
            <SocialWallLeftContent rankingLists={rankingLists} usersPicProps={usersPic} />
          }
        </div>
        <div className="col-sm-12 col-xs-12 col-md-6 col-lg-6 socialWall_div eep-content-section eep_scroll_y">
          {socialWallList && socialWallList.length > 0 &&
            <SocialWallMiddleContent socialWallList={socialWallList} usersPicProps={usersPic} likeSocialWallPostHandle={likeSocialWallPostHandle} commentSocialWallPostHandle={commentSocialWallPostHandle} likeStatus={heartAnimateState} />
          }
        </div>
        <div className="col-sm-12 col-xs-12 col-md-3 col-lg-3 socialWall_div eep-content-section eep_scroll_y">
          {hastagList && hastagList.length > 0 &&
            <SocialWallRightContent hastagList={hastagList} />
          }
        </div>
      </div>}
    </React.Fragment>
  );
};

export default SocialWall;
