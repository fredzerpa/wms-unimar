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
import lodash from "lodash";
import { enqueueSnackbar } from "notistack";

// Components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Context
import { useMaterialUIController } from "context";
import { useAuth } from "context/auth.context";
import { formatItemEntryData } from "./utils/functions.utils";
import GetPasswordConsent from "components/GetPasswordConsent";

const INITIAL_VALUES = {
  id: null,
  slot: "",
  date: DateTime.now(),
  code: "",
  quantity: 0,
  size: {
    value: "",
    label: "",
  },
  name: "",
  type: {
    value: "",
    label: "",
  },
  typeClass: "",
  observations: "",
}
const ProductModalForm = ({ item, open, close, onSubmit, onDelete }) => {
  const { user: userSession } = useAuth();
  const { register, control, handleSubmit, watch, formState: { errors, isDirty, isSubmitting } } = useForm({
    values: lodash.defaultsDeep(formatItemEntryData(item), INITIAL_VALUES),
  });
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const isEditingProduct = !lodash.isEmpty(item);

  const watchTypeSelection = watch("type.value");
  const watchObservations = watch("observations");

  const handleProductDelete = async data => {
    const consent = await GetPasswordConsent({
      title: `Eliminar ${data.name}`,
      description: "Ingrese su clave para eliminar el registro",
    });

    if (consent?.error || !consent) throw new Error(consent?.message || "Contraseña incorrecta");
    
    try {
      await onDelete(data);
    } catch (err) {
      console.error(err);
    } finally {
      handleClose();
    }
  }

  const onFormSubmit = async data => {
    try {
      await onSubmit(data);
    } catch (err) {
      console.error(err);
    } finally {
      handleClose();
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return; // Do not close modal by accident
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
        onSubmit={handleSubmit(onFormSubmit)}
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
                {isEditingProduct ? "Editar Producto" : "Nuevo Producto"}
              </MDTypography>

              <MDBox>
                <Grid container spacing={2}>

                  {/* Slot */}
                  <Grid xs={6} display={{ xs: isEditingProduct ? "block" : "none" }}>
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
                          readOnly={!userSession?.privileges?.inventory?.upsert}
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

                  {/* Date */}
                  <Grid xs={6} display={{ xs: isEditingProduct ? "block" : "none" }}>
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
                          readOnly={!userSession?.privileges?.inventory?.upsert}
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

                  {/* Name */}
                  <Grid xs={7}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Nombre del Producto
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("name", { required: "Este campo es obligatorio" })}
                      fullWidth
                      error={!!errors?.name}
                      placeholder="Ej: Gris Claro"
                      readOnly={!userSession?.privileges?.inventory?.upsert}
                    />
                    {
                      !!errors?.name && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.name.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Code */}
                  <Grid xs={5}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Codigo
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("code", { required: "Este campo es obligatorio" })}
                      error={!!errors?.code}
                      placeholder="Codigo del articulo"
                      fullWidth
                      readOnly={!userSession?.privileges?.inventory?.upsert}
                    />
                    {
                      !!errors?.code && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.code.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Type */}
                  <Grid xs={6} display={{ xs: isEditingProduct ? "block" : "none" }}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Tipo
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="type.value"
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.type}
                          fullWidth
                          sx={{ "#mui-component-select-type": { p: "0.75rem!important" } }}
                          readOnly={!userSession?.privileges?.inventory?.upsert}
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

                  {/* Type Class */}
                  <Grid xs={6} display={{ xs: isEditingProduct ? "block" : "none" }}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Clasificación
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="typeClass"
                      render={({ field: { value, ...rest } }) => (
                        <Select
                          {...rest}
                          value={value ?? ""}
                          error={!!errors?.typeClass}
                          fullWidth
                          sx={{ "#mui-component-select-typeClass": { p: "0.75rem!important" } }}
                          readOnly={!userSession?.privileges?.inventory?.upsert}
                          disabled={watchTypeSelection === "industrialAndMarine"}
                          onClickCapture={(event) => {
                            if (watchTypeSelection === "industrialAndMarine") {
                              return enqueueSnackbar(
                                '"Industrial & Marina" no poseen clasificación',
                                { variant: "warning" }
                              );
                            }
                          }}
                        >
                          <MenuItem value="A" sx={{ my: 0.5 }}>Clase A</MenuItem>
                          <MenuItem value="B" sx={{ my: 0.5 }}>Clase B</MenuItem>
                          <MenuItem value="C" sx={{ my: 0.5 }}>Clase C</MenuItem>
                        </Select>
                      )}
                      rules={{
                        validate: {
                          isRequired: value => (watchTypeSelection === "industrialAndMarine" || value) || "Necesario"
                        }
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

                  {/* Size */}
                  <Grid xs={6} display={{ xs: isEditingProduct ? "block" : "none" }}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Medidas
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="size.value"
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.size}
                          fullWidth
                          readOnly={!userSession?.privileges?.inventory?.upsert}
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

                  {/* Quantity */}
                  <Grid xs={6} display={{ xs: isEditingProduct ? "block" : "none" }}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Cantidad
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("quantity", { required: "Este campo es obligatorio" })}
                      fullWidth
                      required
                      readOnly={!userSession?.privileges?.inventory?.upsert}
                      error={!!errors?.quantity}
                      inputProps={{
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        onInvalid: e => e.target.setCustomValidity("Use numeros unicamente para expresar este valor"),
                        onInput: e => e.target.setCustomValidity(""),
                      }}
                    />
                    {
                      !!errors?.quantity && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.quantity.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Comments */}
                  <Grid xs={12} display={{ xs: isEditingProduct ? "block" : "none" }}>
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
                      readOnly={!userSession?.privileges?.inventory?.upsert}
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
                  </Grid>

                </Grid>

                {/* Buttons */}
                <MDBox mt={3} mb={1} display="flex" justifyContent="flex-between" width="100%">
                  <MDBox width="100%">
                    {
                      isEditingProduct && userSession?.privileges?.inventory?.delete &&
                      (
                        <MDButton loading={isSubmitting} color="error" variant="gradient" onClick={handleProductDelete}>
                          <Lock sx={{ mr: 1 }} />
                          Eliminar
                        </MDButton>
                      )
                    }
                  </MDBox>
                  <MDBox display="flex" justifyContent="flex-end" gap={3} width="100%">
                    <MDButton color="dark" variant="text" onClick={close} sx={{ alignSelf: "center" }}>Cancelar</MDButton>
                    <MDButton loading={isSubmitting} disabled={!isDirty} color="info" variant="gradient" type="submit">Guardar</MDButton>
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

ProductModalForm.defaultProps = {
  onSubmit: async data => await console.log(new Promise((res, rej) => setTimeout(() => res(data), 3000))),
  onDelete: async data => await console.log(new Promise((res, rej) => setTimeout(() => res(data), 3000))),
}

ProductModalForm.propTypes = {
  item: PropTypes.object,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default ProductModalForm;