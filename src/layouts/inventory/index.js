import { useState } from "react";
// Libraries
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ItemModalForm from "components/Modals/ItemForm";
import AddItemButton from "./components/AddItemButton";

// Material Dashboard 2 React example components
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";

import DataTable from "examples/Tables/DataTable";

// Data
import { productsData } from "./data/productsData";

// Utils
import { formatInventoryRawData } from "./utils/functions.utils";


const formatColumnHeader = ({ column }) => (<MDTypography variant="h6">{column.columnDef.header}</MDTypography>)
const formatColumnCell = ({ cell }) => (<MDTypography variant="button" color="text" fontWeight="light">{cell.getValue()}</MDTypography>)

const TableTopToolbar = () => {
  const [openItemModalForm, setOpenItemModalForm] = useState(false);

  const handleAddItemClick = e => setOpenItemModalForm(true);
  const closeItemModalForm = e => setOpenItemModalForm(false);

  return (
    <>
      <AddItemButton tooltipPlacement="bottom" color="secondary" onClick={handleAddItemClick} />
      <ItemModalForm open={openItemModalForm} close={closeItemModalForm} onSubmit={null} />
    </>
  )
}

const Inventory = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const closeItemModalForm = e => setSelectedItem(null);

  const dataTableColumns = [
    {
      accessorKey: "id",
      header: "ID",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      toggleVisibility: false,
      enableHiding: false,
      disableFilters: true,
      enableGlobalFilter: false,
    },
    {
      accessorKey: "code",
      header: "Codigo",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 120,
    },
    {
      accessorKey: "name",
      header: "Nombre",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 200,
    },
    {
      accessorKey: "stock",
      header: "Cantidad",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 100,
    },
    {
      accessorKey: "type",
      header: "Tipo",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 150,
    },
    {
      accessorKey: "typeClass",
      header: "Clase",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 100,
    },
    {
      accessorKey: "size",
      header: "Medida",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 120,
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
      header: "Fecha de Ingreso",
      Header: formatColumnHeader,
      Cell: formatColumnCell,
      size: 150,
    },

  ]

  const handleTableRowClick = (e, { row, table }) => {
    const item = productsData.find(product => product.id === row.original.id);
    setSelectedItem(item);
  }

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid item xs={12}>
            <Card>
              <MDBox
                mx={2}
                mt={-3}
                py={3}
                px={2}
                variant="gradient"
                bgColor="info"
                borderRadius="lg"
                coloredShadow="info"
              >
                <MDTypography variant="h6" color="white">
                  Inventario
                </MDTypography>
              </MDBox>
              <MDBox p={3}>
                <DataTable
                  columns={dataTableColumns}
                  data={formatInventoryRawData(productsData)}
                  isLoading={false}
                  enableFullScreenToggle={false}
                  enableMultiSort
                  isMultiSortEvent={() => true}
                  onRowClick={handleTableRowClick}
                  customTopToolbarComponents={TableTopToolbar}
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

      <ItemModalForm item={selectedItem} open={!!selectedItem} close={closeItemModalForm} onSubmit={null} />
    </DashboardLayout>
  );
}

export default Inventory;
