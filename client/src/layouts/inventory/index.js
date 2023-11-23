// Libraries
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Card from "@mui/material/Card";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import InventoryDataTable from "components/InventoryDataTable";
import ProductsListButton from "./components/ProductsListButton";

const Inventory = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox pt={6} pb={3}>
        <Grid container spacing={6}>
          <Grid xs={12}>
            <ProductsListButton />
          </Grid>
          <Grid xs={12}>
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
                <InventoryDataTable />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>

    </DashboardLayout>
  );
}

export default Inventory;
