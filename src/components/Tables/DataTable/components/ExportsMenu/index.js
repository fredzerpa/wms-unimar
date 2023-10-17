import { useCallback, useState } from "react";
import { Menu, MenuItem, Tooltip } from "@mui/material";
import { FileDownload } from "@mui/icons-material";
import xlsx from "json-as-xlsx"
import PropTypes from "prop-types";

import MDButton from "components/MDButton";
import MDBox from "components/MDBox";
import { useMaterialUIController } from "context";


const ExportsMenu = ({ table, columns, fileName, sheetName, tooltipLabel, tooltipPlacement, ...rest }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [controller] = useMaterialUIController();
  const {darkMode} = controller;

  const openMenu = (event) => setAnchorEl(event.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const setXlsxDataConfig = useCallback((content) => [{
    sheet: sheetName,
    columns: columns.map(column => {
      return {
        label: column.header,
        value: column.accessorKey
      }
    }),
    content,
  }], [columns, sheetName]);

  const xlsxSettings = {
    fileName, // Name of the resulting spreadsheet
    extraLength: 3, // A bigger number means that columns will be wider
    writeMode: "writeFile", // The available parameters are 'WriteFile' and 'write'. This setting is optional. Useful in such cases https://docs.sheetjs.com/docs/solutions/output#example-remote-file
    writeOptions: {}, // Style options from https://docs.sheetjs.com/docs/api/write-options
    RTL: false, // Display the columns from right-to-left (the default value is false)
  }

  const handleExportByTable = async () => {
    const tableCurrentData = table.getPrePaginationRowModel().rows.map(row => row.original);
    xlsx(setXlsxDataConfig(tableCurrentData), xlsxSettings)
    closeMenu();
  }

  const handleExportByRows = async () => {
    const selectedRowsData = table.getSelectedRowModel().rows.map(row => row.original);
    xlsx(setXlsxDataConfig(selectedRowsData), xlsxSettings)
    closeMenu();
  }

  return (
    <MDBox>
      <MDButton iconOnly variant="text" color={darkMode ? "white" : "dark"} circular onClick={openMenu} {...rest}>
        <Tooltip title={tooltipLabel} placement={tooltipPlacement}>
          <FileDownload sx={{ height: "1.5rem", width: "1.5rem" }} />
        </Tooltip>
      </MDButton>
      <Menu anchorEl={anchorEl} open={open} onClose={closeMenu}>
        <MenuItem onClick={handleExportByTable}>Exportar tabla</MenuItem>
        <MenuItem
          disabled={!table.getIsSomeRowsSelected()}
          onClick={handleExportByRows}>
          Exportar por filas
        </MenuItem>
      </Menu>
    </MDBox>
  );
}

ExportsMenu.defaultProps = {
  tooltipLabel: 'Exportar',
  tooltipPlacement: 'top',
}

ExportsMenu.propTypes = {
  tooltipLabel: PropTypes.string,
  tooltipPlacement: PropTypes.string,
}


export default ExportsMenu;