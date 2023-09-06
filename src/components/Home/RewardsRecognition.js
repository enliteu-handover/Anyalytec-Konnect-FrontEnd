import React, { useEffect, useState } from "react";
// import { useDispatch } from "react-redux";
// import { BreadCrumbActions } from "../../store/breadcrumb-slice";
import Highcharts from "highcharts";
import PageHeader from "../../UI/PageHeader";
import TypeBasedFilter from "../../UI/TypeBasedFilter";
import { URL_CONFIG } from "../../constants/rest-config";
import { TYPE_BASED_FILTER_WITH_BETWEEN_DATES } from "../../constants/ui-config";
import { httpHandler } from "../../http/http-interceptor";
import DashboardCharts from "../Charts/DashboardCharts";

const RewardsRecognition = (props) => {
  // const dispatch = useDispatch();

  const { allUserDatas } = props;

  const [filterParams, setFilterParams] = useState({
    month: new Date().getMonth() + 1, year: new Date().getFullYear()
  });
  const [rrData, setRRData] = useState({});
  const initAllUserDatas = allUserDatas ? allUserDatas : [];
  const [loginChart, setLoginChart] = useState({});
  const [recognitionChart, setRecognitionChart] = useState({});
  const [ecardChart, setEcardChart] = useState({});
  const [certificateChart, setCertificateChart] = useState({});
  const [badgeChart, setBadgeChart] = useState({});
  const [awardChart, setAwardChart] = useState({});

  const defaultChartOptions = {
    login: {
      chart: {
        type: 'gauge',
        plotBackgroundColor: null,
        plotBackgroundImage: null,
        plotBorderWidth: 0,
        plotShadow: false,
        height: '80%'
      },
      title: {
        text: ''
      },
      pane: {
        startAngle: -90,
        endAngle: 89.9,
        background: null,
        center: ['50%', '75%'],
        size: '110%'
      },
      yAxis: {
        min: 0,
        max: 200,
        tickPixelInterval: 72,
        tickPosition: 'inside',
        tickColor: Highcharts.defaultOptions.chart.backgroundColor || '#FFFFFF',
        tickLength: 20,
        tickWidth: 2,
        minorTickInterval: null,
        labels: {
          distance: 20,
          style: {
            fontSize: '14px'
          }
        },
        plotBands: []
      },
      series: [{
        name: 'Logged IN',
        data: [80],
        tooltip: {
          valueSuffix: ''
        },
        dataLabels: {
          // format: '{y} Logged IN',
          format: 'Logged IN',
          borderWidth: 0,
          color: (
            Highcharts.defaultOptions.title &&
            Highcharts.defaultOptions.title.style &&
            Highcharts.defaultOptions.title.style.color
          ) || '#333333',
          style: {
            fontSize: '16px'
          }
        },
        dial: {
          radius: '80%',
          backgroundColor: 'gray',
          baseWidth: 12,
          baseLength: '0%',
          rearLength: '0%'
        },
        pivot: {
          backgroundColor: 'gray',
          radius: 6
        }
      }]
    },
    recognition: {
      chart: {
        renderTo: 'container',
        type: 'column',
        options3d: {
          enabled: true,
          alpha: 15,
          beta: 15,
          depth: 50,
          viewDistance: 25
        }
      },
      xAxis: {
        categories: ['E-Cards', 'Certificates', 'Badges', 'Awards']
      },
      yAxis: {
        title: {
          enabled: false
        }
      },
      tooltip: {
        headerFormat: '<b>{point.key}</b><br>',
        pointFormat: 'Recognition: {point.y}'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      legend: {
        enabled: false
      },
      plotOptions: {
        column: {
          depth: 25
        }
      },
      series: []
    },
    badge: {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45,
          beta: 0
        }
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      accessibility: {
        point: {
          valueSuffix: '%'
        }
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          depth: 35,
          dataLabels: {
            enabled: true,
            format: '{point.name}'
          }
        }
      },
      series: [{
        type: 'pie',
        name: 'Badge',
        data: [
          ['Explorer', 23],
          ['Leader', 18],
          {
            name: 'Innovation',
            y: 12,
            sliced: true,
            selected: true
          },
          ['Performer*', 9],
          ['Elite', 8],
          ['Team Changer', 30]
        ]
      }]
    },
    badge1: {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: ''
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
      },
      accessibility: {
        point: {
          valueSuffix: ''
        }
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          dataLabels: {
            enabled: false
          },
          showInLegend: true
        }
      },
      series: [{
        name: 'Badge',
        colorByPoint: true,
        data: [{
          name: 'Leader',
          y: 44,
          sliced: true,
          selected: true
        }, {
          name: 'Explorer',
          y: 22
        }, {
          name: 'Innovation',
          y: 4
        }, {
          name: 'Performer',
          y: 12
        }, {
          name: 'Elite',
          y: 2
        }, {
          name: 'Team Changer',
          y: 9
        }]
      }]
    },
    awards: {
      chart: {
        type: 'column'
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      xAxis: {
        categories: [
          'All Star',
          'Dark Knight',
          'Legendary',
          'Leviosa',
          'Omega',
          'Performer',
          'Picasso',
          'Premier',
          'Rockstar Rockie',
          'Super Squad',
          'Team Infinity',
          'Transformer'
        ],
        crosshair: true
      },
      yAxis: {
        title: {
          useHTML: true,
          // text: 'Million tonnes CO<sub>2</sub>-equivalents'
          text: ''
        }
      },
      tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
          '<td style="padding:0"><b>{point.y:.1f}</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
      },
      plotOptions: {
        column: {
          pointPadding: 0.2,
          borderWidth: 0
        }
      },
      series: [{
        name: 'Spot Awards',
        data: [13, 9, 7, 13, 14, 5, 3,
          8, 11, 4, 10, 12]

      }, {
        name: 'Nomination Awards',
        data: [12, 10, 11, 7, 11, 7, 9,
          0, 1, 4, 2, 6]

      }]
    },
    certificate: {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: 0,
        plotShadow: false
      },
      title: {
        // text: 'Browser<br>shares<br>January<br>2022',
        text: 'Certificates',
        align: 'center',
        verticalAlign: 'middle',
        y: 60
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}</b>'
      },
      accessibility: {
        point: {
          valueSuffix: ''
        }
      },
      plotOptions: {
        pie: {
          dataLabels: {
            enabled: true,
            distance: -50,
            style: {
              fontWeight: 'bold',
              color: 'white'
            }
          },
          startAngle: -90,
          endAngle: 90,
          center: ['50%', '75%'],
          size: '110%'
        }
      },
      series: [{
        type: 'pie',
        name: 'Certificate',
        innerSize: '50%',
        data: [
          ['Appreciation', 35],
          ['Excellence', 55],
          ['Achievement', 10]
        ]
      }]
    },
    ecards: {
      chart: {
        type: 'pie',
        options3d: {
          enabled: true,
          alpha: 45
        }
      },
      title: {
        text: ''
      },
      subtitle: {
        text: ''
      },
      plotOptions: {
        pie: {
          innerSize: 100,
          depth: 45
        }
      },
      series: []
    }
  }

  const breadcrumbArr = [
    {
      label: "Home",
      link: "app/dashboard",
    },
    {
      label: "Dashboard",
      link: "#",
    },
    {
      label: "Rewards & Recognition",
      link: "#",
    },
  ];

  // useEffect(() => {
  //   dispatch(
  //     BreadCrumbActions.updateBreadCrumb({
  //       breadcrumbArr,
  //       title: "Rewards & Recognition",
  //     })
  //   );
  //   return () => {
  //     BreadCrumbActions.updateBreadCrumb({
  //       breadcrumbArr: [],
  //       title: "",
  //     });
  //   };
  // }, []);

  const fetchRewardsRecognition = (paramsInfo) => {
    debugger
    let obj = {
      url: URL_CONFIG.REWARDS_RECOGNITION,
      method: "get"
    };
    if (Object.getOwnPropertyNames(paramsInfo)) {
      obj["params"] = paramsInfo;
    }
    httpHandler(obj).then((response) => {
      setRRData(response.data);
    }).catch((error) => {
      console.log("fetchRewardsRecognition API error", error);
    });
  }

  const getFilterParams = (paramsData) => {
    debugger
    if (Object.getOwnPropertyNames(filterParams)) {
      setFilterParams({ ...paramsData });
    } else {
      setFilterParams({});
    }
    fetchRewardsRecognition(paramsData);
  }

  useEffect(() => {
    debugger
    fetchRewardsRecognition(filterParams);
  }, []);

  useEffect(() => {
    debugger
    if (rrData && Object.keys(rrData)?.length) {
      // Login Chart Start
      let loginChartTemp = defaultChartOptions.login;
      loginChartTemp["yAxis"]["max"] = initAllUserDatas.length;
      let plotBandsArr = [];
      let plotBandsArrMaxLoop = 3;
      let colorTemp = ["#DF5353", "#DDDF0D", "#55BF3B"]
      for (let i = 0; i < plotBandsArrMaxLoop; i++) {
        let fromTemp = i === 0 ? 0 : Math.round((initAllUserDatas.length) / (plotBandsArrMaxLoop - (i - 1)));
        plotBandsArr.push({
          "from": fromTemp,
          "to": Math.round((initAllUserDatas.length) / (plotBandsArrMaxLoop - i)),
          "thickness": 20,
          "color": colorTemp[i]
        });
      }
      loginChartTemp["yAxis"]["plotBands"] = plotBandsArr;
      loginChartTemp["series"][0]["data"] = [rrData.loginUserCount];
      (rrData.loginUserCount > 0) ? setLoginChart({ ...loginChartTemp }) : setLoginChart({});
      // Login Chart End

      // Recognition Chart Start
      let recognitionChartTemp = defaultChartOptions.recognition;
      recognitionChartTemp["series"] = [{
        "data": [rrData.eCardsCount, rrData.certificateCount, rrData.badgeCount, rrData.awardCount],
        colorByPoint: true
      }];
      //setRecognitionChart({...recognitionChartTemp});
      (rrData.eCardsCount > 0 || rrData.certificateCount > 0 || rrData.badgeCount > 0 || rrData.awardCount > 0) ? setRecognitionChart({ ...recognitionChartTemp }) : setRecognitionChart({});
      // Recognition Chart End

      // E-Cards Chart Start
      let ecardsTemp = defaultChartOptions.ecards;
      ecardsTemp["series"] = [{
        name: 'E-Cards',
        data: [
          ['Birthday', rrData.birthdayECardsCount],
          ['Anniversary', rrData.anniversaryECardsCount],
          ['Appreciation', rrData.appreciationECardsCount],
          ['Seasonal', rrData.seasonalECardsCount]
        ]
      }];
      //setEcardChart({...ecardsTemp});
      (rrData.birthdayECardsCount > 0 || rrData.anniversaryECardsCount > 0 || rrData.appreciationECardsCount > 0 || rrData.seasonalECardsCount > 0) ? setEcardChart({ ...ecardsTemp }) : setEcardChart({});
      // E-Cards Chart End

      // Certificate Chart Start
      let certificateTemp = defaultChartOptions.certificate;
      //certificateTemp["title"]["text"] = "abcdef";
      certificateTemp["series"] = [{
        type: 'pie',
        name: 'Certificate',
        innerSize: '50%',
        data: Object.keys(rrData.categorizedCertificateCount).length > 0 ? Object.entries(rrData.categorizedCertificateCount) : []
      }];
      //setCertificateChart({...certificateTemp});
      (Object.keys(rrData.categorizedCertificateCount).length > 0) ? setCertificateChart({ ...certificateTemp }) : setCertificateChart({});
      // Certificate Chart End

      // Badge Chart Start
      let badgeTemp = defaultChartOptions.badge;
      badgeTemp["series"] = [{
        type: 'pie',
        name: 'Badge',
        data: Object.keys(rrData.categorizedBadgeCount).length > 0 ? Object.entries(rrData.categorizedBadgeCount) : []
      }];
      //setBadgeChart({...badgeTemp});
      (Object.keys(rrData.categorizedBadgeCount).length > 0) ? setBadgeChart({ ...badgeTemp }) : setBadgeChart({});
      // Badge Chart End

      // Award Chart Start
      let awardTemp = defaultChartOptions.awards;
      awardTemp["xAxis"] = {
        crosshair: true,
        categories: Object.keys(rrData.categorizedBadgeCount).length > 0 ? Object.keys(rrData.categorizedBadgeCount) : []
      }
      let spotAwardArr = [];
      let nomiAwardArr = [];
      Object.keys(rrData["categorizedAwardCount"]).forEach(function (key) {
        spotAwardArr.push(rrData["categorizedAwardCount"][key]["spotCount"]);
        nomiAwardArr.push(rrData["categorizedAwardCount"][key]["nomiCount"]);
      });
      awardTemp["series"] = [{
        name: 'Spot Awards',
        data: spotAwardArr
      }, {
        name: 'Nomination Awards',
        data: nomiAwardArr
      }];
      //setAwardChart({...awardTemp});
      (Object.keys(rrData["categorizedAwardCount"]).length > 0) ? setAwardChart({ ...recognitionChartTemp }) : setAwardChart({});
      // Award Chart End

    }

    return () => {
      setLoginChart({});
      setRecognitionChart({});
      setEcardChart({});
      setCertificateChart({});
      setBadgeChart({});
      setAwardChart({});
    }

  }, [rrData]);

  return (
    <React.Fragment>
      <PageHeader title="Rewards & Recognition" filter={<TypeBasedFilter config={TYPE_BASED_FILTER_WITH_BETWEEN_DATES} getFilterParams={getFilterParams} />} />
      <div className="py-4">
        <div className="row m-0" id="content-start">
          <div className="col-md-12">

            {/* <!-- Layer 1 START --> */}
            <div className="d_rewards_recog_div">
              <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                <div className="card border-left-primary shadow h-100 py-0">
                  <div className="card-body p-3">
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="mb-2 text-uppercase">Users (Logged in)</div>
                        <div className="d_recog_count">
                          <p className="mb-0 text-primary">{rrData ? rrData?.loginUserCount : 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                <div className="card eep-border-left-succ shadow h-100 py-0">
                  <div className="card-body p-3">
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="mb-2 text-uppercase">Recognition</div>
                        <div className="d_recog_count">
                          <p className="mb-0 eep-text-succ">{rrData ? rrData?.recognitionTotal : 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                <div className="card eep-border-left-info shadow h-100 py-0">
                  <div className="card-body p-3">
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="mb-2 text-uppercase">E-Cards</div>
                        <div className="d_recog_count">
                          <p className="mb-0 eep-text-info">{rrData ? rrData?.eCardsCount : 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                <div className="card eep-border-left-warn shadow h-100 py-0">
                  <div className="card-body p-3">
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="mb-2 text-uppercase">Certificates</div>
                        <div className="d_recog_count">
                          <p className="mb-0 eep-text-warn">{rrData ? rrData?.certificateCount : 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                <div className="card eep-border-left-primary shadow h-100 py-0">
                  <div className="card-body p-3">
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="mb-2 text-uppercase">Awards</div>
                        <div className="d_recog_count">
                          <p className="mb-0 eep-text-primary">{rrData ? rrData?.awardCount : 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-xs-12 col-md-4 col-lg-3 col-xl-2 d_rewards_dtls">
                <div className="card eep-border-left-light-grey shadow h-100 py-0">
                  <div className="card-body p-3">
                    <div className="row no-gutters align-items-center">
                      <div className="col">
                        <div className="mb-2 text-uppercase">Badges</div>
                        <div className="d_recog_count">
                          <p className="mb-0 eep-text-light-grey">{rrData ? rrData?.badgeCount : 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* <!-- Layer 1 END --> */}

            <div className="row">
              <div className="col-md-6 d_charts_div row_col_div">
                <div className="bg-white shadow br-15 h-100">
                  <div className="p-3">
                    <label className="d_sect_lbl">Logged IN</label>
                    {Object.keys(loginChart).length > 0 &&
                      <DashboardCharts chartType="login" chartData={loginChart} />
                    }
                    {Object.keys(loginChart).length <= 0 &&
                      <div className="parent_div">
                        <div className="eep_blank_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/static/noData.svg"} alt="no-data-icon" />
                          <p className="eep_blank_quote">No record found</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="col-md-6 d_charts_div row_col_div">
                <div className="bg-white shadow br-15 h-100">
                  <div className="p-3">
                    <label className="d_sect_lbl">Overall Recognition</label>
                    {Object.keys(recognitionChart).length > 0 &&
                      <DashboardCharts chartType="recognition" chartData={recognitionChart} />
                    }
                    {Object.keys(recognitionChart).length <= 0 &&
                      <div className="parent_div">
                        <div className="eep_blank_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/static/noData.svg"} alt="no-data-icon" />
                          <p className="eep_blank_quote">No record found</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="col-md-6 d_charts_div row_col_div">
                <div className="bg-white shadow br-15 h-100">
                  <div className="p-3">
                    <label className="d_sect_lbl">E-Cards</label>
                    {Object.keys(ecardChart).length > 0 &&
                      <DashboardCharts chartType="ecards" chartData={ecardChart} />
                    }
                    {Object.keys(ecardChart).length <= 0 &&
                      <div className="parent_div">
                        <div className="eep_blank_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/static/noData.svg"} alt="no-data-icon" />
                          <p className="eep_blank_quote">No record found</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="col-md-6 d_charts_div row_col_div">
                <div className="bg-white shadow br-15 h-100">
                  <div className="p-3">
                    <label className="d_sect_lbl">Certificates</label>
                    {Object.keys(certificateChart).length > 0 &&
                      <DashboardCharts chartType="certificate" chartData={certificateChart} />
                    }
                    {Object.keys(certificateChart).length <= 0 &&
                      <div className="parent_div">
                        <div className="eep_blank_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/static/noData.svg"} alt="no-data-icon" />
                          <p className="eep_blank_quote">No record found</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="col-md-6 d_charts_div row_col_div">
                <div className="bg-white shadow br-15 h-100">
                  <div className="p-3">
                    <label className="d_sect_lbl">Badges</label>
                    {Object.keys(badgeChart).length > 0 &&
                      <DashboardCharts chartType="badge" chartData={badgeChart} />
                    }
                    {Object.keys(badgeChart).length <= 0 &&
                      <div className="parent_div">
                        <div className="eep_blank_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/static/noData.svg"} alt="no-data-icon" />
                          <p className="eep_blank_quote">No record found</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>
              <div className="col-md-6 d_charts_div row_col_div">
                <div className="bg-white shadow br-15 h-100">
                  <div className="p-3">
                    <label className="d_sect_lbl">Awards</label>
                    {Object.keys(awardChart).length > 0 &&
                      <DashboardCharts chartType="awards" chartData={awardChart} />
                    }
                    {Object.keys(awardChart).length <= 0 &&
                      <div className="parent_div">
                        <div className="eep_blank_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/static/noData.svg"} alt="no-data-icon" />
                          <p className="eep_blank_quote">No record found</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div>

              {/* <div className="col-md-6 d_charts_div row_col_div">
                <div className="bg-white shadow br-15 h-100">
                  <div className="p-3">
                    <label className="d_sect_lbl">Rewards</label>
                    {true && 
                      <DashboardCharts chartType="login"/>
                    }
                    {false &&
                      <div className="parent_div">
                        <div className="eep_blank_div">
                          <img src={process.env.PUBLIC_URL + "/images/icons/static/noData.svg"} alt="no-data-icon" />
                          <p className="eep_blank_quote">No record found</p>
                        </div>
                      </div>
                    }
                  </div>
                </div>
              </div> */}

            </div>

          </div>
        </div>
      </div>
    </React.Fragment>
  );
};
export default RewardsRecognition;
