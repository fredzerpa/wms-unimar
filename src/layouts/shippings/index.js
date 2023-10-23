// @mui material components
import Grid from "@mui/material/Unstable_Grid2/Grid2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";

// Billing page components
import ShippingsHistory from "layouts/shippings/components/ShippingsHistory";
import Transactions from "layouts/shippings/components/Transactions";

const Shippings = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4} mb={3}>
        <Grid container spacing={3}>
          <Grid xs={12} md={7}>
            <ShippingsHistory />
          </Grid>
          <Grid xs={12} md={5}>
            <Transactions />
          </Grid>
        </Grid>
      </MDBox>
      
    </DashboardLayout >
  );
}

export default Shippings;
