import { useCallback } from "react";
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

// Context
import { useAuth } from "context/auth.context";
import { useMaterialUIController } from "context";
import useProducts from "context/products.context";

// Components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import colors from "assets/theme/base/colors";
import SelectedProducts from "./SelectedProducts";
import GetPasswordConsent from "components/GetPasswordConsent";

// Utils
import { formatOnSubmitShippingsForm, formatSelectedProductsData, formatShippingsFormEntryData, formatSelectionProducts } from "./utils/functions.utils";

const INITIAL_VALUES = {
  id: null,
  date: DateTime.now(),
  store: "",
  products: {
    selected: [],
    shipping: [],
  },
  observations: "",
}

const ShippingModalForm = ({ shippingData, open, close, onSubmit, onDelete }) => {
  const { user: userSession } = useAuth();
  const { products } = useProducts();

  const { register, control, handleSubmit, watch, setValue, getValues, formState: { errors, isDirty, isSubmitting } } = useForm({
    defaultValues: lodash.defaultsDeep(formatShippingsFormEntryData(shippingData), INITIAL_VALUES),
  });
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const selectedProducts = watch("products.selected");
  const watchObservations = watch("observations");

  const isEditing = !lodash.isEmpty(shippingData);

  const handleShippingDelete = async event => {
    const data = formatOnSubmitShippingsForm(getValues());

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
      await onSubmit(formatOnSubmitShippingsForm(data));
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

  const handleProductRemove = useCallback(productData => {
    const newSelectedProducts = selectedProducts.filter(product => product._id !== productData._id)
    setValue("products.selected", newSelectedProducts)
  }, [selectedProducts, setValue]);

  const handleSelectedProductsDataChange = useCallback(newProductData => {
    const shippingProducts = getValues("products.shipping");
    const isProductAlreadySaved = shippingProducts.find(product => product._id === newProductData._id);

    const updatedShippingProducts = !isProductAlreadySaved ? [...shippingProducts, newProductData] : (
      shippingProducts.map(product => {
        if (product._id !== newProductData._id) return product;
        return newProductData;
      })
    )

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
                {shippingData?._id ? "Editar Envio" : "Nuevo Envio"}
              </MDTypography>

              <MDBox>
                <Grid container spacing={2} mb={1}>
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

                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold">
                      Tienda
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="store"
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.store}
                          fullWidth
                          sx={{ "#mui-component-select-store": { p: "0.75rem!important" } }}
                          readOnly={!userSession.privileges.shippings.upsert}
                        >
                          <MenuItem value={1} sx={{ my: 0.5 }}>Local 1</MenuItem>
                          <MenuItem value={2} sx={{ my: 0.5 }}>Local 2</MenuItem>
                          <MenuItem value={3} sx={{ my: 0.5 }}>Local 3</MenuItem>
                          <MenuItem value={4} sx={{ my: 0.5 }}>Local 4</MenuItem>
                        </Select>
                      )}
                      rules={{
                        required: "Este campo es requerido"
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
                </Grid>

                <MDBox mb={1}>
                  <MDTypography ml={1} component="label" variant="caption" fontWeight="bold">
                    Productos a Enviar
                    <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                  </MDTypography>
                  <MDBox p={1} borderRadius="lg" sx={{ border: `1px solid ${colors.grey[400]}` }}>
                    <MDBox mx="auto" mb={2}>
                      <Controller
                        name="products.selected"
                        control={control}
                        render={({ field: { value, onChange, ...rest } }) => (
                          <Autocomplete
                            {...rest}
                            fullWidth
                            multiple
                            options={formatSelectionProducts(products)}
                            getOptionLabel={(option) => `[${option.code}] ${option.name} - ${option.type.label} ${option?.typeClass ? `"${option.typeClass}"` : ""}`}
                            renderTags={() => null}
                            filterSelectedOptions
                            value={value}
                            onChange={(event, newValue) => onChange(newValue)}
                            isOptionEqualToValue={(option, value) => option._id === (value?._id || value)}
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
                    <SelectedProducts
                      products={formatSelectedProductsData(selectedProducts)}
                      onProductsDataChange={handleSelectedProductsDataChange}
                      onProductRemove={handleProductRemove}
                    />
                    {
                      !!errors?.products && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.products.message}
                        </MDTypography>
                      )
                    }
                  </MDBox>
                </MDBox>


                <MDBox mb={1}>
                  <MDTypography ml={1} component="label" variant="caption" fontWeight="bold">
                    Observaciones
                  </MDTypography>
                  <MDInput
                    {...register("observations")}
                    multiline
                    rows={5}
                    fullWidth
                    inputProps={{ maxLength: 3000 }}
                    error={!!errors?.observations}
                    placeholder="Ej: Envio realizado con mal tiempo.."
                    readOnly={!userSession.privileges.shippings.upsert}
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
                      isEditing && userSession.privileges.shippings.delete && (
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
                    <MDButton loading={isSubmitting} disabled={!isDirty} color="info" variant="gradient" type="submit">
                      Guardar
                    </MDButton>
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