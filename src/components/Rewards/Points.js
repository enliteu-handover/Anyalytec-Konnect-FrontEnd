import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import PageHeader from "../../UI/PageHeader";
import TypeBasedFilter from "../../UI/TypeBasedFilter";
import { TYPE_BASED_FILTER } from "../../constants/ui-config";
import AvailPoints from "./AvailPoints";
import PointsTable from "./PointsTable";
import { httpHandler } from "../../http/http-interceptor";
import { URL_CONFIG } from "../../constants/rest-config";

const Points = () => {

  const [pointsList, setPointsList] = useState({});
  const [filterParams, setFilterParams] = useState({});

  const dispatch = useDispatch();

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Rewards",
      link: "app/points",
    },
    {
      label: "Points",
      link: "app/points",
    },
  ];

  useEffect(() => {
    dispatch(
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr,
        title: "Points",
      })
    );
    return () => {
      BreadCrumbActions.updateBreadCrumb({
        breadcrumbArr: [],
        title: "",
      });
    };
  });

  const getFilterParams = (paramsData) => {
    if (Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    fetchPoints(paramsData);
  }

  const fetchPoints = (paramsInfo = {}) => {
    let obj;
    if (Object.getOwnPropertyNames(paramsInfo)) {
      obj = {
        url: URL_CONFIG.GET_POINTS,
        method: "get",
        params: paramsInfo
      };
    } else {
      obj = {
        url: URL_CONFIG.GET_POINTS,
        method: "get"
      };
    }
    httpHandler(obj)
      .then((response) => {
        setPointsList(response.data);
      })
      .catch((error) => {
        const errMsg = error.response?.data?.message;
        console.log("fetchPoints error", errMsg);
      });
  }

  useEffect(() => {
    fetchPoints();
  }, []);

  return (

    <React.Fragment>
      <PageHeader title={`My Enlite Points : ${pointsList?.totalPoints}`} filter={<TypeBasedFilter config={TYPE_BASED_FILTER} getFilterParams={getFilterParams} />} />
      <div className="row eep-content-start">
        <div className="col-md-3 myPointsLeft_div">
          <AvailPoints pointsList={pointsList} />
        </div>
        <div className="col-md-9 myPointsRight_div">
          <PointsTable pointsList={pointsList} />
        </div>
      </div>
    </React.Fragment>
  )
}

export default Points;