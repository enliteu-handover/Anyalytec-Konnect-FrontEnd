import { MaterialReactTable } from "material-react-table";
import React, { useState } from "react";

const TableComponent = ({
  columns = [],
  data = [],
  action,
  searchHidden,
  actionHidden,
  customContainerSx = {},
  enableRowSelection = false,
  enableRowNumbers = false,
  actionFixed = false
}) => {
  const styles = {
    container: {
      minHeight: '420px',
      maxHeight: '420px',
      fontFamily: "helveticaneueregular !important",
      "& .MuiTable-root": {
        borderSpacing: "0px 10px",
      },
      "& .MuiTableBody-root": {
        "& .MuiTableRow-root": {
          boxShadow: "none",
          backgroundColor: "#f9f9f9",

          // '&:nth-child(even)': {
          //   backgroundColor: '#f5f5f5',
          // },
        },
        '& .MuiTableRow-root:hover td': {
          backgroundColor: '#f9f9f9'
        },
        "& .MuiTableCell-root": {
          fontSize: "14px",
          // position: "relative",
          p: "6px 8px",
          overflow: 'inherit',
          zIndex: 'inherit',
          height: "40px",
          border: "0px",
          boxShadow:'none',
          //     // borderRight:'1.5px solid #cccccc',
          // ":after": {
          //   borderRight: "0px",
          //   right: 0,
          //   content: `""`,
          //   width: "1.5px",
          //   backgroundColor: "#d8d8d8",
          //   backgroundPosition: "right",
          //   display: "block",
          //   position: "absolute",
          //   top: "20%",
          //   bottom: "20%",
          //   backgroundRepeat: "repeat-y",
          // },
          // "&:last-child:after": {
          //   position: "absolute",
          //   width: "0px !important",
          //   content: `""`,
          // },
          "&:first-child": {
            borderRadius: "8px 0px 0px 8px",
          },
          "&:last-child": {
            borderRadius: "0px 8px 8px 0px !important",
          },
        },
      },
      "& .MuiTableFooter-root": {
        outline: "none !important",
        display: "none !important",
      },

      "& .MuiTableHead-root": {
        opacity: 1,
        "& .Mui-TableHeadCell-Content": {
          height: "12px",
          fontSize: "11px",
          letterSpacing: '2px'
        },
        "& .MuiTableRow-root": {
          boxShadow: "none",
        },
        '& .MuiTableCell-root': {
          p: '8px 8px'
        }
      },

      "&::-webkit-scrollbar": {
        width: "12px",
      },

      "&::-webkit-scrollbar-track": {
        backgroundColor: "transparent",
      },
      "&::-webkit-scrollbar-thumb:horizontal": {
        backgroundColor: "#858796",
      },
      "&::-webkit-scrollbar-track:horizontal": {
        backgroundColor: "#f8f8f8",
      },
      '&::-webkit-scrollbar-thumb': {
        background: 'transparent !important',
      }
    },
  };

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setitemsPerPage] = useState(5);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const visibleData = data.slice(startIndex, startIndex + itemsPerPage);

  const handleChangeRows = (e) => {
    setitemsPerPage(Number(e.target.value))
    setCurrentPage(1)
  }
  return (
    <div>

      <MaterialReactTable
        // enablePagination={false}
        showPagination={false}
        enablePagination={false}
        enableColumnActions={false}
        enableColumnFilters={false}
        positionActionsColumn="last"
        columns={columns}
        positionGlobalFilter='left'
        data={visibleData}
        enableRowNumbers={enableRowNumbers}
        enableRowSelection={enableRowSelection}
        enableDensityToggle={false}
        enableFullScreenToggle={false}
        enableHiding={false}
        // positionPagination='bottom'
        enableSortingRemoval={false}
        enableRowActions={actionHidden ? false : true}
        enableGlobalFilter={searchHidden ? false : true}
        enableStickyHeader
        muiTableContainerProps={{ sx: styles.container, ...customContainerSx }}
        enableColumnPinning={true}
        initialState={{
          density: "comfortable",
          showGlobalFilter: searchHidden ? false : true,
          columnPinning: {
            right: actionFixed ? ['mrt-row-actions'] : [],
          }
        }}
        muiSearchTextFieldProps={{
          size: "small",
          placeholder: "Search...",
          variant: "outlined",
          sx: {
            "& .MuiOutlinedInput-input": {
              padding: '6px 7px',
              fontSize: '14px',
              borderRadius: '4px'
            }
          },
          InputProps: {
            endAdornment: (
              <img
                src={process.env.PUBLIC_URL + `/images/icons/static/search.svg`}
                alt="Search"
                style={{ width: '18px' }}
              />
            ),
          },
        }}
        renderRowActions={({ row, table }) =>
          action ? React.cloneElement(action, { data: data?.[row?.index] }) : ""
        }
        // muiTablePaginationProps={{
        //   rowsPerPageOptions: [5, 10, 50, (data?.length > 100 ? data?.length : 100)],
        //   showFirstButton: false,
        //   showLastButton: false,
        // }}
        icons={{
          SearchIcon: (props) => (
            <img
              src={process.env.PUBLIC_URL + `/images/icons/static/search.svg`}
              alt="Search"
              {...props}
            />
          ),
        }}
        // state={{ isLoading: data?.length > 0 ? false : true }}
        // muiTableProps={{
        //     sx: {
        //         border: "1px solid rgb(158 158 158 / 46%)",
        //         borderRadius: "10px",
        //         overflow: "hidden",
        //     },
        // }}

        muiTableHeadCellProps={{
          // align: 'center',
          sx: {
            border: "0px",
            boxShadow: "none",
          },
        }}
      // muiTableBodyCellProps={{
      //   // align: 'center', 
      //   sx: {
      //     border: "0px",
      //     // borderRight:'1.5px solid #cccccc',
      //     p: 1,
      //     position: "relative",
      //   },
      // }}

      />

      {data?.length > 0 && <div className="row custom-paginations">
        <div className="col-sm-12 col-md-6 left">
          <span className="label">Rows per page : </span>
          <select
            className="materialUiSelect" value={itemsPerPage} onChange={(e) => handleChangeRows(e)}>
            {[5, 10, 50, (data?.length > 100 ? data?.length : 100)].map((pageSize) => (
              <option className="option" key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
        <div className="col-sm-12 col-md-6 text-right right">

          <span>{`${startIndex + 1}-${data?.length <= (startIndex + itemsPerPage) ? data?.length : (startIndex + itemsPerPage)} of ${data?.length}`}</span>
          {/* <span>{`${currentPage}-${Math.ceil(data?.length / itemsPerPage)} of ${data?.length}`}</span> */}
          <button onClick={handlePrevPage} disabled={currentPage === 1} className="prev">
            {'﹤'}
          </button>
          <button onClick={handleNextPage} disabled={startIndex + itemsPerPage >= data?.length} className="next">
            {'﹥'}
          </button>
        </div>
      </div>}

    </div>
  );
};

export default TableComponent;
