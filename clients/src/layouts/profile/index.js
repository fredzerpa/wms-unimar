// @mui material components
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import Divider from "@mui/material/Divider";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";

// Material Dashboard 2 React example components
import DashboardLayout from "components/LayoutContainers/DashboardLayout";
import DashboardNavbar from "components/Navbars/DashboardNavbar";
import ProfileInfoCard from "components/Cards/InfoCards/ProfileInfoCard";

// Overview page components
import Header from "layouts/profile/components/Header";
import ProfilesList from "./components/ProfilesList";

// Context
import { useAuth } from "context/auth.context";


const Overview = () => {
  const { user: userSession } = useAuth();

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header user={userSession}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={2} display="flex" justifyContent="center">
            <Grid xs={12} md={5}>
              <ProfileInfoCard
                title="Información de perfil"
                info={{
                  email: userSession.email,
                  fullname: {
                    names: userSession?.names,
                    lastnames: userSession?.lastnames,
                  },
                  phone: userSession?.phones?.main || "N/A",
                }}
                onSubmit={console.log}
              />
            </Grid>
            <Grid md={1} display={{ sm: "none", md: "block" }}>
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid xs={12} md={4}>
              <ProfilesList />
            </Grid>
          </Grid>
        </MDBox>
      </Header>

    </DashboardLayout>
  );
}

export default Overview;
