// Libraries
import { useCallback, useEffect, useState } from "react";
import { Card, Divider, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import SimpleBar from "simplebar-react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

// Context
import { useProviders } from "context/providers.context";
import { useMaterialUIController } from "context";

// assets
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// Components
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import DebouncedInput from "components/DebouncedInput";
import MDButton from "components/MDButton";
import ProviderModalForm from "components/Modals/ProviderForm";


const AddProviderButton = ({ createProvider }) => {
  const [open, setOpen] = useState(false);

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const handleClick = e => setOpen(true);
  const close = e => setOpen(false);

  const onModalSubmit = async providerData => {
    return await createProvider(providerData);
  }

  return (
    <>
      <MDButton
        color={darkMode ? "dark" : "info"}
        onClick={handleClick}
        size="small"
      >
        Agregar Proveedor
      </MDButton>
      {
        open && (
          <ProviderModalForm
            open={open}
            close={close}
            onSubmit={onModalSubmit}
          />
        )
      }
    </>
  )
}

const Provider = ({ providerData, ...props }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  return (
    <Grid
      container
      width="100%"
      borderRadius={borders.borderRadius["lg"]}
      p={2}
      mb={2}
      sx={{
        backgroundColor: darkMode ? colors.dark.main : colors.grey[100],
        "&:hover": {
          cursor: "pointer",
          backgroundColor: darkMode ? colors.dark.focus : colors.light.focus,
        }
      }}
      {...props}
    >
      <Grid xs={6}>
        <MDTypography variant="caption">Nombre</MDTypography>
        <MDTypography variant="button" fontWeight="bold" component="p">
          {providerData.name}
        </MDTypography>
      </Grid>
      <Grid xs={6}>
        <MDTypography variant="caption">Telefono</MDTypography>
        <MDTypography variant="button" fontWeight="bold" component="p">
          {providerData.phone}
        </MDTypography>
      </Grid>
      <Grid xs={12}>
        <MDTypography variant="caption">{providerData.documentId.type}</MDTypography>
        <MDTypography variant="button" fontWeight="bold" component="p">
          {providerData.documentId.type === "RIF" && "J-"}{providerData.documentId.number}
        </MDTypography>
      </Grid>
    </Grid >
  )
}

const ProvidersList = () => {
  const { providers, createProvider, updateProviderById, deleteProviderById } = useProviders();
  const [list, setList] = useState([]);
  const [editProvider, setEditProvider] = useState(null);


  useEffect(() => {
    setList(providers);
  }, [providers])

  const handleSearch = useCallback(search => {
    const filteredData = providers.filter(provider => {
      const { name, phone, documentId } = provider

      const detailedData = [name, phone, documentId.number];

      const regex = new RegExp(search, "gi");
      return detailedData.filter(data => regex.test(data)).length
    })

    setList(filteredData);
  }, [providers])

  const handleProviderClick = provider => e => setEditProvider(provider);
  const closeProviderForm = e => setEditProvider(null);

  const onModalSubmit = async updatedProvider => {
    const { _id, ...updatedData } = updatedProvider;
    return await updateProviderById(_id, updatedData);
  }

  const onProviderDelete = async provider => {
    return await deleteProviderById(provider._id)
  }

  return (
    <>
      <Card
        sx={{
          px: 2,
          py: 1,
        }}
      >
        <MDBox mt={2} mb={1} display="flex" justifyContent="space-between">
          <MDTypography variant="h6" fontWeight="medium" gutterBottom>
            Lista de Proveedores
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-end">
          <AddProviderButton createProvider={createProvider} />
        </MDBox>
        <Divider />
        <SimpleBar
          style={{
            height: 250,
          }}
        >
          <MDBox mb={2}>
            <DebouncedInput
              label="Busca aqui.."
              fullWidth
              timeout={500}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search fontSize="small" />
                  </InputAdornment>
                ),
              }}
              onChange={handleSearch}
            />
          </MDBox>
          {
            !list.length &&
            (
              <MDBox mt={2} mb={1}>
                <MDTypography variant="subtitle1" align="center">
                  No existen proveedores registrados
                </MDTypography>
              </MDBox>
            )
          }
          {
            list.map(provider => (
              <Provider key={provider._id} providerData={provider} onClick={handleProviderClick(provider)} />
            ))
          }
        </SimpleBar>
      </Card>
      {
        !!editProvider && (
          <ProviderModalForm
            providerData={editProvider}
            open={!!editProvider}
            close={closeProviderForm}
            onSubmit={onModalSubmit}
            onDelete={onProviderDelete}
          />
        )
      }
    </>
  )
}

export default ProvidersList;