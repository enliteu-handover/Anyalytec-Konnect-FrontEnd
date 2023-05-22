import React, { useState } from "react";
import classes from "./Table.module.scss";
const Table = (props) => {
  const tableClasses = props?.tableProps ? props.tableProps.classes : "";

  const tableId = props?.tableProps ? props.tableProps.tableId : "";

  const [tableHeaders, setTableHeaders] = useState(
    props.headers ? props.headers : []
  );
  const tableData = props.data ? props.data : [];
  const sortFieldName = "";
  let currentSort = "default";
  const sortTypes = {
    up: {
      class: "sort-up",
      fn: (a, b) => a[sortFieldName] - b[sortFieldName],
    },
    down: {
      class: "sort-down",
      fn: (a, b) => b[sortFieldName] - a[sortFieldName],
    },
    default: {
      class: "sort",
      fn: (a, b) => a,
    },
  };

  const onSortChange = (thead) => {
    const tHeaders = [...tableHeaders];
    // tHeaders.map((field) => (field.sortType = null));
    tHeaders.map((field) => {
      if (field.fieldValue === thead.fieldValue) {
        if (!field.sortType) {
          field.sortType = "asc";
        } else if (field.sortType === "asc") {
          field.sortType = "desc";
        } else if (field.sortType === "desc") {
          field.sortType = "asc";
        }
      } else {
        field.sortType = null;
      }
      return field;
    });
    setTableHeaders(tHeaders);
  };

  const loadData = (data, fieldName) => {
    const entries = fieldName.split(".");
    let value = Object.assign({}, data);

    for (const field of entries) {
      if (value[field]) {
        value = value[field];
      } else {
        return null;
      }
    }
    return value;
  };

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-sm-12 col-md-6">
          <div className="dt-buttons btn-group flex-wrap">
            <button
              className="btn btn-secondary buttons-copy buttons-html5"
              aria-controls="user_dataTable"
              type="button"
            >
              <span>Copy</span>
            </button>
            <button
              className="btn btn-secondary buttons-excel buttons-html5"
              aria-controls="user_dataTable"
              type="button"
            >
              <span>Excel</span>
            </button>
            <button
              className="btn btn-secondary buttons-pdf buttons-html5"
              aria-controls="user_dataTable"
              type="button"
            >
              <span>PDF</span>
            </button>
          </div>
        </div>
        <div className="col-sm-12 col-md-6 text-right">
          <div id="user_dataTable_filter" className={"filter_"+classes.dataTables_filter}>
            <label>
              <div className="input-group">
                <input
                  type="search"
                  className="form-control form-control-sm"
                  placeholder="Search..."
                  aria-controls="user_dataTable"
                />
                <div className="input-group-addon" style={{ right: "0px" }}>
                  <img src={process.env.PUBLIC_URL + `/images/icons/static/search.svg`} alt="Search" />
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>

      <table
        className={`${tableClasses} table ${classes.dataTable}`}
        id={tableId}
      >
        <thead>
          <tr role="row">
            {tableHeaders.length &&
              tableHeaders.map((thead,indx) => (
                <th
                  className={
                    thead.fieldValue !== "action" ? `${thead.sortType === "asc" ? "sorting_asc" : thead.sortType === "desc" ? "sorting_desc" : "sorting" }` : "eepAction_th"
                  }
                  //key={thead.fieldValue}
                  key={"thData_"+indx}
                  onClick={() => onSortChange(thead)}
                >
                  {thead.fieldLabel}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {tableData.length > 0 &&
            tableData.map((data, index) => {
              return (
                <tr
                  className={index % 2 === 0 ? "odd" : "even"}
                  //key={`${index}_row`}
                  key={"row_"+index}
                >
                  {tableHeaders.map((thead, ind) => {
                    // thead.fieldValue && thead.fieldValue === "action" ? (
                    //   props.component === "userManagement" && (
                    //     <td key={`${ind}_column`}>
                    //       <UserManagementActionDropdown id={data.id} />
                    //     </td>
                    //   )
                    // ) :
                    return (
                      <React.Fragment key={`${ind}_column`}>
                        {thead.fieldValue.indexOf(".") !== -1 && (
                          <td>
                            {loadData(data, thead.fieldValue)}
                          </td>
                        )}
                        {thead.fieldValue.indexOf(".") === -1 && (
                          <td>
                            {thead.component && (
                              <React.Fragment>
                                {React.cloneElement(thead.component, {data:data})}
                              </React.Fragment>
                            )}
                            {!thead.component && (
                              <React.Fragment>
                                {data[thead.fieldValue]}
                              </React.Fragment>
                            )}
                          </td>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tr>
              );
            })}
            {tableData.length <= 0 && 
              <tr className="odd"><td valign="top" colSpan={tableHeaders.length > 0 ? tableHeaders.length : 1} className="dataTables_empty text-center">No data available.</td></tr>
            }
        </tbody>
      </table>
    </React.Fragment>
  );
};
export default Table;
