// Libraries
import { useMemo, useState } from "react";
import Card from "@mui/material/Card";
import { Add, Delete, Edit, Security } from "@mui/icons-material";
import SimpleBar from "simplebar-react";
import lodash from "lodash";

// Contexts & Hooks
import { useAuth } from "context/auth.context";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";
import SettingsMenu from "../SettingsMenu/SettingsMenu";
import UserFormModal from "components/Modals/UserForm";
import MinimizedSearch from "../MinimizedSearch";
import MDButton from "components/MDButton";
import { Divider } from "@mui/material";
import GetPasswordConsent from "components/GetPasswordConsent";
import { enqueueSnackbar } from "notistack";

const ProfilesList = ({ users, createUser, updateUserByEmail, deleteUserByEmail }) => {
  const { user: userSession } = useAuth();
  const [userToEdit, setUserToEdit] = useState(null);
  const [userSearch, setUserSearch] = useState("");

  const isEditingUser = useMemo(() => !lodash.isEmpty(userToEdit), [userToEdit]);

  const handleNewUserButtonClick = e => setUserToEdit({});
  const handleUserToEdit = user => event => setUserToEdit(user)
  const handleCloseUserToEdit = () => setUserToEdit(null);
  const handleUserUpdate = userEmail => async updatedData => await updateUserByEmail(userEmail, updatedData);


  const filterUsers = user => (user.email !== userSession.email && (new RegExp(userSearch, "gi").test(user.fullname)));

  const renderProfiles = () => {
    const profiles = users?.filter(filterUsers).map(user => {
      const { imageUrl, email, fullname, isAdmin } = user;

      const renderSettingsMenu = () => {
        const menuItems = [];

        const setAdminPrivileges = async (user) => {
          try {
            const allowedAction = await GetPasswordConsent({
              title: "Dar acceso administrativo",
              description: `Ingrese su clave para dar acceso administrativo a ${user.fullname}`,
              warning: "Esta accion es irreversible, en caso de equivocacion contactese con soporte"
            });

            if (allowedAction?.error || !allowedAction) throw new Error(allowedAction?.message || "Contraseña incorrecta");

            const adminPrivileges = {
              reports: {
                read: true, // Default Privilege
              },
              users: {
                read: true, // Default Privilege
                upsert: true,
                delete: true,
              },
              inventory: {
                read: true, // Default Privilege
                upsert: true,
                delete: true,
              },
              shippings: {
                read: true, // Default Privilege
                upsert: true,
                delete: true,
              },
              billing: {
                read: true, // Default Privilege
                upsert: true,
                delete: true,
              },
            };
            const response = await updateUserByEmail(user.email, { isAdmin: true, privileges: adminPrivileges });
            if (response?.error || !response) throw new Error(response?.message || "Error al actualizar los privilegios de Administrador")
            return enqueueSnackbar("Se actualizaron los privilegios exitosamente", { variant: "success" });
          } catch (err) {
            return enqueueSnackbar(err.message, { variant: "error" });
          }
        }

        const onDelete = async (user) => {
          try {
            const allowedAction = await GetPasswordConsent({
              title: `Eliminar ${user.name}`,
              description: `Ingrese su clave para dar acceso administrativo a ${user.fullname}`,
              warning: "Esta accion es irreversible, en caso de equivocacion contactese con soporte"
            });

            if (allowedAction?.error || !allowedAction) throw new Error(allowedAction?.message || "Contraseña incorrecta");

            const response = await deleteUserByEmail(user.email)
            if (response?.error || !response) throw new Error(response?.message || "Error al borrar usuario")
            return enqueueSnackbar("Se ha borrado el usuario exitosamente", { variant: "success" });
          } catch (err) {
            return enqueueSnackbar(err.message, { variant: "error" });
          }
        }

        if (userSession.isAdmin && !user.isAdmin) {
          menuItems.push(
            {
              label: "Ser admin",
              color: "info",
              icon: <Security color="info" fontSize="small" />,
              action: async () => await setAdminPrivileges(user),
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
              action: async () => await onDelete(user),
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
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Usuarios
        </MDTypography>
        <SimpleBar style={{ maxHeight: 500 }}>
          {profiles}
        </SimpleBar>
      </>
    )
  }

  return (
    <>
      <Card sx={{ height: "100%", boxShadow: "none", backgroundColor: "inherit" }}>
        <MDBox pt={2} px={2}>
          <MDBox display="flex" justifyContent="space-between">
            {
              userSession?.privileges?.users?.upsert ?
                (
                  <>
                    <MDBox>
                      <MDButton variant="gradient" color="info" onClick={handleNewUserButtonClick}>
                        <Add sx={{ mr: 1 }} />
                        Usuario
                      </MDButton>
                    </MDBox>
                    <Divider />
                  </>
                )
                : null
            }
            <MinimizedSearch value={userSearch} onChange={setUserSearch} name="search" />
          </MDBox>
        </MDBox>
        <MDBox p={2}>
          <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
            {renderProfiles()}
          </MDBox>
        </MDBox>
      </Card>
      {
        !!userToEdit && (
          <UserFormModal
            title={isEditingUser ? "Editar Usuario" : "Nuevo Usuario"}
            user={userToEdit}
            open={!!userToEdit}
            close={handleCloseUserToEdit}
            onSubmit={isEditingUser ? handleUserUpdate(userToEdit.email) : createUser}
          />
        )
      }
    </>
  );

}

export default ProfilesList;
