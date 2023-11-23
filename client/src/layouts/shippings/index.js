// @mui material components
import { useMemo } from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React examples
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import PieChart from "components/Charts/PieChart";
import ShippingsHistory from "layouts/shippings/components/ShippingsHistory";

// Billing page components
import { useShippings } from "context/shippings.context";
import StoresList from "./components/StoresList";
import { todayDT } from "layouts/dashboard/utils/dashboard.utils";
import { getShippingsByYear } from "./utils/shippings.utils";

const Shippings = () => {
  const { shippings } = useShippings();

  const shippingsGroupedByStores = useMemo(() => {
    return [...shippings.reduce((groups, shipping) => {
      const { store, ...rest } = shipping;
      const key = store._id;

      if (groups.has(key)) groups.set(key, { ...groups.get(key), shippings: [...groups.get(key).shippings, rest] })
      else groups.set(key, { store, shippings: [rest] })

      return groups;
    }, new Map()).values()]
  }, [shippings]);




  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mt={4} mb={3}>
        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            <ShippingsHistory />
          </Grid>
          <Grid xs={12} md={4} columnGap={3}>
            <MDBox mb={3}>
              <StoresList />
            </MDBox>
            <MDBox mb={3}>
              <PieChart
                title="Distribución por tienda"
                description={`Analisis de cantidad de productos enviados en ${todayDT.year} a cada tienda`}
                height="12rem"
                chart={{
                  labels: shippingsGroupedByStores.map(group => group.store.name),
                  datasets: {
                    backgroundColors: ["primary", "info", "text"],
                    data: shippingsGroupedByStores.map(
                      group => getShippingsByYear(group.shippings, 2023)
                        .reduce((sum, shipping) => {
                          return sum + shipping.products.reduce((total, product) => total + product.quantity, 0);
                        }, 0)
                    ),
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
