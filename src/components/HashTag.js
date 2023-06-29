import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import PageHeader from "../UI/PageHeader";
import { FILTER_CONFIG, BULK_ACTION } from "../constants/ui-config";
import Filter from "../UI/Filter";
import BulkAction from "../UI/BulkAction";
import { BreadCrumbActions } from "../store/breadcrumb-slice";
import { httpHandler } from "../http/http-interceptor";
import { URL_CONFIG } from "../constants/rest-config";
import HashColor from "../UI/CustomComponents/HashColor";
import HashColorActions from "../UI/CustomComponents/HashColorActions";
import ResponseInfo from "../UI/ResponseInfo";

const HashTag = () => {

  const dispatch = useDispatch();
  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const userRolePermission = useSelector((state) => state.sharedData.userRolePermission);

  const [responseMsg, checkResponseMsg] = useState("");
  const [responseClassName, checkResponseClassName] = useState("");
  const [hashTagID, setHashTagID] = useState("");
  const [hashTagValue, setHashTagValue] = useState("");
  const initColorValue = "#28accc";
  const [colorValue, setColorValue] = useState(initColorValue);
  const [hashTagActn, showHashTagActn] = useState(false);
  const [hashTagCreation, showHashTagCreation] = useState(false);
  const [hashTag, setHashTag] = useState([]);
  const [filterData, setFilterData] = useState([]);
  const [enableBulkState, setEnableBulkState] = useState({ bulkState: false });
  const [bulkUpdateBy, setBulkUpdateBy] = useState({ updateBy: null });
  const [filterBy, setFilterBy] = useState({ filter: true });

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Admin Panel",
      link: "app/adminpanel",
    },
    {
      label: "HashTag",
      link: "",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "HashTag",
      })
    );
  }, [breadcrumbArr, dispatch]);

  const toggleHanlder = (eve) => {
    checkResponseMsg("");
    setColorValue("");
    setHashTagValue("");
    setHashTagID("");
    showHashTagCreation((prevState) => !prevState);
    showHashTagActn(false);
  };

  const viewHashtagData = (argu) => {
    setHashTagValue(argu.hashtagName);
    setColorValue(argu.colorCode);
    setHashTagID(argu.id);
    showHashTagCreation(true);
    showHashTagActn(true);
    setTimeout(() => {
      document.getElementById("hastagTextarea").focus();
    }, 100);
  };

  const hashTagInputChangeHandler = (event) => {
    setHashTagValue(event.target.value);
  };

  const colorInputChangeHandler = (event) => {
    setColorValue(event.target.value);
  };

  const triggerColorPicker = () => {
    document.getElementById("hastagColor").click();
  };

  const fetchhashTag = (arg) => {
    checkResponseMsg("");
    const obj = {
      url: URL_CONFIG.ACTIVE_HASHTAG,
      method: "get",
      params: { active: arg },
    };
    httpHandler(obj)
      .then((hashTag) => {
        setHashTag(hashTag.data);
      })
      .catch((error) => {
        console.log("error", error.response);
      });
  };

  const addHashTagHandler = () => {
    debugger
    let payOptions = {
      hashtagName: hashTagValue,
      colorCode: colorValue,
      active: true,
    };
    checkResponseMsg("");

    if (!hashTagValue) {
      checkResponseMsg("Hashtag name is required!");
      checkResponseClassName("response-text response-err");
      return
    }

    const obj = {
      url: URL_CONFIG.ADDHASHTAG,
      method: "post",
      payload: payOptions,
    };
    httpHandler(obj)
      .then((response) => {
        setColorValue("");
        setHashTagValue("");
        setHashTagID("");
        const resMsg = response?.data?.message;
        checkResponseMsg(resMsg);
        showHashTagCreation(false);
        fetchhashTag(true);
      })
      .catch((error) => {
        console.log("errorrrr", error);
        const errMsg = error?.response?.data?.message;
        checkResponseMsg(errMsg);
        checkResponseClassName("response-text response-err");
      });
  };

  const cancelHashTagHandler = () => {
    checkResponseMsg("");
    setColorValue("");
    setHashTagValue("");
    setHashTagID("");
    showHashTagCreation((prevState) => !prevState);
  }

  const updateHashTagHandler = () => {

    let updatePayOptions = {
      id: hashTagID,
      hashtagName: hashTagValue,
      colorCode: colorValue,
      active: true,
    };

    checkResponseMsg("");

    if (!hashTagValue) {
      checkResponseMsg("Hashtag name is required!");
      checkResponseClassName("response-text response-err");
      return
    }

    const obj = {
      url: URL_CONFIG.ADDHASHTAG,
      method: "put",
      payload: updatePayOptions,
    };
    httpHandler(obj)
      .then((response) => {
        setColorValue("");
        setHashTagValue("");
        setHashTagID("");
        const resMsg = response?.data?.message;
        showHashTagCreation(false);
        fetchhashTag(true);
      })
      .catch((error) => {
        console.log("errorrrr", error);
        const errMsg = error?.response?.data?.message;
        checkResponseMsg(errMsg);
        checkResponseClassName("response-text response-err");
      });
  };

  useEffect(() => {
    fetchhashTag(filterBy.filter);
  }, []);

  const filterOnChangeHandler = (arg) => {
    if (arg) {
      setFilterBy({ filter: arg.value });
      fetchhashTag(arg.value);
    }
  };

  const onBulkActionChangeHandler = (arg) => {
    if (arg) {
      setBulkUpdateBy({ updateBy: arg.value });
    }
  };

  const enableFilterOptions = (e) => {
    setFilterData([]);
    const { checked } = e.target;
    setEnableBulkState({ bulkState: false });
    if (checked) {
      cancelHashTagHandler();
      setEnableBulkState({ bulkState: true });
    }
  };

  let temp = filterData;
  const filterAction = (event, arg) => {
    if (event.target.checked) {
      temp.push(arg.id);
      setFilterData([...temp]);
    } else {
      let popValueIndx = temp.indexOf(arg.id);
      temp.splice(popValueIndx, 1);
      setFilterData([...temp]);
    }
  }

  const bulkSubmitHandler = () => {
    if (filterData.length && (bulkUpdateBy.updateBy !== null)) {
      // let hashTagData = new FormData();
      // hashTagData.append('hashtag', filterData);
      // hashTagData.append('active', bulkUpdateBy.updateBy);
      // console.log("hashTagData :", hashTagData.getAll('hashtag'), hashTagData.getAll('active'));
      const obj = {
        url: URL_CONFIG.HASHTAG_BULK_UPDATE,
        method: "put",
        formData: {
          'hashtag': filterData,
          'active': bulkUpdateBy.updateBy
        },
      };
      httpHandler(obj)
        .then((response) => {
          console.log("bulkSubmitHandler response :", response);
          fetchhashTag(filterBy.filter);
          setEnableBulkState({ bulkState: false });
        })
        .catch((error) => {
          const errMsg = error.response?.data?.message !== undefined ? error.response?.data?.message : "Something went wrong contact administarator";
          console.log("bulkSubmitHandler error : ", errMsg);
        });
    }
  }

  return (
    <React.Fragment>
      {userRolePermission.adminPanel &&
        <React.Fragment>
          <PageHeader title="Hashtag" filter={<Filter config={FILTER_CONFIG} onFilterChange={filterOnChangeHandler} />}
            BulkAction={<BulkAction config={BULK_ACTION} onClickCheckbox={enableFilterOptions} onFilterChange={onBulkActionChangeHandler} checkBoxInfo={enableBulkState} bulkSubmitHandler={bulkSubmitHandler} />}
          />
          <div className="row mt-3 ">
            <div className="col-md-8 eep-add-hastag">
              <div className="form-group mb-0">
                <label className="font-helvetica-m c-404040 c1" htmlFor="hastagTextarea" onClick={(eve) => toggleHanlder(eve)}> {(hashTagCreation && hashTagActn) ? "Update Hashtag" : "Add Hashtag"}</label>
                <span className="ml-1" onClick={(eve) => toggleHanlder(eve)}>
                  {!hashTagCreation && (
                    <Link className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg" to="#" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.plus_sm, }}></Link>
                  )}
                  {hashTagCreation && (
                    <Link className="text-right c-c1c1c1 ml-2 my-auto eep_nav_icon_div eep_action_svg" to="#" dangerouslySetInnerHTML={{ __html: svgIcons && svgIcons.minus_sm, }}></Link>
                  )}
                </span>
              </div>
              {hashTagCreation && (
                <div className="align-items-center hastagTextarea d-flex">
                  <div className="flex-grow-1">
                    <input type="text" className="form-control field-wbr" id="hastagTextarea" name="hastagName" autoComplete="off" value={hashTagValue} onChange={hashTagInputChangeHandler} />
                  </div>
                  <div className="hasChooseClr c1" onClick={triggerColorPicker} style={{ borderColor: colorValue }}>
                    <div id="visualcolor" className="c1 hastagColor" onClick={triggerColorPicker} style={{ backgroundColor: colorValue }}></div>
                    <div>Choose Color</div>
                    <input type="color" id="hastagColor" className="eep_color_picker" value={colorValue} onChange={colorInputChangeHandler} />
                  </div>
                </div>
              )}
              {responseMsg && <p className={`ml-2 mt-2 text-center ${responseClassName}`}>{responseMsg}</p>}
              {hashTagCreation && !hashTagActn && (
                <div className="hastagSave justify-content-center mt-2 d-flex">
                  <button type="button" className="eep-btn eep-btn-cancel eep-btn-xsml mr-2" onClick={cancelHashTagHandler}>
                    Cancel
                  </button>
                  <button type="submit" className="eep-btn eep-btn-success eep-btn-xsml" onClick={addHashTagHandler}>
                    Save
                  </button>
                </div>
              )}
              {hashTagCreation && hashTagActn && (
                <div className="hastagSave justify-content-center mt-2 d-flex">
                  <button type="button" className="eep-btn eep-btn-cancel eep-btn-xsml mr-2 hastagcancel-btn" onClick={cancelHashTagHandler}>
                    Cancel
                  </button>
                  <button type="submit" className="eep-btn eep-btn-success eep-btn-xsml hastagsave-btn" onClick={updateHashTagHandler}>
                    Update
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="gride_view mt-3">
            <div className="gride_container gride_colum_template">
              {hashTag && hashTag.length > 0 && hashTag.map((item, index) => {
                return (
                  <div className="gride_container hashtag_modify position-relative" key={"hashtag_" + index}>
                    <div className="d-flex justify-content-between flex-column w-100">
                      <div className="font-weight-bold mb-2 d-flex justify-content-between">
                        <label className="mb-0">{item.hashtagName}</label>
                        {enableBulkState.bulkState &&
                          <div className="form-check">
                            <input className="form-check-input p_check_all badge-list" type="checkbox" id="badges_0" value="12" onChange={(event) => filterAction(event, item)} />
                          </div>
                        }
                      </div>
                      <HashColor data={item} />
                      <HashColorActions data={item} viewHashtagData={viewHashtagData} />
                    </div>
                  </div>
                )
              })
              }
            </div>
          </div>
        </React.Fragment>
      }
      {!userRolePermission.adminPanel &&
        <div className="row eep-content-section-data no-gutters">
          <ResponseInfo
            title="Oops! Looks illigal way."
            responseImg="accessDenied"
            responseClass="response-info"
            messageInfo="Contact Administrator."
          />
        </div>
      }
    </React.Fragment>
  );
};
export default HashTag;