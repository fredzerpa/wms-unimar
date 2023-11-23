// Libraries
import { useMemo } from "react";
import { Autocomplete, Card, MenuItem, Modal, Select, TextField } from "@mui/material";
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
import GetPasswordConsent from "components/GetPasswordConsent";

// Utils
import { formatInventoryRecordSubmitData, formatItemEntryData } from "./utils/functions.utils";

// Context
import { useMaterialUIController } from "context";
import { useAuth } from "context/auth.context";
import { useProducts } from "context/products.context";


const INITIAL_VALUES = {
  _id: null,
  slot: "",
  entryDate: DateTime.now(),
  expirationDate: DateTime.now(),
  product: {
    name: null,
    code: "",
    size: {
      value: "",
      label: "",
    },
    type: {
      value: "",
      label: "",
    },
    typeClass: "",
  },
  onStock: 0,
  observations: "",
}
const InventoryRecordModalForm = ({ recordData, open, close, onSubmit, onDelete }) => {
  const { user: userSession } = useAuth();
  const { products, loadingProducts } = useProducts();
  const { register, control, handleSubmit, watch, setValue, formState: { errors, isDirty, isSubmitting } } = useForm({
    values: lodash.defaultsDeep(formatItemEntryData(recordData), INITIAL_VALUES),
    shouldFocusError: true,
  });
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const isEditingProduct = useMemo(() => !lodash.isEmpty(recordData), [recordData]);

  const watchTypeSelection = watch("product.type.value");
  const watchObservations = watch("observations");

  const handleProductDelete = async e => {
    try {
      const consent = await GetPasswordConsent({
        title: `Eliminar registro de inventario`,
        description: "Ingrese su clave para eliminar el registro",
      });

      if (consent?.error || !consent) throw new Error(consent?.message ?? "Contraseña incorrecta");

      const response = await onDelete(recordData);
      if (!response?.error) enqueueSnackbar("Se ha eliminado el registro exitosamente", { variant: "success" })

      handleClose();
    } catch (err) {
      if (err.target?.innerText.toLowerCase() === "cancelar") return; // Clicked "cancel" on password consent
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" })
    }
  }

  const onFormSubmit = async data => {
    try {
      const formattedData = formatInventoryRecordSubmitData(data);
      const response = await onSubmit(formattedData);

      const submitMessage = isEditingProduct ? "Se ha actualizado el registro exitosamente" : "Se creado el registro exitosamente"
      if (!response?.error) enqueueSnackbar(submitMessage, { variant: "success" })

      handleClose();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" })
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
                {isEditingProduct ? "Editar Registro" : "Nuevo Producto"}
              </MDTypography>

              <MDBox>
                <Grid container spacing={2}>

                  {/* Slot */}
                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Lote
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("slot", { required: "Este campo es obligatorio" })}
                      error={!!errors?.slot}
                      fullWidth
                      inputProps={{
                        readOnly: !userSession?.privileges?.inventory?.upsert,
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

                  {/* Entry Date */}
                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Fecha de Ingreso
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      name="entryDate"
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
                      !!errors?.entryDate && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.entryDate.message}
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
                    <Controller
                      control={control}
                      name="product.name"
                      render={({ field }) => (
                        <Autocomplete
                          {...field}
                          fullWidth
                          loading={loadingProducts}
                          options={products.map(product => product.name)}
                          getOptionLabel={(option) => option ?? ""}
                          noOptionsText="No hay productos registrados"
                          onChange={(e, productName) => {
                            const selectedProduct = products.find(product => product.name === productName);
                            setValue("product.code", selectedProduct.code);

                            return field.onChange(selectedProduct.name);
                          }}
                          isOptionEqualToValue={(option, value) => option.toLowerCase() === value?.toLowerCase()}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder="Ej: Gris Claro"
                              error={!!errors?.product?.name}
                              readOnly={!userSession?.privileges?.inventory?.upsert}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: null,
                              }}
                            />
                          )}
                        />
                      )}
                    />
                    {
                      !!errors?.product?.name && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.product?.name.message}
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
                      {...register("product.code", { required: "Este campo es obligatorio" })}
                      error={!!errors?.product?.code}
                      placeholder="Codigo del articulo"
                      fullWidth
                      inputProps={{
                        readOnly: true,
                      }}
                    />
                    {
                      !!errors?.product?.code && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.product?.code.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Type */}
                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Tipo
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="product.type.value"
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.product?.type}
                          fullWidth
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
                      !!errors?.product?.type && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.product?.type.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Type Class */}
                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Clasificación
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="product.typeClass"
                      render={({ field: { value, ...rest } }) => (
                        <Select
                          {...rest}
                          value={value ?? ""}
                          error={!!errors?.product?.typeClass}
                          fullWidth
                          readOnly={!userSession?.privileges?.inventory?.upsert}
                          disabled={!watchTypeSelection || watchTypeSelection === "industrialAndMarine"}
                          onClickCapture={(event) => {
                            if (!watchTypeSelection) {
                              return enqueueSnackbar(
                                'Escoja un tipo',
                                { variant: "warning" }
                              );
                            }
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
                          isRequired: value => (watchTypeSelection === "industrialAndMarine" || !!value) || "Este campo es requerido"
                        }
                      }}
                    />
                    {
                      !!errors?.product?.typeClass && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.product?.typeClass.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Expiration Date */}
                  <Grid xs={4}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Fecha de Vencimiento
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      name="expirationDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
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
                      !!errors?.expirationDate && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.expirationDate.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Size */}
                  <Grid xs={5}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Medidas
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="product.size.value"
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.product?.size}
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
                      !!errors?.product?.size && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.product?.size.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Quantity */}
                  <Grid xs={3}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      En Almacen
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("onStock", { required: "Este campo es obligatorio" })}
                      fullWidth
                      required
                      error={!!errors?.onStock}
                      inputProps={{
                        readOnly: !userSession?.privileges?.inventory?.upsert,
                        inputMode: "numeric",
                        pattern: "[0-9]*",
                        onInvalid: e => e.target.setCustomValidity("Use numeros unicamente para expresar este valor"),
                        onInput: e => e.target.setCustomValidity(""),
                      }}
                    />
                    {
                      !!errors?.onStock && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.onStock.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Comments */}
                  <Grid xs={12}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Observaciones
                    </MDTypography>
                    <MDInput
                      {...register("observations")}
                      multiline
                      rows={5}
                      fullWidth
                      error={!!errors?.observations}
                      placeholder="Ej: Este pedido presenta.."
                      inputProps={{
                        readOnly: true,
                        maxLength: 3000,
                      }}
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

InventoryRecordModalForm.defaultProps = {
  onSubmit: async data => await console.log(new Promise((res, rej) => setTimeout(() => res(data), 3000))),
  onDelete: async data => await console.log(new Promise((res, rej) => setTimeout(() => res(data), 3000))),
}

InventoryRecordModalForm.propTypes = {
  recordData: PropTypes.object,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default InventoryRecordModalForm;