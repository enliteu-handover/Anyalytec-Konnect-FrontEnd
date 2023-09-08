import React from "react";
import { MaterialReactTable } from "material-react-table";

const TableComponent = ({ columns = [], data = [], action, searchHidden, actionHidden }) => {

    return (
        <div>
            <MaterialReactTable
                // defaultFilterOpen={true}
                enableColumnActions={false}
                enableColumnFilters={false}
                positionActionsColumn="last"
                columns={columns}
                data={data}
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                enableHiding={false}
                enableSortingRemoval={false}
                enableRowActions={actionHidden ? false : true}
                enableGlobalFilter={searchHidden ? false : true}
                enableStickyHeader
                enableStickyFooter
                muiTableContainerProps={{ sx: { maxHeight: '400px' } }}
                initialState={{
                    density: 'comfortable', showGlobalFilter: searchHidden ? false : true,
                }}
                muiSearchTextFieldProps={{
                    placeholder: 'Search...',
                    variant: 'outlined',
                }}
                renderRowActions={({ row, table }) =>
                    action ? React.cloneElement(action, { data: data?.[row?.index] }) : ''
                }
                muiTablePaginationProps={{
                    rowsPerPageOptions: [5, 10, 50, 100],
                    // showFirstButton: true,
                    // showLastButton: true,
                }}
                icons={{
                    SearchIcon: (props) => <img src={process.env.PUBLIC_URL + `/images/icons/static/search.svg`} alt="Search"  {...props} />,
                }}
                state={{ isLoading: data?.length > 0 ? false : true }}
            // muiTableProps={{
            //     sx: {
            //         border: "1px solid rgb(158 158 158 / 46%)",
            //         borderRadius: "10px",
            //         overflow: "hidden",
            //     },
            // }}
            //   muiTableHeadCellProps={{
            //     sx: {
            //       border: '1px solid rgba(81, 81, 81, 1)',
            //     },
            //   }}
            //   muiTableBodyCellProps={{
            //     sx: {
            //       border: '1px solid rgba(81, 81, 81, 1)',
            //     },
            //   }}

            />
        </div>
    );
};

export default TableComponent;
