import React, { useEffect, useState } from "react";
import Highcharts from "highcharts";
import HighchartsReact from "highcharts-react-official";
import highcharts3d from 'highcharts/highcharts-3d';
import cylinder from "highcharts/modules/cylinder";
import HC_more from 'highcharts/highcharts-more';
highcharts3d(Highcharts);
cylinder(Highcharts);
HC_more(Highcharts);
require("highcharts/modules/exporting")(Highcharts);

const DashboardCharts = (props) => {

  const {chartType, chartData} = props;
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    setShowChart(false);
    setTimeout(() => {
      setShowChart(true);
    })
  },[chartType]);

  const initChartData = chartData ? chartData : {};

  //console.log("DashboardCharts props", props)

  const chartOptions = {
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
        plotBands: [{
          from: 0,
          to: 60,
          color: '#DF5353', // red
          thickness: 20
        }, {
          from: 60,
          to: 160,
          color: '#DDDF0D', // yellow
          thickness: 20
        }, {
          from: 160,
          to: 200,
          color: '#55BF3B', // green
          thickness: 20
        }]
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
      series: [{
        data: [28, 12, 19, 22],
        colorByPoint: true
      }]
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
        },  {
          name: 'Explorer',
          y: 22
        },  {
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
        text: '2022',        
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
      series: [{
        name: 'E-Cards',
        data: [
          ['Birthday', 16],
          ['Anniversary', 12],
          ['Appreciation', 8],
          ['Seasonal', 8]
        ]
      }]
    }
  }

  return  <React.Fragment>
    {showChart && <HighchartsReact
      highcharts={Highcharts}
      constructorType={"chart"}
      //options={chartOptions[chartType]}
      //options={chartData}
      options={(initChartData && Object.keys(initChartData).length > 0) ? initChartData : chartOptions[chartType]}
    />}
 
  {/* <HighchartsReact
    highcharts={Highcharts}
    constructorType={"chart"}
    options={chartOptions.verticalBarChart}/> */}
  </React.Fragment>
 
}
export default DashboardCharts;