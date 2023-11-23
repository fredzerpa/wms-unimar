// Libraries
import { useCallback, useEffect, useState } from "react";
import { Card, Divider, InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import SimpleBar from "simplebar-react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

// Context
import { useStores } from "context/stores.context";
import { useMaterialUIController } from "context";

// assets
import colors from "assets/theme/base/colors";
import borders from "assets/theme/base/borders";

// Components
import MDTypography from "components/MDTypography";
import MDBox from "components/MDBox";
import DebouncedInput from "components/DebouncedInput";
import MDButton from "components/MDButton";
import StoreModalForm from "components/Modals/StoreForm";


const AddStoreButton = ({ createStore }) => {
  const [open, setOpen] = useState(false);

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const handleClick = e => setOpen(true);
  const close = e => setOpen(false);

  const onModalSubmit = async storeData => {
    return await createStore(storeData);
  }

  return (
    <>
      <MDButton
        color={darkMode ? "dark" : "info"}
        onClick={handleClick}
        size="small"
      >
        Agregar Tienda
      </MDButton>
      {
        open && (
          <StoreModalForm
            open={open}
            close={close}
            onSubmit={onModalSubmit}
          />
        )
      }
    </>
  )
}

const Store = ({ storeData, ...props }) => {
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
          {storeData.name}
        </MDTypography>
      </Grid>
      <Grid xs={6}>
        <MDTypography variant="caption">Telefono</MDTypography>
        <MDTypography variant="button" fontWeight="bold" component="p">
          {storeData.phone}
        </MDTypography>
      </Grid>
      <Grid xs={12}>
        <MDTypography variant="caption">Dirección</MDTypography>
        <MDTypography variant="button" fontWeight="bold" component="p">
          {storeData.address.full}
        </MDTypography>
      </Grid>
    </Grid >
  )
}

const StoresList = () => {
  const { stores, createStore, updateStoreById, deleteStoreById } = useStores();
  const [list, setList] = useState([]);
  const [editStore, setEditStore] = useState(null);


  useEffect(() => {
    setList(stores);
  }, [stores])

  const handleSearch = useCallback(search => {
    const filteredData = stores.filter(store => {
      const { name, phone, address } = store

      const detailedData = [name, phone, address.full];

      const regex = new RegExp(search, "gi");
      return detailedData.filter(data => regex.test(data)).length
    })

    setList(filteredData);
  }, [stores])

  const handleStoreClick = store => e => setEditStore(store);
  const closeStoreForm = e => setEditStore(null);

  const onModalSubmit = async updatedStore => {
    const { _id, ...updatedData } = updatedStore;
    return await updateStoreById(_id, updatedData);
  }

  const onStoreDelete = async store => {
    return await deleteStoreById(store._id)
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
            Lista de Tiendas
          </MDTypography>
        </MDBox>
        <MDBox display="flex" justifyContent="flex-end">
          <AddStoreButton createStore={createStore} />
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
                  No existen tiendas registradas
                </MDTypography>
              </MDBox>
            )
          }
          {
            list.map(store => (
              <Store key={store._id} storeData={store} onClick={handleStoreClick(store)} />
            ))
          }
        </SimpleBar>
      </Card>
      {
        !!editStore && (
          <StoreModalForm
            storeData={editStore}
            open={!!editStore}
            close={closeStoreForm}
            onSubmit={onModalSubmit}
            onDelete={onStoreDelete}
          />
        )
      }
    </>
  )
}

export default StoresList;