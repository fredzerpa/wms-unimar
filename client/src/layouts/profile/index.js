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
import ChangePassword from "./components/ChangePassword";

// Context
import { useAuth } from "context/auth.context";
import useUsers from "hooks/users.hooks";


const Overview = () => {
  const { user: userSession } = useAuth();
  const { users, createUser, updateUserByEmail, updateSelfData, changePassword, deleteUserByEmail } = useUsers();


  const handleProfileChange = async data => await updateSelfData(data);
  const handlePasswordChange = async (oldPassword, newPassword) => await changePassword(oldPassword, newPassword);

  const handleCreateUser = async data => await createUser(data);
  const handleUpdateUser = async (userEmail, userUpdated) => await updateUserByEmail(userEmail, userUpdated);
  const handleDeleteUser = async userEmail => await deleteUserByEmail(userEmail);

  return (
    <DashboardLayout>
      <DashboardNavbar />
      <MDBox mb={2} />
      <Header user={userSession} onImageChange={handleProfileChange}>
        <MDBox mt={5} mb={3}>
          <Grid container spacing={2} display="flex" justifyContent="center">
            <Grid xs={12} lg={4}>
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
                onSubmit={handleProfileChange}
              />
            </Grid>
            <Grid lg={0.5} display={{ sm: "none", lg: "flex" }} justifyContent="center">
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid xs={12} lg={4}>
              <ChangePassword onChange={handlePasswordChange} />
            </Grid>
            <Grid lg={0.5} display={{ sm: "none", lg: "flex" }} justifyContent="center">
              <Divider orientation="vertical" sx={{ mx: 0 }} />
            </Grid>
            <Grid xs={12} lg={3}>
              <ProfilesList
                users={users}
                createUser={handleCreateUser}
                updateUserByEmail={handleUpdateUser}
                deleteUserByEmail={handleDeleteUser}
              />
            </Grid>
          </Grid>
        </MDBox>
      </Header>

    </DashboardLayout >
  );
}

export default Overview;
