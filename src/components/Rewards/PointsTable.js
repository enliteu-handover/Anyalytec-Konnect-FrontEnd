import React from "react";
import Table from "../../UI/Table";
import DateFormatDisplay from "../../UI/CustomComponents/DateFormatDisplay";
import DisplayTypePoints from "../../UI/CustomComponents/DisplayTypePoints";

const PointsTable = (props) => {

  const { pointsList } = props;

  const CustomComponentSettings = {
    date: {
      classnames: "",
      objReference: "createdAt"
    },
    pointType: {
      classnames: "",
      objReference: "type",
      typeArr: [
        {
          type: 1,
          textDisplay: "BADGE"
        },
        {
          type: 2,
          textDisplay: "CERTFICATE"
        },
        {
          type: 3,
          textDisplay: "AWARD"
        },
        {
          type: 4,
          textDisplay: "ECARD"
        },
        {
          type: 5,
          textDisplay: "AWARD"
        },
      ]
    }
  };

  const PointsTableHeaders = [
    {
      fieldLabel: "Reward",
      fieldValue: "name",
      component: "",
    },
    {
      fieldLabel: "Type",
      fieldValue: "action",
      component: <DisplayTypePoints cSettings={CustomComponentSettings.pointType} />,
    },
    {
      fieldLabel: "Rewarded By",
      fieldValue: "createdBy.fullName",
      component: "",
    },
    {
      fieldLabel: "Date",
      fieldValue: "action",
      component: <DateFormatDisplay cSettings={CustomComponentSettings.date} />,
    },
    {
      fieldLabel: "Src Type",
      fieldValue: "",
      component: "",
    },
    {
      fieldLabel: "Points",
      fieldValue: "points",
      component: "",
    },
  ];

  return (
    <React.Fragment >
      <div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }}>
        <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>
          <Table component="Points" headers={PointsTableHeaders} data={pointsList.rewards}
            tableProps={{
              classes: "table stripe eep_datatable_table eep_datatable_table_spacer dataTable no-footer",
              id: "user_dataTable", "aria-describedby": "user_dataTable_info",
            }}
            action={null}
          ></Table>
        </div>
      </div>
    </React.Fragment >
  )
}

export default PointsTable;