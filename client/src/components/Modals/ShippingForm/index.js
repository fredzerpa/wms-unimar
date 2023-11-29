import { useCallback, useMemo } from "react";
// Libraries
import { Autocomplete, Card, MenuItem, Modal, Select } from "@mui/material";
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

// Context
import { useAuth } from "context/auth.context";
import { useMaterialUIController } from "context";
import { useInventory } from "context/inventory.context";
import { useStores } from "context/stores.context";

// Components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import colors from "assets/theme/base/colors";
import SelectedProducts from "./SelectedProducts";
import GetPasswordConsent from "components/GetPasswordConsent";

// Utils
import { formatOnSubmitShippingsForm, formatShippingsFormEntryData, groupInventoryStockByProduct } from "./utils/functions.utils";


const INITIAL_VALUES = {
  _id: null,
  code: "",
  date: DateTime.now(),
  store: null,
  products: {
    selected: [],
    shipping: [],
  },
  status: "pending",
  observations: "",
}

const ShippingModalForm = ({ shippingData, open, close, onSubmit, onDelete }) => {
  const { user: userSession } = useAuth();
  const { inventory } = useInventory();
  const { stores, loadingStores } = useStores();

  const productsStock = useMemo(() => groupInventoryStockByProduct(inventory), [inventory]);

  const { register, control, handleSubmit, watch, setValue, getValues, formState: { errors, isDirty, isSubmitting } } = useForm({
    defaultValues: lodash.defaultsDeep(formatShippingsFormEntryData(shippingData), INITIAL_VALUES),
  });
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const selectedProducts = watch("products.selected");
  const watchObservations = watch("observations");

  const isEditingShipping = useMemo(() => !lodash.isEmpty(shippingData), [shippingData]);

  const handleShippingDelete = async event => {
    try {
      const consent = await GetPasswordConsent({
        title: `Eliminar envio`,
        description: "Ingrese su clave para eliminar el envio",
      });

      if (consent?.error || !consent) throw new Error(consent?.message ?? "Contraseña incorrecta");

      const response = await onDelete(shippingData);
      if (!response?.error) enqueueSnackbar("Se ha eliminado el envio exitosamente", { variant: "success" })

      handleClose();
    } catch (err) {
      if (err.target?.innerText.toLowerCase() === "cancelar") return; // Clicked "cancel" on password consent
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" })
    }
  }

  const onFormSubmit = async data => {
    console.log(formatOnSubmitShippingsForm(data))
    try {
      const response = await onSubmit(formatOnSubmitShippingsForm(data));
      const submitMessage = isEditingShipping ? "Se ha actualizado el producto exitosamente" : "Se creado el producto exitosamente"
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

  const handleSelectedProductRemove = useCallback(productData => {
    const updatedSelectedProducts = selectedProducts.filter(product => product._id !== productData._id)
    setValue("products.selected", updatedSelectedProducts)

    const shippingProducts = getValues("products.shipping");
    const updatedShippingProducts = shippingProducts.filter(product => product._id !== productData._id)
    setValue("products.shipping", updatedShippingProducts)
  }, [getValues, selectedProducts, setValue]);

  const handleSelectedProductsDataChange = useCallback(newProductData => {
    const shippingProducts = getValues("products.shipping");
    const shippingIndex = shippingProducts.findIndex(product => product._id === newProductData._id);

    const isOnShipping = shippingIndex >= 0;
    const updatedShippingProducts = isOnShipping ?
      shippingProducts.map((product, idx) => {
        return idx === shippingIndex ? newProductData : product
      })
      :
      [...shippingProducts, newProductData]

    setValue("products.shipping", updatedShippingProducts);
  }, [getValues, setValue])

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
            maxHeight: "90vh",
          }}
        >
          <LocalizationProvider dateAdapter={AdapterLuxon} adapterLocale="es-es">
            <MDBox p={3}>
              <MDTypography variant="h4" fontWeight="medium" gutterBottom>
                {
                  userSession?.privileges?.shippings?.upsert ?
                    isEditingShipping ? "Editar" : "Nuevo"
                    : "Detalles de"
                } Envio
              </MDTypography>

              <MDBox>
                <Grid container spacing={2} mb={1}>

                  {/* Code */}
                  <Grid xs={6} display={isEditingShipping ? "block" : "none"}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Codigo
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("code")}
                      fullWidth
                      error={!!errors?.code}
                      inputProps={{
                        readOnly: true,
                      }}
                    />
                    {
                      !!errors?.code && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.code.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Date */}
                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold">
                      Fecha de Envio
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      name="date"
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <DatePicker
                          {...rest}
                          value={value}
                          onChange={newValue => onChange(newValue)}
                          slotProps={{
                            openPickerButton: {
                              color: darkMode ? "white" : "info"
                            },
                          }}
                          sx={{ width: "100%" }}
                          readOnly={!userSession?.privileges?.shippings?.upsert}
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

                  {/* Store */}
                  <Grid xs={7}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold">
                      Tienda
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="store"
                      render={({ field: { onChange, ...rest } }) => (
                        <Autocomplete
                          {...rest}
                          fullWidth
                          loading={loadingStores}
                          options={stores}
                          getOptionLabel={(option) => option?.name ?? ""}
                          autoComplete
                          onChange={(event, newValue) => onChange(newValue)}
                          isOptionEqualToValue={(option, value) => option._id === value?._id}
                          readOnly={!userSession.privileges.shippings.upsert}
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: null,
                              }}
                            />
                          )}
                        />
                      )}
                      rules={{
                        required: "Este campo es obligatorio"
                      }}
                    />
                    {
                      !!errors?.store && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.store.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Status */}
                  <Grid xs={5}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold">
                      Estado
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="status"
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.product?.status}
                          fullWidth
                          readOnly={!userSession?.privileges?.inventory?.upsert}
                        >
                          <MenuItem value="pending" sx={{ my: 0.5 }}>Pendiente</MenuItem>
                          <MenuItem value="completed" sx={{ my: 0.5 }}>Completado</MenuItem>
                          <MenuItem value="canceled" sx={{ my: 0.5 }}>Cancelado</MenuItem>
                        </Select>
                      )}
                      rules={{
                        required: "Este campo es obligatorio"
                      }}
                    />
                    {
                      !!errors?.status && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.status.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                </Grid>

                {/* Products */}
                <MDBox mb={1}>
                  <MDTypography ml={1} component="label" variant="caption" fontWeight="bold">
                    Productos a Enviar
                    <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                  </MDTypography>
                  <MDBox p={1} borderRadius="lg" sx={{ border: `1px solid ${colors.grey[400]}` }}>
                    {
                      userSession?.privileges?.shippings?.upsert && (
                        <MDBox mx="auto" mb={2}>
                          <Controller
                            name="products.selected"
                            control={control}
                            render={({ field: { onChange, ...rest } }) => (
                              <Autocomplete
                                {...rest}
                                fullWidth
                                multiple
                                options={productsStock}
                                getOptionLabel={(option) => {
                                  const { code, name, type, typeClass } = option;
                                  const optionLabel = `[${code}] ${name} - ${type.label} "${typeClass}"`

                                  return optionLabel + (option.onStock?.length ? "" : "(Sin Stock)");
                                }}
                                noOptionsText="No se encontraron opciones"
                                getOptionDisabled={(option) => !option.onStock.length}
                                renderTags={() => null}
                                readOnly={!userSession?.privileges?.shippings?.upsert}
                                filterSelectedOptions
                                onChange={(event, newValue) => onChange(newValue)}
                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                renderInput={(params) => (
                                  <MDInput
                                    {...params}
                                    placeholder="Buscar productos"
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: null,
                                    }}
                                  />
                                )}
                              />
                            )}
                            rules={{
                              required: "Escoja al menos 1 producto",
                            }}
                          />
                        </MDBox>
                      )
                    }

                    <SelectedProducts
                      products={selectedProducts}
                      onProductsDataChange={handleSelectedProductsDataChange}
                      onProductRemove={handleSelectedProductRemove}
                      readOnly={!userSession?.privileges?.shippings?.upsert}
                    />
                    {
                      !!errors?.products?.selected && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.products?.selected.message}
                        </MDTypography>
                      )
                    }
                  </MDBox>
                </MDBox>

                {/* Observations */}
                <MDBox mb={1}>
                  <MDTypography ml={1} component="label" variant="caption" fontWeight="bold">
                    Observaciones
                  </MDTypography>
                  <MDInput
                    {...register("observations")}
                    multiline
                    rows={5}
                    fullWidth
                    error={!!errors?.observations}
                    placeholder="Ej: Envio realizado con mal tiempo.."
                    inputProps={{
                      readOnly: !userSession?.privileges?.shippings?.upsert,
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
                </MDBox>

                <MDBox mt={3} mb={1} display="flex" justifyContent="flex-between" width="100%">
                  <MDBox width="100%">
                    {
                      isEditingShipping && userSession.privileges.shippings.delete && (
                        <MDButton loading={isSubmitting} color="error" variant="gradient" onClick={handleShippingDelete}>
                          <Lock sx={{ mr: 1 }} />
                          Eliminar
                        </MDButton>
                      )
                    }
                  </MDBox>
                  <MDBox display="flex" justifyContent="flex-end" gap={3} width="100%">
                    <MDButton loading={isSubmitting} variant="contained" onClick={handleClose} sx={{ alignSelf: "center" }}>
                      Cancelar
                    </MDButton>
                    {
                      userSession?.privileges?.shippings?.upsert && (
                        <MDButton loading={isSubmitting} disabled={!isEditingShipping && !isDirty} color="info" variant="gradient" type="submit">
                          Guardar
                        </MDButton>
                      )
                    }
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

ShippingModalForm.defaultProps = {
  onSubmit: async data => await console.log(new Promise((res, rej) => setTimeout(() => res(data), 3000))),
  onDelete: async data => await console.log(new Promise((res, rej) => setTimeout(() => res(data), 3000))),
}


ShippingModalForm.propTypes = {
  item: PropTypes.object,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
}

export default ShippingModalForm;