// @mui material components
import { Card } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Link } from "react-router-dom";

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
import {
  LAST_SIX_MONTHS_LABELS,
  getDiff,
  getInventoryGroupedByClass,
  getLastSixMonthsBills,
  getLastSixMonthsShippings,
  getShippingsByMonth,
  getShippingsByWeekNumber,
  getTotalCostByMonth,
  sortOrdersOverview,
  todayDT,
} from "./utils/dashboard.utils";

// Context
import { useBills } from "context/bills.context";
import { useInventory } from "context/inventory.context";
import { useShippings } from "context/shippings.context";
import { useMemo } from "react";

const Dashboard = () => {
  const { bills } = useBills();
  const { shippings } = useShippings();
  const { inventory } = useInventory();


  const dataConfig = useMemo(() => ({
    shippings: {
      currentWeek: getShippingsByWeekNumber(shippings, todayDT.weekNumber),
      formerWeek: getShippingsByWeekNumber(shippings, todayDT.minus({ weeks: 1 }).weekNumber),
      currentMonth: getShippingsByMonth(shippings, todayDT.month),
      formerMonth: getShippingsByMonth(shippings, todayDT.minus({ months: 1 }).month),
      lastSixthMonths: getLastSixMonthsShippings(shippings),
    },
    bills: {
      currentMonth: getTotalCostByMonth(bills, todayDT.month),
      formerMonth: getTotalCostByMonth(bills, todayDT.minus({ months: 1 }).month),
      lastSixthMonths: getLastSixMonthsBills(bills),
    },
    inventory: {
      groupedByClass: getInventoryGroupedByClass(inventory)
    },
  }), [bills, inventory, shippings])

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
                count={formatPercentage(0.34, { signDisplay: "never" })}
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
                count={formatNumber(dataConfig.shippings.currentWeek.length)}
                percentage={(() => {
                  const target = dataConfig.shippings.currentWeek.length;
                  const source = dataConfig.shippings.formerWeek.length;
                  const diff = getDiff(target, source);

                  return {
                    color: diff?.label ? diff?.color : "dark",
                    amount: diff?.label ?? `+${target}`,
                    label: "esta semana",
                  }
                })()}
              />
            </MDBox>
          </Grid>
          <Grid xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="attach_money"
                title="Gastos"
                count={formatCurrency(dataConfig.bills.currentMonth)}
                percentage={(() => {
                  const target = dataConfig.bills.currentMonth;
                  const source = dataConfig.bills.formerMonth;
                  const diff = getDiff(target, source);

                  return {
                    color: diff?.label ? diff?.color : "dark",
                    amount: diff?.label ?? `+${target}`,
                    label: "esta mes",
                  }
                })()}
              />
            </MDBox>
          </Grid>
          {/* TODO: Add */}
          {/* <Grid xs={12} md={6} lg={3}>
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
          </Grid> */}
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
                    datasets: {
                      label: "Envios",
                      data: dataConfig.shippings.lastSixthMonths.map(month => month?.shippings?.length)
                    },
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
                    datasets: {
                      data: dataConfig.bills.lastSixthMonths.map(month =>
                        month.bills.reduce((total, bill) => total + bill.total.usd, 0)
                      )
                    },
                    options: {
                      plugins: {
                        tooltip: {
                          callbacks: {
                            label: ({ raw }) => formatCurrency(raw),
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
                    labels: Object.keys(dataConfig.inventory.groupedByClass),
                    datasets: {
                      backgroundColors: ["primary", "info", "text"],
                      data: Object.values(dataConfig.inventory.groupedByClass).map(products => products.length),
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
              <Card sx={{ p: 2, overflow: "hidden", height: "100%" }}>
                <InventoryDataTable
                  enableTopToolbar={false}
                  enableRowSelection={false}
                  onRowClick={null}
                />
              </Card>
            </Grid>
            {/* <Grid xs={12} md={6} lg={4}>
              {
                (() => {
                  const target = dataConfig.shippings.currentMonth.length + dataConfig.bills.currentMonth.length;
                  const source = dataConfig.shippings.formerMonth.length + dataConfig.bills.formerMonth.length;
                  const diff = getDiff(target, source);
                  const orders = sortOrdersOverview([
                    ...dataConfig.shippings.currentMonth.map(shipping => ({ ...shipping, isShipping: true })),
                    ...dataConfig.bills.currentMonth.map(shipping => ({ ...shipping, isBilling: true })),
                  ]);
                  return (
                    <OrdersOverview
                      title="Ultimos 30 dias"
                      subtitle={diff}
                      orders={orders}
                    />
                  )
                })()
              }
            </Grid> */}
          </Grid>
        </MDBox>
      </MDBox>

    </DashboardLayout>
  );
}

export default Dashboard;
