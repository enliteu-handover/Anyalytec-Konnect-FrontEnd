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

const SurveyCharts = (props) => {

  const {chartData} = props;
  const [showChart, setShowChart] = useState(true);

  useEffect(() => {
    setShowChart(false);
    setTimeout(() => {
      setShowChart(true);
    })
  },[chartData]);

  const initChartData = chartData ? chartData : {};

  return  <React.Fragment>
    {showChart && <HighchartsReact
      highcharts={Highcharts}
      constructorType={"chart"}
      options={initChartData}
    />}
  </React.Fragment>
 
}
export default SurveyCharts;