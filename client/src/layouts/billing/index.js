// Libraries
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { Info } from "luxon";
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

const Billing = () => {
  const { bills } = useBills();
  console.log(bills)

  const WEEK_LABELS = Info.weekdays('short', { locale: "es-ES" }).map(lodash.capitalize);

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
                  datasets: { data: [6150, 5140, 8300, 6220, 7500, 5250, 6100] },
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
