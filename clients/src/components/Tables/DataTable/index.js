import { useEffect, useRef, useState, memo } from "react";

import MaterialReactTable from "material-react-table";
import { MRT_Localization_ES } from "material-react-table/locales/es"; // Import Material React Table Translations
import isEqual from "react-fast-compare";
import { DateTime } from "luxon";

import { useMaterialUIController } from "context";

import colors from "assets/theme/base/colors";
import ExportsMenu from "./components/ExportsMenu";
import rgba from "assets/theme/functions/rgba";
import MDBox from "components/MDBox";
import { MRT_Default_Icons } from "./config/icons";

const DataTable = ({ columns, data, isLoading, onRowClick, customTopToolbarComponents, ...props }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const tableContainerRef = useRef(null); // we can get access to the underlying TableContainer element and react to its scroll events
  const rowVirtualizerInstanceRef = useRef(null); // we can get access to the underlying Virtualizer instance and call its scrollToIndex method
  const [sorting, setSorting] = useState([]);

  // scroll to top of table when sorting or filters change
  useEffect(() => {
    try {
      // scroll to the top of the table when the sorting changes
      rowVirtualizerInstanceRef.current?.scrollToIndex?.(0);
    } catch (error) {
      console.error(error);
    }
  }, [sorting]);

  const renderTopToolbar = ({ columns }) => ({ table }) => {
    const exportFileName = `WMS Inventario - ${DateTime.now().toFormat('dd-MM-yyyy')}`;
    const exportSheetName = `Inventario`;
    return (
      <MDBox display="flex" height="100%">
        {customTopToolbarComponents && customTopToolbarComponents({ table })}
        <ExportsMenu
          table={table}
          columns={columns}
          fileName={exportFileName}
          sheetName={exportSheetName}
          tooltipPlacement="bottom"
          color="secondary"
        />
      </MDBox>
    )
  }

  return (
    <MaterialReactTable
      // Custom props
      columns={columns}
      data={data}
      state={{
        isLoading,
        showAlertBanner: props?.isError,
        showProgressBars: isLoading,
        sorting,
        columnVisibility: { _id: false },
        density: "compact"
      }}
      localization={MRT_Localization_ES}
      renderTopToolbarCustomActions={renderTopToolbar({ columns })}
      enableDensityToggle={false}
      positionToolbarAlertBanner="top"
      enableRowSelection
      enablePagination={false}
      enableRowVirtualization // optional, but recommended if it is likely going to be more than 100 rows
      enableBottomToolbar={false}
      icons={MRT_Default_Icons} // Add dark theme icon colors
      muiTableContainerProps={{
        ref: tableContainerRef, // get access to the table container element
        sx: {
          height: '500px',
          boxShadow: 'none',
          // Overwrite scroll styles
          '::-webkit-scrollbar': {
            width: '8px', // Vertical Scroll size
            height: '8px', // Horizontal scroll size
            // display: 'none' /* Hide scroll */,
          },
          // Add thumb background color
          '::-webkit-scrollbar-thumb': {
            background: '#ccc',
            borderRadius: '4px',
          },

          '::-webkit-scrollbar-thumb:hover': {
            background: '#b3b3b3',
            boxShadow: '0 0 2px 1px rgba(0, 0, 0, 0.2)',
          },

          '::-webkit-scrollbar-thumb:active': {
            backgroundColor: '#999999',
          },
        },
      }}
      muiToolbarAlertBannerProps={
        props?.isError
          ? {
            color: 'error',
            children: 'Error en la carga de datos',
          }
          : undefined
      }
      onSortingChange={setSorting}
      rowVirtualizerInstanceRef={rowVirtualizerInstanceRef} // get access to the virtualizer instance
      rowVirtualizerProps={{ overscan: 4 }}
      // Customize Material React Table styles
      muiLinearProgressProps={{ color: 'info' }}
      muiTablePaperProps={{ elevation: 0, sx: { overflow: 'hidden', background: 'inherit', '.MuiButtonBase-root': { color: 'text' } } }}
      muiTopToolbarProps={{ sx: { backgroundColor: 'inherit', color: 'text' } }}
      muiTableProps={{ sx: { '&, & thead, & tr': { backgroundColor: 'inherit' } } }}
      muiTableHeadProps={{ sx: { padding: 0 } }}
      muiTableBodyRowProps={({ isDetailPanel, row, table }) => ({
        onClick: e => { if (onRowClick) return onRowClick(e, { row, table }) },
        sx: {
          cursor: onRowClick && 'pointer', //you might want to change the cursor too when adding an onClick
          // Change select & hover styles at the rows
          backgroundColor: row.getIsSelected() && !darkMode && `${colors.background.default}!important`,
          '&:hover td': {
            backgroundColor: row.getIsSelected() && `${rgba(colors.info.main, 0.15)}!important`,
          }
        },
      })}
      muiSelectAllCheckboxProps={{ sx: { width: 'auto', height: 'inherit' } }}
      muiSelectCheckboxProps={{ sx: { width: 'auto', height: 'inherit' } }}
      muiSearchTextFieldProps={{
        sx: {
          '& > .MuiInputBase-root': {
            padding: '0.5rem 0.75rem!important',
            justifyContent: 'space-between',
            '&:after': {
              borderColor: colors.info.main
            }
          },
        },
      }}
      muiTableHeadCellFilterTextFieldProps={{
        sx: {
          '& > .MuiInputBase-root': {
            padding: '0.5rem 0.75rem!important',
            justifyContent: 'space-between',
          },
        },
      }}
      muiTablePaginationProps={{
        SelectProps: {
          sx: {
            width: 'auto!important',
          },
        },
      }}
      {...props}
    />
  );
}

export default memo(DataTable, isEqual);