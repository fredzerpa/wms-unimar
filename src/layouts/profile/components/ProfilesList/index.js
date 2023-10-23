// Libraries
import { useState } from "react";
import Card from "@mui/material/Card";
import { Delete, Edit, Security } from "@mui/icons-material";
import SimpleBar from "simplebar-react";

// Contexts & Hooks
import { useAuth } from "context/auth.context";
import useUsers from "context/users.hooks";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import SettingsMenu from "../SettingsMenu/SettingsMenu";
import UserFormModal from "components/Modals/UserForm";
import MinimizedSearch from "../MinimizedSearch";

const ProfilesList = () => {
  const { user: userSession } = useAuth();
  const { users } = useUsers();
  const [userToEdit, setUserToEdit] = useState(null);
  const [userSearch, setUserSearch] = useState("");

  const handleUserToEdit = user => event => setUserToEdit(user)
  const handleCloseUserToEdit = () => setUserToEdit(null);

  const filterUsers = user => (user.email !== userSession.email && (new RegExp(userSearch, "gi").test(user.fullname)));
  const renderProfiles = users?.filter(filterUsers).map(user => {
    const { imageUrl, email, fullname, isAdmin } = user;

    const renderSettingsMenu = () => {
      const menuItems = [];

      if (userSession.isAdmin && !user.isAdmin) {
        menuItems.push(
          {
            label: "Ser admin",
            color: "info",
            icon: <Security color="info" fontSize="small" />,
            action: () => console.log(user),
          },
          {
            label: "Editar",
            icon: <Edit fontSize="small" />,
            action: handleUserToEdit(user),
          },
          {
            label: "Eliminar",
            color: "error",
            icon: <Delete color="error" fontSize="small" />,
            action: () => console.log(user),
          }
        )
      }


      return (
        <SettingsMenu
          items={menuItems}
        />
      )
    }

    return (
      <MDBox key={email} component="li" display="flex" alignItems="center" py={1} mb={1}>
        <MDBox mr={2}>
          <MDAvatar src={imageUrl} alt="something here" shadow="md" />
        </MDBox>
        <MDBox display="flex" flexDirection="column" alignItems="flex-start" justifyContent="center">
          <MDTypography variant="button" fontWeight="medium" textTransform="capitalize">
            {fullname}
          </MDTypography>
          <MDTypography variant="caption" color="text">
            {isAdmin ? "ADMINISTRADOR" : "AUXILIAR"}
          </MDTypography>
        </MDBox>
        {
          !isAdmin && userSession.isAdmin && (
            <MDBox ml="auto">
              {renderSettingsMenu()}
            </MDBox>
          )
        }
      </MDBox>
    )
  });

  return (
    <>
      <Card sx={{ height: "100%", boxShadow: "none" }}>
        <MDBox pt={2} px={2}>
          <MDBox display="flex" justifyContent="space-between">
            <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
              Usuarios
            </MDTypography>
            <MinimizedSearch value={userSearch} onChange={setUserSearch} name="search" />
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            <SimpleBar style={{ maxHeight: 500 }}>
              {renderProfiles}
            </SimpleBar>
          </MDBox>
        </MDBox>
      </Card>
      {
        !!userToEdit && (
          <UserFormModal
            title={userToEdit ? "Editar Usuario" : "Nuevo Usuario"}
            user={userToEdit}
            open={!!userToEdit}
            close={handleCloseUserToEdit}
            onSubmit={console.log}
          />
        )
      }
    </>
  );

}

export default ProfilesList;
