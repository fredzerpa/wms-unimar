// @mui material components
import Grid from "@mui/material/Grid";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";

// Billing page components
import ShippingsHistory from "layouts/shippings/components/ShippingsHistory";
import Transactions from "layouts/shippings/components/Transactions";

const Shippings = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <ShippingsHistory />
          </Grid>
          <Grid item xs={12} md={5}>
            <Transactions />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout >
  );
}

export default Shippings;
