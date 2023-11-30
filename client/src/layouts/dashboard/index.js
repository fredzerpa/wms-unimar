import { useMemo, useState } from "react";
import { Card } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Link } from "react-router-dom";
import colors from "assets/theme/base/colors";

import MDBox from "components/MDBox";
import InventoryDataTable from "components/InventoryDataTable";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import ReportsBarChart from "components/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "components/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "components/Cards/StatisticsCards/ComplexStatisticsCard";
import OrdersOverview from "layouts/dashboard/components/OrdersOverview";
import PieChart from "components/Charts/PieChart";

// Utils
import { formatCurrency, formatPercentage, formatNumber } from "utils/functions.utils";
import {
  LAST_SIX_MONTHS_LABELS,
  getBillsByWeekNumber,
  getDiff,
  getInventoryGroupedByClass,
  getLastSixMonthsBills,
  getLastSixMonthsShippings,
  getLastThreeMonthsBills,
  getLastThreeMonthsShippings,
  getShippingsByMonth,
  getShippingsByWeekNumber,
  sortOrdersOverview,
  sumBillsTotal,
  todayDT,
} from "./utils/dashboard.utils";

// Context
import { useBills } from "context/bills.context";
import { useInventory } from "context/inventory.context";
import { useShippings } from "context/shippings.context";
import MDTypography from "components/MDTypography";

const Dashboard = () => {
  const { bills } = useBills();
  const { shippings } = useShippings();
  const { inventory } = useInventory();
  const [cardsSelectedOptions, setCardsSelectedOptions] = useState({
    rotations: {
      label: "Mes",
      value: "month"
    },
    shippings: {
      label: "Mes",
      value: "month"
    },
    costs: {
      label: "Mes",
      value: "month"
    },
  })

  const dataConfig = useMemo(() => ({
    shippings: {
      currentWeek: getShippingsByWeekNumber(shippings, todayDT.weekNumber),
      formerWeek: getShippingsByWeekNumber(shippings, todayDT.minus({ weeks: 1 }).weekNumber),
      currentMonth: getShippingsByMonth(shippings, todayDT.month),
      formerMonth: getShippingsByMonth(shippings, todayDT.minus({ months: 1 }).month),
      lastSixthMonths: getLastSixMonthsShippings(shippings),
    },
    bills: {
      currentMonth: getShippingsByMonth(bills, todayDT.month),
      formerMonth: getShippingsByMonth(bills, todayDT.minus({ months: 1 }).month),
      lastSixthMonths: getLastSixMonthsBills(bills),
    },
    inventory: {
      groupedByClass: getInventoryGroupedByClass(inventory)
    },
    cards: {
      rotations: {
        week: null,
        month: null,
        triMonths: null,
        sixMonths: null,
      },
      shippings: {
        week: getShippingsByWeekNumber(shippings, todayDT.weekNumber).length,
        month: getShippingsByMonth(shippings, todayDT.month).length,
        triMonths: getLastThreeMonthsShippings(shippings).length,
        sixMonths: getLastSixMonthsShippings(shippings).length,
      },
      costs: {
        week: sumBillsTotal(getBillsByWeekNumber(bills, todayDT.weekNumber)),
        month: sumBillsTotal(getShippingsByMonth(bills, todayDT.month)),
        triMonths: getLastThreeMonthsBills(bills).reduce((sum, month) => sum + sumBillsTotal(month.bills), 0),
        sixMonths: getLastSixMonthsBills(bills).reduce((sum, month) => sum + sumBillsTotal(month.bills), 0),
      },
    }
  }), [bills, inventory, shippings])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Rotations */}
          {/* <Grid xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="change_circle"
                title="Rotaciones"
                count={formatPercentage(0.34, { signDisplay: "never" })}
                optionValue={cardsSelectedOptions.rotations}
                options={[
                  { label: "Semana", value: "week" },
                  { label: "Mes", value: "month" },
                  { label: "3 Meses", value: "triMonths" },
                  { label: "6 Meses", value: "sixMonths" },
                ]}
                onOptionChange={option => setCardsSelectedOptions({ ...cardsSelectedOptions, rotations: option })}
                percentage={(() => {
                  const CARD_LABELS_MAP = {
                    week: "esta semana",
                    month: "este mes",
                    triMonths: "en los ultimos 3 meses",
                    sixMonths: "en los ultimos 6 meses",
                  }

                  return {
                    color: "dark",
                    amount: "20",
                    label: CARD_LABELS_MAP[cardsSelectedOptions.rotations.value],
                  }
                })()}
              />
            </MDBox>
          </Grid> */}

          {/* Shippings */}
          <Grid xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="local_shipping"
                title={(() => {
                  const CARD_TITLE_LABELS_MAP = {
                    week: "esta semana",
                    month: "este mes",
                    triMonths: "en los ultimos 3 meses",
                    sixMonths: "en los ultimos 6 meses",
                  }

                  // TODO: Add dynamic title
                  const title = `Envios`;

                  return title
                })()}
                count={formatNumber(dataConfig.cards.shippings[cardsSelectedOptions.shippings.value])}
                optionValue={cardsSelectedOptions.shippings}
                options={[
                  { label: "Semana", value: "week" },
                  { label: "Mes", value: "month" },
                  { label: "3 Meses", value: "triMonths" },
                  { label: "6 Meses", value: "sixMonths" },
                ]}
                onOptionChange={option => setCardsSelectedOptions({ ...cardsSelectedOptions, shippings: option })}
                percentage={(() => {
                  const target = dataConfig.shippings.currentWeek.length;
                  const source = dataConfig.shippings.formerWeek.length;
                  const diff = getDiff(target, source);

                  const CARD_LABELS_MAP = {
                    week: "esta semana",
                    month: "este mes",
                    triMonths: "en los ultimos 3 meses",
                    sixMonths: "en los ultimos 6 meses",
                  }

                  return {
                    color: diff?.label ? diff?.color : "dark",
                    amount: diff?.label ?? `+${target}`,
                    label: CARD_LABELS_MAP[cardsSelectedOptions.shippings.value],
                  }
                })()}
              />
            </MDBox>
          </Grid>

          {/* Costs */}
          <Grid xs={12} md={6} lg={3}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="attach_money"
                title={(() => {
                  const CARD_TITLE_LABELS_MAP = {
                    week: "esta semana",
                    month: "este mes",
                    triMonths: "en los ultimos 3 meses",
                    sixMonths: "en los ultimos 6 meses",
                  }

                  // TODO: Add dynamic title
                  const title = `Gastos`;

                  return title
                })()}
                count={formatCurrency(dataConfig.cards.costs[cardsSelectedOptions.costs.value])}
                optionValue={cardsSelectedOptions.costs}
                options={[
                  { label: "Semana", value: "week" },
                  { label: "Mes", value: "month" },
                  { label: "3 Meses", value: "triMonths" },
                  { label: "6 Meses", value: "sixMonths" },
                ]}
                onOptionChange={option => setCardsSelectedOptions({ ...cardsSelectedOptions, costs: option })}
                percentage={(() => {
                  const target = sumBillsTotal(dataConfig.bills.currentMonth);
                  const source = dataConfig.bills.formerMonth;
                  const diff = getDiff(target, source);

                  const CARD_LABELS_MAP = {
                    week: "esta semana",
                    month: "este mes",
                    triMonths: "en los ultimos 3 meses",
                    sixMonths: "en los ultimos 6 meses",
                  }

                  return {
                    color: diff?.label ? diff?.color : "dark",
                    amount: diff?.label ?? `+${target}`,
                    label: CARD_LABELS_MAP[cardsSelectedOptions.costs.value],
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
                    options: {
                      scales: {
                        y: {
                          min: 0,
                          ticks: { beginAtZero: true }
                        }
                      },
                    }
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
                      scales: {
                        y: {
                          min: 0,
                          ticks: { beginAtZero: true }
                        }
                      },
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
                      backgroundColors: ["primary", "info", "text", "warning"],
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
            <Grid xs={12} md={6} lg={4}>
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
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>

    </DashboardLayout>
  );
}

export default Dashboard;
