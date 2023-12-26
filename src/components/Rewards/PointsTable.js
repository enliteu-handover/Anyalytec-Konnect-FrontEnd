import moment from "moment";
import React from "react";
import DisplayTypePoints from "../../UI/CustomComponents/DisplayTypePoints";
import TableComponent from "../../UI/tableComponent";

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
      header: "Reward",
      accessorKey: "name",
      component: "",
    },
    {
      header: "Type",
      accessorKey: "action",
      accessorFn: (row) => <DisplayTypePoints data={row} cSettings={CustomComponentSettings?.pointType} />,
    },
    {
      header: "Rewarded By",
      accessorKey: "createdBy.fullName",
    },
    {
      header: "Date",
      accessorKey: "createdAt",
      accessorFn: (row) => row.createdAt ? moment(row.createdAt).format('l') : '--',
    },
    // {
    //   header: "Src Type",
    //   accessorKey: "Src Type",
    // },
    {
      header: "Points",
      accessorKey: "points",
    },
  ];

  return (
    <React.Fragment >
      <div className="table-responsive eep_datatable_table_div p-3 mt-3" style={{ visibility: "visible" }}>
        <div id="user_dataTable_wrapper" className="dataTables_wrapper dt-bootstrap4 no-footer" style={{ width: "100%" }}>

          {/* {pointsList?.rewards && */}
          <TableComponent
            data={pointsList?.rewards ?? []}
            columns={PointsTableHeaders}
            actionHidden={true}
          />
          {/* } */}
        </div>
      </div>
    </React.Fragment >
  )
}

export default PointsTable;