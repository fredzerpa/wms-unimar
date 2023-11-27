// Libraries
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import lodash from "lodash";

import MDBox from "components/MDBox";
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import ReportsLineChart from "components/Charts/LineCharts/ReportsLineChart";

// Billing page components
import BillingHistory from "layouts/billing/components/BillingHistory";

// Context
import { useBills } from "context/bills.context";

import { formatCurrency } from "utils/functions.utils";
import ProvidersList from "./components/ProvidersList";
import { useMemo } from "react";
import { WEEK_LABELS_SHORT, getBillsGroupedByWeekdays, sumTotalBills } from "./utils/functions.utils";

const Billing = () => {
  const { bills } = useBills();


  const WEEK_LABELS = useMemo(() => WEEK_LABELS_SHORT.map(lodash.capitalize), [])
  const thisWeekBills = useMemo(() => getBillsGroupedByWeekdays(bills), [bills])

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4} mb={3}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <BillingHistory />
          </Grid>
          <Grid xs={12} md={4}>
            <MDBox mb={3}>
              <ProvidersList />
            </MDBox>
            <MDBox pt={3}>
              <ReportsLineChart
                color="dark"
                title="Gasto Semanal"
                description="Gastos realizados esta semana"
                date="El ultimo gasto realizado fue hace 8 dias"
                height="100%"
                chart={{
                  labels: WEEK_LABELS,
                  datasets: { data: thisWeekBills.map(({ bills }) => sumTotalBills(bills)) },
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
        </Grid>
      </MDBox>

    </DashboardLayout >
  );
}

export default Billing;
