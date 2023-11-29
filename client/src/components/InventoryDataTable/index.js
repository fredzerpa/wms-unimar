import { useMemo, useState } from "react";

import MDTypography from "components/MDTypography";
import InventoryRecordModalForm from "components/Modals/InventoryRecordForm";
import DataTable from "components/Tables/DataTable";

// Context
import { useInventory } from "context/inventory.context";
import { useBills } from "context/bills.context";

// Utils
import { formatInventoryEntryData } from "./utils/functions.utils";

const formatColumnHeader = ({ column }) => (<MDTypography variant="h6">{column.columnDef.header}</MDTypography>)
const formatColumnCell = ({ cell }) => (<MDTypography variant="button" color="text" fontWeight="light">{cell.getValue() ?? ""}</MDTypography>)

const InventoryDataTable = ({ ...rest }) => {
  const {
    inventory,
    deleteInventoryRecordById,
    updateInventoryRecordById,
  } = useInventory();
  const { loadBills } = useBills();

  const [selectedProduct, setSelectedItem] = useState(null);
  const closeInventoryRecordModalForm = e => setSelectedItem(null);

  const dataTableColumns = useMemo(() => [
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
      accessorKey: "entryDate",
      header: "Fecha de Ingreso",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 250,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "product.code",
      header: "Codigo",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "product.name",
      header: "Nombre",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "product.type.label",
      header: "Tipo",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "product.typeClass",
      header: "Clase",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "product.size.label",
      header: "Medida",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "onStock",
      header: "Cantidad",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "product.slot",
      header: "Lote",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "expirationDate",
      header: "Fecha de Vencimiento",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 250,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },
    {
      accessorKey: "billRef.code",
      header: "# Factura",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      muiTableHeadCellProps: {
        align: "center",
      },
      muiTableBodyCellProps: {
        align: "center",
      },
    },

  ], []);

  const handleTableRowClick = (event, { row, table }) => {
    const recordData = row.original;
    setSelectedItem(recordData);
  }

  const handleUpdateInventoryRecord = async updatedRecord => {
    await updateInventoryRecordById(updatedRecord._id, updatedRecord);
    await loadBills();
  }

  const handleDeleteInventoryRecord = async record => {
    await deleteInventoryRecordById(record._id);
    await loadBills();
  }

  return (
    <>
      <DataTable
        columns={dataTableColumns}
        data={formatInventoryEntryData(inventory)}
        isLoading={false}
        enableFullScreenToggle={false}
        enableMultiSort
        isMultiSortEvent={() => true}
        onRowClick={handleTableRowClick}
        {...rest}
      />
      {
        !!selectedProduct && (
          <InventoryRecordModalForm
            recordData={selectedProduct}
            open={!!selectedProduct}
            close={closeInventoryRecordModalForm}
            onSubmit={handleUpdateInventoryRecord}
            onDelete={handleDeleteInventoryRecord}
          />
        )
      }
    </>
  );
}

export default InventoryDataTable;
