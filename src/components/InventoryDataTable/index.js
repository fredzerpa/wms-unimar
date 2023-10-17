import { useState } from "react";

import MDTypography from "components/MDTypography";
import ItemModalForm from "components/Modals/ItemForm";
import AddItemButton from "./AddItemButton";
import DataTable from "components/Tables/DataTable";

// Data
import { productsData } from "./data/productsData";

// Utils
import { formatInventoryRawData } from "./utils/functions.utils";
import MDBox from "components/MDBox";


const formatColumnHeader = ({ column }) => (<MDTypography variant="h6">{column.columnDef.header}</MDTypography>)
const formatColumnCell = ({ cell }) => (<MDTypography variant="button" color="text" fontWeight="light">{cell.getValue() ?? ""}</MDTypography>)

const TableTopToolbar = () => {
  const [openItemModalForm, setOpenItemModalForm] = useState(false);

  const handleAddItemClick = e => setOpenItemModalForm(true);
  const closeItemModalForm = e => setOpenItemModalForm(false);

  return (
    <MDBox mr={2}>
      <AddItemButton tooltipPlacement="bottom" color="secondary" onClick={handleAddItemClick} />
      <ItemModalForm open={openItemModalForm} close={closeItemModalForm} onSubmit={null} />
    </MDBox>
  )
}

const InventoryDataTable = ({ ...rest }) => {
  const [selectedItem, setSelectedItem] = useState(null);

  const closeItemModalForm = e => setSelectedItem(null);

  const dataTableColumns = [
    {
      accessorKey: "_id",
      header: "ID",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      toggleVisibility: false,
      enableHiding: false,
      disableFilters: true,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "name",
      header: "Nombre",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 200,
    },
    {
      accessorKey: "type",
      header: "Tipo",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 160,
    },
    {
      accessorKey: "typeClass",
      header: "Clase",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 100,
    },
    {
      accessorKey: "code",
      header: "Codigo",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 120,
    },
    {
      accessorKey: "size",
      header: "Medida",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 120,
    },
    {
      accessorKey: "quantity",
      header: "Cantidad",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 150,
    },
    {
      accessorKey: "slot",
      header: "Lote",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 100,
    },
    {
      accessorKey: "date",
      header: "Fecha de ingreso",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 200,
    },

  ]

  const handleTableRowClick = (e, { row, table }) => {
    const item = productsData.find(product => product.id === row.original.id);
    setSelectedItem(item);
  }

  return (
    <>
      <DataTable
        columns={dataTableColumns}
        data={formatInventoryRawData(productsData)}
        isLoading={false}
        enableFullScreenToggle={false}
        enableMultiSort
        isMultiSortEvent={() => true}
        onRowClick={handleTableRowClick}
        customTopToolbarComponents={TableTopToolbar}
        {...rest}
      />
      <ItemModalForm item={selectedItem} open={!!selectedItem} close={closeItemModalForm} onSubmit={null} />
    </>
  );
}

export default InventoryDataTable;
