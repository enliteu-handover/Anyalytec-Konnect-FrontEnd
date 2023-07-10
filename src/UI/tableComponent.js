import React from "react";
import { MaterialReactTable } from "material-react-table";

const TableComponent = ({ columns = [], data = [], action }) => {
    if (data?.length > 0 && columns?.length > 0)
        return (
            <MaterialReactTable
                // defaultFilterOpen={true}
                enableStickyFooter={true}
                enableColumnActions={false}
                enableColumnFilters={false}
                positionActionsColumn="last"
                columns={columns}
                data={data}
                enableDensityToggle={false}
                enableFullScreenToggle={false}
                enableHiding={false}
                enableSortingRemoval={false}
                enableRowActions={true}
                initialState={{
                    showGlobalFilter: true,
                }}
                muiSearchTextFieldProps={{
                    placeholder: 'Search...',
                    variant: 'outlined',
                }}
                renderRowActions={({ row, table }) =>
                    React.cloneElement(action, { data: data[row.index] })
                }
                muiTablePaginationProps={{
                    rowsPerPageOptions: [5, 10, 50, 100],
                    // showFirstButton: true,
                    // showLastButton: true,
                }}
            />
        );
};

export default TableComponent;
