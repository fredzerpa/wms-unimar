// @mui material components
import { Card } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Link } from "react-router-dom";
import { DateTime, Info } from "luxon";

// Assets
import colors from "assets/theme/base/colors";

import MDBox from "components/MDBox";
import InventoryDataTable from "components/InventoryDataTable";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import ReportsBarChart from "components/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "components/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "components/Cards/StatisticsCards/ComplexStatisticsCard";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import MDTypography from "components/MDTypography";
import PieChart from "components/Charts/PieChart";

// Utils
import { formatCurrency, formatPercentage, formatNumber } from "utils/functions.utils";

const Dashboard = () => {
  const todayDT = DateTime.now();

  const LAST_SIX_MONTHS_LABELS = Info.months('short').filter((month, idx) => idx >= todayDT.month - 6 && idx < todayDT.month);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="change_circle"
                title="Rotaciones"
                count={formatPercentage(0.34, { signDisplay: 'never' })}
                percentage={{
                  color: "dark",
                  amount: "20",
                  label: "Dominó Satinado enviados",
                }}
              />
            </MDBox>
          </Grid>
          <Grid xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="local_shipping"
                title="Envios semanal"
                count={formatNumber(5)}
                percentage={{
                  color: "success",
                  amount: formatPercentage(0.33, { signDisplay: "exceptZero" }),
                  label: "esta semana",
                }}
              />
            </MDBox>
          </Grid>
          <Grid xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="attach_money"
                title="Gastos"
                count={formatCurrency(3524)}
                percentage={{
                  color: "primary",
                  amount: formatPercentage(0.15, { signDisplay: "exceptZero" }),
                  label: "este mes",
                }}
              />
            </MDBox>
          </Grid>
          <Grid xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="primary"
                icon="warning"
                title="Fuera de Stock"
                count="5 productos"
                percentage={{
                  color: "warning",
                  amount: "",
                  label: <Link to="/inventory?filter=stock&order=desc">
                    <MDTypography color="white" variant="button" fontSize="inherit">
                      Ver productos
                    </MDTypography>
                  </Link>,
                }}
                slotProps={{
                  title: {
                    color: "white"
                  },
                  count: {
                    color: "white"
                  },
                  card: {
                    sx: {
                      backgroundColor: colors.gradients.primary.state
                    }
                  }
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
        <MDBox mt={4.5}>
          <Grid container spacing={3}>
            <Grid xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Envios Mensuales"
                  description="Envios realizados los ultimos 6 meses"
                  date="Ultimo envio fue hace 3 dias"
                  chart={{
                    labels: LAST_SIX_MONTHS_LABELS,
                    datasets: { label: "Envios", data: [50, 20, 10, 22, 50, 10, 40] },
                  }}
                />
              </MDBox>
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="Gastos Mensuales"
                  description="Gastos realizados los ultimos 6 meses"
                  date="El ultimo gasto realizado fue hace 8 dias"
                  height="100%"
                  chart={{
                    labels: LAST_SIX_MONTHS_LABELS,
                    datasets: { data: [6150, 5140, 8300, 6220, 7500, 5250, 6100, 6230, 7500] },
                    options: {
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: ({ raw }) => formatCurrency(raw)
                          }
                        }
                      }
                    }
                  }}
                />
              </MDBox>
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <MDBox pb={3} height="100%">
                <PieChart
                  icon={{ color: "primary", component: "leaderboard" }}
                  title="Distribución por Clase"
                  height="13rem"
                  description="Analisis de cantidad de productos por clase"
                  chart={{
                    labels: ["A", "B", "C"],
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
        <MDBox>
          <Grid container spacing={3}>
            <Grid xs={12} md={6} lg={8}>
              <Card sx={{ p: 2, overflow: "hidden" }}>
                <InventoryDataTable
                  enableTopToolbar={false}
                  enableRowSelection={false}
                  onRowClick={null}
                />
              </Card>
            </Grid>
            <Grid xs={12} md={6} lg={4}>
              <OrdersOverview />
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      
    </DashboardLayout>
  );
}

export default Dashboard;
