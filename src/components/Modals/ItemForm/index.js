import { useState } from "react";
// Libraries
import { Card, MenuItem, Modal, Select } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Controller, useForm } from "react-hook-form";
import { DateTime } from "luxon";
import { Lock } from "@mui/icons-material";

// Components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import { defaultsDeep } from "lodash";
import { useMaterialUIController } from "context";

const formatItemRawData = rawData => {
  if (!rawData) return {};
  const date = DateTime.fromFormat(rawData?.date, "dd/MM/yyyy");
  return {
    ...rawData,
    date
  }
}

const INITIAL_VALUES = {
  id: null,
  slot: "",
  date: DateTime.now(),
  code: "",
  size: "",
  name: "",
  type: "",
  typeClass: "",
  observations: "",
}
const ItemModalForm = ({ item, open, close }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, control, handleSubmit, watch, formState: { errors } } = useForm({
    values: defaultsDeep(formatItemRawData(item), INITIAL_VALUES),
  });
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const watchTypeSelection = watch("type");
  const watchObservations = watch("observations");


  const onSubmit = async data => {
    try {
      setIsSubmitting(true);
      await new Promise((res, rej) => setTimeout(() => res(true), 3000));
      console.log({ data });
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  };

  const handleClose = e => {
    close();
  }

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Card
        component="form"
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
        sx={theme => ({
          width: "550px",
          maxWidth: "100%",
          position: "absolute",
          overflow: "hidden",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          [theme.breakpoints.down("md")]: {
            height: "100%",
            width: "100%",
            borderRadius: 0,
          },
        })}
      >
        <SimpleBar
          style={{
            maxHeight: "80vh",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="es-es">
            <MDBox p={3}>
              <MDTypography variant="h4" fontWeight="medium" textTransform="capitalize" gutterBottom>
                {item?.name ? "Editar Articulo" : "Nuevo Articulo"}
              </MDTypography>

              <MDBox>
                <Grid container spacing={2} mb={1}>

                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Lote
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="slot"
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.slot}
                          fullWidth
                          sx={{ "#mui-component-select-slot": { p: "0.75rem!important" } }}
                        // TODO: readOnly={!user.privileges.events.upsert}
                        >
                          <MenuItem value={1} sx={{ my: 0.5 }}>Lote 1</MenuItem>
                          <MenuItem value={2} sx={{ my: 0.5 }}>Lote 2</MenuItem>
                          <MenuItem value={3} sx={{ my: 0.5 }}>Lote 3</MenuItem>
                          <MenuItem value={4} sx={{ my: 0.5 }}>Lote 4</MenuItem>
                        </Select>
                      )}
                      rules={{
                        required: "Este campo es requerido"
                      }}
                    />
                    {
                      !!errors?.slot && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.slot.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Fecha de Ingreso
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <DatePicker
                          {...rest}
                          value={value}
                          onChange={newValue => {
                            return onChange(newValue);
                          }}
                          slotProps={{
                            openPickerButton: {
                              color: darkMode ? "white" : "info"

                            },
                          }}
                          sx={{ width: "100%" }}
                        // TODO: readOnly={!user.privileges.events.upsert}
                        />
                      )}
                      rules={{
                        required: "Este campo es obligatorio",
                        validate: {
                          isLuxonValid: value => !value.invalid || "Fecha Invalida",
                        }
                      }}
                    />
                    {
                      !!errors?.date && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.date.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                </Grid>

                <Grid container spacing={2} mb={1}>
                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Codigo
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("code", { required: "Este campo es obligatorio" })}
                      error={!!errors?.code}
                      placeholder="Codigo del articulo"
                      fullWidth
                    // TODO: readOnly={!user.privileges.events.upsert}
                    />
                    {
                      !!errors?.code && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.code.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Medidas
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="size"
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.size}
                          fullWidth
                        // TODO: readOnly={!user.privileges.events.upsert}
                        >
                          <MenuItem value="quarterGallon" sx={{ my: 0.5 }}>1&frasl;4 Galon</MenuItem>
                          <MenuItem value="oneGallon" sx={{ my: 0.5 }}>1 Galon</MenuItem>
                          <MenuItem value="fourGallons" sx={{ my: 0.5 }}>4 Galones</MenuItem>
                          <MenuItem value="fiveGallons" sx={{ my: 0.5 }}>5 Galones</MenuItem>
                          <MenuItem value="kit" sx={{ my: 0.5 }}>Kit (bicomponente)</MenuItem>
                        </Select>
                      )}
                      rules={{
                        required: "Este campo es requerido"
                      }}
                    />
                    {
                      !!errors?.size && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.size.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                </Grid>

                <MDBox mb={1}>
                  <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    Nombre del Producto
                    <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                  </MDTypography>
                  <MDInput
                    {...register("name", { required: "Este campo es obligatorio" })}
                    fullWidth
                    error={!!errors?.name}
                    placeholder="Ej: Gris Claro"
                  // TODO: readOnly={!user.privileges.events.upsert}
                  />
                  {
                    !!errors?.name && (
                      <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                        {errors?.name.message}
                      </MDTypography>
                    )
                  }
                </MDBox>

                <Grid container spacing={2} mb={1}>

                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Tipo
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="type"
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.type}
                          fullWidth
                          sx={{ "#mui-component-select-type": { p: "0.75rem!important" } }}
                        // TODO: readOnly={!user.privileges.events.upsert}
                        >
                          <MenuItem value="architectural" sx={{ my: 0.5 }}>Arquitectonico</MenuItem>
                          <MenuItem value="enamel" sx={{ my: 0.5 }}>Esmalte</MenuItem>
                          <MenuItem value="industrialAndMarine" sx={{ my: 0.5 }}>Industrial & Marina</MenuItem>
                        </Select>
                      )}
                      rules={{
                        required: "Este campo es requerido"
                      }}
                    />
                    {
                      !!errors?.type && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.type.message}
                        </MDTypography>
                      )
                    }
                  </Grid>
                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Clasificación
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="typeClass"
                      disabled={watchTypeSelection === "industrialAndMarine"}
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.typeClass}
                          fullWidth
                          sx={{ "#mui-component-select-typeClass": { p: "0.75rem!important" } }}
                        // TODO: readOnly={!user.privileges.events.upsert}
                        >
                          <MenuItem value="A" sx={{ my: 0.5 }}>Clase A</MenuItem>
                          <MenuItem value="B" sx={{ my: 0.5 }}>Clase B</MenuItem>
                          <MenuItem value="C" sx={{ my: 0.5 }}>Clase C</MenuItem>
                        </Select>
                      )}
                      rules={{
                        required: "Este campo es requerido"
                      }}
                    />
                    {
                      !!errors?.typeClass && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.typeClass.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                </Grid>

                <MDBox mb={1}>
                  <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    Observaciones
                  </MDTypography>
                  <MDInput
                    {...register("observations")}
                    multiline
                    rows={5}
                    fullWidth
                    inputProps={{ maxLength: 3000 }}
                    error={!!errors?.observations}
                    placeholder="Ej: Este pedido presenta.."
                  // TODO: readOnly={!user.privileges.events.upsert}
                  />
                  {
                    !!watchObservations?.length && (
                      <MDTypography mr={1} fontSize="small" color="text" fontWeight="light" align="right">
                        {watchObservations.length}/3000
                      </MDTypography>
                    )
                  }
                  {
                    !!errors?.observations && (
                      <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                        {errors?.observations.message}
                      </MDTypography>
                    )
                  }
                </MDBox>

                <MDBox mt={3} mb={1} display="flex" justifyContent="flex-between" width="100%">
                  <MDBox width="100%">
                    {/* // TODO: Boolean(Object.keys(item).length) && user.privileges.events.delete && */}
                    {
                      item?.id && (
                        <MDButton loading={isSubmitting} color="error" variant="gradient" onClick={null}>
                          <Lock sx={{ mr: 1 }} />
                          Eliminar
                        </MDButton>
                      )
                    }
                  </MDBox>
                  <MDBox display="flex" justifyContent="flex-end" gap={3} width="100%">
                    <MDButton color="dark" variant="text" onClick={close} sx={{ alignSelf: "center" }}>Cancelar</MDButton>
                    <MDButton loading={isSubmitting} color="info" variant="gradient" type="submit">Guardar</MDButton>
                  </MDBox>
                </MDBox>

              </MDBox>
            </MDBox>
          </LocalizationProvider>
        </SimpleBar>
      </Card>
    </Modal>
  )
}

ItemModalForm.propTypes = {
  item: PropTypes.object,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
}

export default ItemModalForm;