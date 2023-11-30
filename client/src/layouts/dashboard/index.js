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
  getFormerLastSixMonthsBills,
  getFormerLastSixMonthsInventory,
  getFormerLastSixMonthsShippings,
  getFormerLastThreeMonthsBills,
  getFormerLastThreeMonthsInventory,
  getFormerLastThreeMonthsShippings,
  getInventoryByMonth,
  getInventoryByWeekNumber,
  getInventoryGroupedByClass,
  getLastSixMonthsBills,
  getLastSixMonthsInventory,
  getLastSixMonthsShippings,
  getLastThreeMonthsBills,
  getLastThreeMonthsInventory,
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
    inventory: {
      label: "Mes",
      value: "currentMonth"
    },
    shippings: {
      label: "Mes",
      value: "currentMonth"
    },
    bills: {
      label: "Mes",
      value: "currentMonth"
    },
  })

  const dataConfig = useMemo(() => ({
    shippings: {
      currentWeek: getShippingsByWeekNumber(shippings, todayDT.weekNumber),
      formerWeek: getShippingsByWeekNumber(shippings, todayDT.minus({ weeks: 1 }).weekNumber),
      currentMonth: getShippingsByMonth(shippings, todayDT.month),
      formerMonth: getShippingsByMonth(shippings, todayDT.minus({ months: 1 }).month),
      lastThreeMonths: getLastThreeMonthsShippings(shippings),
      formerLastThreeMonths: getFormerLastThreeMonthsShippings(shippings),
      lastSixMonths: getLastSixMonthsShippings(shippings),
      formerLastSixMonths: getFormerLastSixMonthsShippings(shippings),
    },
    bills: {
      currentWeek: getBillsByWeekNumber(bills, todayDT.weekNumber),
      formerWeek: getBillsByWeekNumber(bills, todayDT.minus({ weeks: 1 }).weekNumber),
      currentMonth: getShippingsByMonth(bills, todayDT.month),
      formerMonth: getShippingsByMonth(bills, todayDT.minus({ months: 1 }).month),
      lastThreeMonths: getLastThreeMonthsBills(bills),
      formerLastThreeMonths: getFormerLastThreeMonthsBills(bills),
      lastSixMonths: getLastSixMonthsBills(bills),
      formerLastSixMonths: getFormerLastSixMonthsBills(bills),
    },
    inventory: {
      currentWeek: getInventoryByWeekNumber(inventory, todayDT.weekNumber),
      formerWeek: getInventoryByWeekNumber(inventory, todayDT.minus({ weeks: 1 }).weekNumber),
      currentMonth: getInventoryByMonth(inventory, todayDT.month),
      formerMonth: getInventoryByMonth(inventory, todayDT.minus({ months: 1 }).month),
      lastThreeMonths: getLastThreeMonthsInventory(inventory),
      formerLastThreeMonths: getFormerLastThreeMonthsInventory(inventory),
      lastSixMonths: getLastSixMonthsInventory(inventory),
      formerLastSixMonths: getFormerLastSixMonthsInventory(inventory),
      groupedByClass: getInventoryGroupedByClass(inventory)
    },
  }), [bills, inventory, shippings])


  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox py={3}>
        <Grid container spacing={3}>
          {/* Rotations */}
          {/* <Grid xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="change_circle"
                title="Rotaciones"
                count={(() => {
                  const COUNT_MAP = {
                    currentWeek: dataConfig.shippings.currentWeek.length,
                    currentMonth: dataConfig.shippings.currentMonth.length,
                    lastThreeMonths: dataConfig.shippings.lastThreeMonths.reduce((sum, month) => sum + month.shippings.length, 0),
                    lastSixMonths: dataConfig.shippings.lastSixMonths.reduce((sum, month) => sum + month.shippings.length, 0),
                  }
                  const count = COUNT_MAP[cardsSelectedOptions.shippings.value]
                  return formatPercentage(count, { signDisplay: "never" })
                })()}
                options={[
                  { label: "Semana", value: "currentWeek" },
                  { label: "Mes", value: "currentMonth" },
                  { label: "3 Meses", value: "lastThreeMonths" },
                  { label: "6 Meses", value: "lastSixMonths" },
                ]}
                onOptionChange={option => setCardsSelectedOptions({ ...cardsSelectedOptions, inventory: option })}
                percentage={(() => {
                  const TARGET_MAP = {
                    currentWeek: dataConfig.inventory.currentWeek.length,
                    currentMonth: dataConfig.inventory.currentMonth.length,
                    lastThreeMonths: dataConfig.inventory.lastThreeMonths.reduce((sum, month) => sum + month.inventory.length, 0),
                    lastSixMonths: dataConfig.inventory.lastSixMonths.reduce((sum, month) => sum + month.inventory.length, 0),
                  }
                  const SOURCE_MAP = {
                    currentWeek: dataConfig.inventory.formerWeek.length,
                    currentMonth: dataConfig.inventory.formerMonth.length,
                    lastThreeMonths: dataConfig.inventory.formerLastThreeMonths.reduce((sum, month) => sum + month.inventory.length, 0),
                    lastSixMonths: dataConfig.inventory.formerLastSixMonths.reduce((sum, month) => sum + month.inventory.length, 0),
                  }
                  const CARD_LABELS_MAP = {
                    currentWeek: "esta semana",
                    currentMonth: "este mes",
                    lastThreeMonths: "en los ultimos 3 meses",
                    lastSixMonths: "en los ultimos 6 meses",
                  }

                  const target = TARGET_MAP[cardsSelectedOptions.inventory.value];
                  const source = SOURCE_MAP[cardsSelectedOptions.inventory.value];
                  const diff = getDiff(target, source);


                  return {
                    color: diff?.label ? diff?.color : "dark",
                    amount: diff?.label ?? `+${target}`,
                    label: CARD_LABELS_MAP[cardsSelectedOptions.inventory.value],
                  }
                })()}
              />
            </MDBox>
          </Grid> */}

          {/* Shippings */}
          <Grid xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="local_shipping"
                title="Envios"
                count={(() => {
                  const COUNT_MAP = {
                    currentWeek: dataConfig.shippings.currentWeek.length,
                    currentMonth: dataConfig.shippings.currentMonth.length,
                    lastThreeMonths: dataConfig.shippings.lastThreeMonths.reduce((sum, month) => sum + month.shippings.length, 0),
                    lastSixMonths: dataConfig.shippings.lastSixMonths.reduce((sum, month) => sum + month.shippings.length, 0),
                  }
                  const count = COUNT_MAP[cardsSelectedOptions.shippings.value]
                  return formatNumber(count)
                })()}
                options={[
                  { label: "Semana", value: "currentWeek" },
                  { label: "Mes", value: "currentMonth" },
                  { label: "3 Meses", value: "lastThreeMonths" },
                  { label: "6 Meses", value: "lastSixMonths" },
                ]}
                onOptionChange={option => setCardsSelectedOptions({ ...cardsSelectedOptions, shippings: option })}
                percentage={(() => {
                  const TARGET_MAP = {
                    currentWeek: dataConfig.shippings.currentWeek.length,
                    currentMonth: dataConfig.shippings.currentMonth.length,
                    lastThreeMonths: dataConfig.shippings.lastThreeMonths.reduce((sum, month) => sum + month.shippings.length, 0),
                    lastSixMonths: dataConfig.shippings.lastSixMonths.reduce((sum, month) => sum + month.shippings.length, 0),
                  }
                  const SOURCE_MAP = {
                    currentWeek: dataConfig.shippings.formerWeek.length,
                    currentMonth: dataConfig.shippings.formerMonth.length,
                    lastThreeMonths: dataConfig.shippings.formerLastThreeMonths.reduce((sum, month) => sum + month.shippings.length, 0),
                    lastSixMonths: dataConfig.shippings.formerLastSixMonths.reduce((sum, month) => sum + month.shippings.length, 0),
                  }
                  const CARD_LABELS_MAP = {
                    currentWeek: "esta semana",
                    currentMonth: "este mes",
                    lastThreeMonths: "en los ultimos 3 meses",
                    lastSixMonths: "en los ultimos 6 meses",
                  }

                  const target = TARGET_MAP[cardsSelectedOptions.shippings.value];
                  const source = SOURCE_MAP[cardsSelectedOptions.shippings.value];
                  const diff = getDiff(target, source);


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
          <Grid xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="success"
                icon="attach_money"
                title="Gastos"
                count={(() => {
                  const COUNT_MAP = {
                    currentWeek: sumBillsTotal(dataConfig.bills.currentWeek),
                    currentMonth: sumBillsTotal(dataConfig.bills.currentMonth),
                    lastThreeMonths: dataConfig.bills.lastThreeMonths.reduce((sum, month) => sum + sumBillsTotal(month.bills), 0),
                    lastSixMonths: dataConfig.bills.lastSixMonths.reduce((sum, month) => sum + sumBillsTotal(month.bills), 0),
                  }
                  const count = COUNT_MAP[cardsSelectedOptions.bills.value]
                  return formatCurrency(count)
                })()}
                options={[
                  { label: "Semana", value: "currentWeek" },
                  { label: "Mes", value: "currentMonth" },
                  { label: "3 Meses", value: "lastThreeMonths" },
                  { label: "6 Meses", value: "lastSixMonths" },
                ]}
                onOptionChange={option => setCardsSelectedOptions({ ...cardsSelectedOptions, bills: option })}
                percentage={(() => {
                  const TARGET_MAP = {
                    currentWeek: sumBillsTotal(dataConfig.bills.currentWeek),
                    currentMonth: sumBillsTotal(dataConfig.bills.currentMonth),
                    lastThreeMonths: dataConfig.bills.lastThreeMonths.reduce((sum, month) => sum + sumBillsTotal(month.bills), 0),
                    lastSixMonths: dataConfig.bills.lastSixMonths.reduce((sum, month) => sum + sumBillsTotal(month.bills), 0),
                  }
                  const SOURCE_MAP = {
                    currentWeek: sumBillsTotal(dataConfig.bills.formerWeek),
                    currentMonth: sumBillsTotal(dataConfig.bills.formerMonth),
                    lastThreeMonths: dataConfig.bills.formerLastThreeMonths.reduce((sum, month) => sum + sumBillsTotal(month.bills), 0),
                    lastSixMonths: dataConfig.bills.formerLastSixMonths.reduce((sum, month) => sum + sumBillsTotal(month.bills), 0),
                  }
                  const CARD_LABELS_MAP = {
                    currentWeek: "esta semana",
                    currentMonth: "este mes",
                    lastThreeMonths: "en los ultimos 3 meses",
                    lastSixMonths: "en los ultimos 6 meses",
                  }

                  const target = TARGET_MAP[cardsSelectedOptions.bills.value];
                  const source = SOURCE_MAP[cardsSelectedOptions.bills.value];

                  const diff = getDiff(target, source);

                  return {
                    color: diff?.label ? diff?.color : "dark",
                    amount: diff?.label ?? `+${target}`,
                    label: CARD_LABELS_MAP[cardsSelectedOptions.bills.value],
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
                      data: dataConfig.shippings.lastSixMonths.map(month => month?.shippings?.length)
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
                      data: dataConfig.bills.lastSixMonths.map(month =>
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
