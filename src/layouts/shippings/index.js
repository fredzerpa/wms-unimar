// @mui material components
import Grid from "@mui/material/Unstable_Grid2/Grid2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import PieChart from "components/Charts/PieChart";

// Billing page components
import ShippingsHistory from "layouts/shippings/components/ShippingsHistory";

const Shippings = () => {
  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4} mb={3}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <ShippingsHistory />
          </Grid>
          <Grid xs={12} md={4}>
            <MDBox pb={3}>
              <PieChart
                title="Distribución por tienda"
                height="18rem"
                description="Analisis de cantidad de envios a cada tienda"
                chart={{
                  labels: ["Local 1", "Local 2", "Local 3"],
                  datasets: {
                    backgroundColors: ["primary", "info", "text"],
                    data: [128, 140, 122],
                  },
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>

    </DashboardLayout >
  );
}

export default Shippings;
