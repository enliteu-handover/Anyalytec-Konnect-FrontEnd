import React, { useEffect, useState } from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";
import PageHeader from "../../UI/PageHeader";
import Table from "../../UI/Table";
import NomineesInfo from "../../UI/CustomComponents/NomineesInfo";
import NominatedAwards from "./NominatedAwards";

const Nominations = () => {

  const svgIcons = useSelector((state) => state.sharedData.svgIcons);
  const [nominatedList, setNominatedList] = useState([]);
  const [awardList, setAwardList] = useState([]);

  let userPicIndex;
  const getUserPicture = (picDataArr, uID) => {
    userPicIndex = picDataArr.findIndex(x => x.id === uID);
    return userPicIndex !== -1 ? picDataArr[userPicIndex].pic : process.env.PUBLIC_URL + "/images/user_profile.png";
  }

  const fetchAllUsers = () => {
    const obj = {
      url: URL_CONFIG.ALL_USER_DETAILS_FILTER_RESPONSE,
      method: "get"
    };
    httpHandler(obj)
      .then((response) => {
        let userPicTempArry = [];
        response.data.map((item) => {
          if (item?.imageByte?.image) {
            userPicTempArry.push(
              {
                "id": item.id,
                "pic": item?.imageByte?.image
              }
            )
          }
        });
        fetchNomineeData(userPicTempArry);
      })
      .catch((error) => {
        console.log("ALLUSERS API error => ", error);
      });
  };

  const fetchNomineeData = (picDatas) => {
    const obj = {
      url: URL_CONFIG.NOMINATIONS_LIST,
      method: "get",
    };
    httpHandler(obj)
      .then((nominatedLists) => {
        let usersInfo = [];
        let awardsInfo = [];
        nominatedLists.data && nominatedLists.data.length && nominatedLists.data.map((lists) => {
          lists?.nominated && lists?.nominations?.length && lists?.nominations.map((users) => {
            users.userId.pic = getUserPicture(picDatas, users.userId.id);
            return usersInfo.push({ userData: users, listData: lists });
          });
          return awardsInfo.push(lists);
        });
        setAwardList(awardsInfo);
        setNominatedList(usersInfo);
      })
      .catch((error) => {
        console.log("error", error);
        //const errMsg = error.response?.data?.message;
      });
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);


  const nominatedTableHeaders = [
    {
      fieldLabel: "Nominees",
      fieldValue: "action",
      component: <NomineesInfo />,
    },
    {
      fieldLabel: "Team",
      fieldValue: "listData.nominatorId.department.name",
    },
    {
      fieldLabel: "Award",
      fieldValue: "listData.award.name",
    },
    {
      fieldLabel: "Won",
      fieldValue: "listData.award.points",
    },
  ];

  const filterTable = (aLists) => {
    if (aLists.isData) {
      let usersInfo = [];
      aLists.aValues.nominated && aLists.aValues.nominations.length && aLists.aValues.nominations.map((users) => {
        return usersInfo.push({ userData: users, listData: aLists.aValues });
      });
      setNominatedList(usersInfo);
    }
    if (!aLists.isData) {
      fetchAllUsers();
    }
  }

  return (
    <React.Fragment>
      <PageHeader title="Awards and Nominated" />
      <div className="row eep-award-approval eep-content-start" id="content-start">
        <div className="col-md-7 col-lg-7 col-xl-8 col-sm-12 nm_lcol_div">
          <div className="table-responsive eep_datatable_table_div p-2 mt-3" style={{ visibility: "visible", overflowX: "hidden" }}>
            <div id="awardApprovalDatatable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer">
              {nominatedList && (
                <Table component="userManagement" headers={nominatedTableHeaders} data={nominatedList}
                  tableProps={{
                    classes: "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
                    id: "user_dataTable", "aria-describedby": "user_dataTable_info",
                  }}
                  action={null}
                ></Table>
              )}
            </div>
          </div>
        </div>
        <div className="col-md-5 col-lg-5 col-xl-4 col-sm-12 nm_rcol_div">
          {awardList && awardList.length > 0 &&
            <NominatedAwards awardList={awardList} filterTable={filterTable} />
          }
        </div>
      </div>
    </React.Fragment>
  );
};

export default Nominations; 