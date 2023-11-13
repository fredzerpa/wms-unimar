import { useState } from "react";

import MDTypography from "components/MDTypography";
import ProductModalForm from "components/Modals/ItemForm";
import AddItemButton from "./AddItemButton";
import DataTable from "components/Tables/DataTable";
import MDBox from "components/MDBox";

// Data
import { productsData } from "data/productsData";

// Utils
import { formatInventoryEntryData } from "./utils/functions.utils";


const formatColumnHeader = ({ column }) => (<MDTypography variant="h6">{column.columnDef.header}</MDTypography>)
const formatColumnCell = ({ cell }) => (<MDTypography variant="button" color="text" fontWeight="light">{cell.getValue() ?? ""}</MDTypography>)

const TableTopToolbar = () => {
  const [openItemModalForm, setOpenItemModalForm] = useState(false);

  const handleAddItemClick = e => setOpenItemModalForm(true);
  const closeProductModalForm = e => setOpenItemModalForm(false);

  return (
    <MDBox mr={2}>
      <AddItemButton tooltipPlacement="bottom" color="secondary" onClick={handleAddItemClick} />
      {
        openItemModalForm && (
          <ProductModalForm open={openItemModalForm} close={closeProductModalForm} onSubmit={null} />
        )
      }
    </MDBox>
  )
}

const InventoryDataTable = ({ ...rest }) => {
  const [selectedProduct, setSelectedItem] = useState(null);

  const closeProductModalForm = e => setSelectedItem(null);

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
      accessorKey: "type.label",
      header: "Tipo",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 200,
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
      accessorKey: "size.label",
      header: "Medida",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 120,
    },
    {
      accessorKey: "stock",
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
      accessorKey: "entryDate",
      header: "Fecha de ingreso",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 200,
    },

  ]

  const handleTableRowClick = (event, { row, table }) => {
    const productData = row.original;
    console.log(productData)
    setSelectedItem(productData);
  }

  return (
    <>
      <DataTable
        columns={dataTableColumns}
        data={formatInventoryEntryData(productsData)}
        isLoading={false}
        enableFullScreenToggle={false}
        enableMultiSort
        isMultiSortEvent={() => true}
        onRowClick={handleTableRowClick}
        customTopToolbarComponents={TableTopToolbar}
        {...rest}
      />
      {
        !!selectedProduct && (
          <ProductModalForm
            item={selectedProduct}
            open={!!selectedProduct}
            close={closeProductModalForm}
            onSubmit={console.log}
            onDelete={console.log}
          />
        )
      }
    </>
  );
}

export default InventoryDataTable;
