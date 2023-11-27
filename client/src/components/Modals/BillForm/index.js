import { useCallback, useEffect, useMemo } from "react";
// Libraries
import { Autocomplete, Card, Modal } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Controller, useForm } from "react-hook-form";
import { DateTime } from "luxon";
import lodash from "lodash";

// Data
import { useMaterialUIController } from "context";
import { useProducts } from "context/products.context";
import { useAuth } from "context/auth.context";

// Components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import colors from "assets/theme/base/colors";
import SelectedProducts from "./SelectedProducts";
import InputDocumentId from "./InputDocumentId";

// Utils
import { formatOnSubmitBillForm, formatBillFormEntryData, formatProductsForSelection } from "./utils/functions.utils";
import { useProviders } from "context/providers.context";
import { enqueueSnackbar } from "notistack";
import { Lock } from "@mui/icons-material";
import GetPasswordConsent from "components/GetPasswordConsent";


const INITIAL_VALUES = {
  _id: null,
  date: DateTime.now(),
  provider: {
    _id: null,
    name: null,
    phone: "",
    documentId: {
      type: "RIF",
      number: "",
    }
  },
  convertionRate: {
    rate: 0,
  },
  products: {
    selected: [],
    order: [],
  },
  observations: "",
}

const BillModalForm = ({ billData, open, close, onSubmit, onDelete }) => {
  const { user: userSession } = useAuth();
  const { products } = useProducts();
  const { providers, loadingProviders } = useProviders();
  const { register, control, handleSubmit, watch, reset, setValue, getValues, formState: { errors, isSubmitting } } = useForm({
    defaultValues: lodash.defaultsDeep(formatBillFormEntryData(billData, products), INITIAL_VALUES),
  });
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const selectedProducts = watch("products.selected");
  const documentIdType = watch("provider.documentId.type");
  const watchObservations = watch("observations");

  useEffect(() => { console.log(getValues()) }, [getValues]);

  const productsForSelection = useMemo(() => formatProductsForSelection(products), [products]);

  const isEditingBill = !lodash.isEmpty(billData);

  const onFormSubmit = async data => {
    try {
      const response = await onSubmit(formatOnSubmitBillForm(data));
      const submitMessage = isEditingBill ? "Se ha actualizado la factura exitosamente" : "Se creado la factura exitosamente"
      if (!response?.error) enqueueSnackbar(submitMessage, { variant: "success" })

      handleClose();
    } catch (err) {
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" })
    }
  };

  const handleBillDelete = async e => {
    try {
      const consent = await GetPasswordConsent({
        title: `Eliminar ${billData.code}`,
        description: "Ingrese su clave para eliminar la factura",
      });

      if (consent?.error || !consent) throw new Error(consent?.message ?? "Contraseña incorrecta");

      const response = await onDelete(billData);
      if (!response?.error) enqueueSnackbar("Se ha eliminado la factura exitosamente", { variant: "success" })

      handleClose();
    } catch (err) {
      if (err.target?.innerText.toLowerCase() === "cancelar") return; // Clicked "cancel" on password consent
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" })
    }
  }

  const handleClose = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return; // Do not close modal by accident
    reset();
    close();
  }

  const handleProductRemove = useCallback(productData => {
    const orderProducts = getValues("products.order")
    console.log({ productData, selectedProducts, orderProducts })
    const updatedSelectedProducts = selectedProducts.filter(product => {
      const productKey = product.name + product.code + product.type + product.typeClass;
      const productDataKey = productData.name + productData.code + productData.type.value + productData.typeClass;
      return productKey !== productDataKey
    })
    console.log(updatedSelectedProducts)
    setValue("products.selected", updatedSelectedProducts)

    const updatedOrderProducts = orderProducts.filter(product => {
      const productKey = product.name + product.code + product.type + product.typeClass;
      const productDataKey = productData.name + productData.code + productData.type.value + productData.typeClass;
      return productKey !== productDataKey
    })
    console.log(updatedOrderProducts)
    setValue("products.order", updatedOrderProducts)


  }, [getValues, selectedProducts, setValue]);

  const handleSelectedProductsDataChange = useCallback(newProductData => {
    const orderProducts = getValues("products.order")
    const isProductAlreadySaved = orderProducts.find(product => {
      const productKey = product.name + product.code + product.type + product.typeClass;
      const productDataKey = newProductData.name + newProductData.code + newProductData.type + newProductData.typeClass;
      return productKey === productDataKey
    });

    const updatedOrderProducts = !isProductAlreadySaved ? [...orderProducts, newProductData] : (
      orderProducts.map(product => {
        const productKey = product.name + product.code + product.type + product.typeClass;
        const productDataKey = newProductData.name + newProductData.code + newProductData.type + newProductData.typeClass;
        if (productKey !== productDataKey) return product;
        return newProductData;
      })
    )

    setValue("products.order", updatedOrderProducts);
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
          width: "600px",
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
                {isEditingBill ? "Editar Factura" : "Nueva Factura"}
              </MDTypography>

              <MDBox>
                <Grid container spacing={2} mb={1}>
                  {/* Provider Name */}
                  <Grid xs={6} md={7} lg={8}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Proveedor
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      name="provider.name"
                      control={control}
                      render={({ field: { onChange, ...rest } }) => (
                        <Autocomplete
                          {...rest}
                          fullWidth
                          loading={loadingProviders}
                          options={providers.map(provider => provider.name)}
                          getOptionLabel={(option) => option ?? ""}
                          noOptionsText="No hay proveedores registrados"
                          onChange={(e, providerName) => {
                            const selectedProvider = providers.find(provider => provider.name === providerName);
                            setValue("provider._id", selectedProvider._id);
                            setValue("provider.phone", selectedProvider.phone);
                            setValue("provider.documentId", selectedProvider.documentId);

                            return onChange(selectedProvider.name);
                          }}
                          isOptionEqualToValue={(option, value) => option.toLowerCase() === value?.toLowerCase()}
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              error={!!errors?.product?.name}
                              InputProps={{
                                ...params.InputProps,
                                readOnly: !userSession?.privileges?.inventory?.upsert,
                                endAdornment: null,
                              }}
                            />
                          )}
                        />
                      )}
                      rules={{
                        required: "Este campo es obligatorio",
                      }}
                    />
                    {
                      !!errors?.provider?.name && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.provider?.name?.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Date */}
                  <Grid xs={6} md={5} lg={4}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold">
                      Fecha de Factura
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
                          {errors?.date?.message}
                        </MDTypography>
                      )
                    }
                  </Grid>
                </Grid>

                <Grid container spacing={2} mb={1}>
                  {/* Phone */}
                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Telefono
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("provider.phone", {
                        required: "Este campo es obligatorio",
                        validate: {
                          hasSpaces: v => /\S/g.test(v) || "Evite el uso de espacios en blanco",
                          hasSpecialChars: v => {
                            const isValid = !/\W/gi.test(v.replaceAll(/\+/gi, ""));
                            return isValid || "Evite usar caracteres especiales exceptuando la suma \"+\"";
                          },
                          startsWithPlusSign: v => {
                            let isValid = true;
                            if (v.includes("+")) isValid = !v.split("+")[0].length;

                            return isValid || "El simbolo de suma '+' debe estar al inicio";
                          },
                          hasLetters: v => !isNaN(v.replaceAll(/\+/gi, "")) || "Evite el uso de letras",
                        }
                      })}
                      error={!!errors?.provider?.phone}
                      placeholder="Telefono del proveedor"
                      fullWidth
                      type="tel"
                      inputProps={{
                        readOnly: true,
                      }}
                    />
                    {
                      !!errors?.provider?.phone && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.provider?.phone?.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Document Id */}
                  <Grid xs={6}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Identificacion
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      name="provider.documentId.number"
                      control={control}
                      render={({ field }) => (
                        <InputDocumentId
                          {...field}
                          selectValue={documentIdType}
                          onSelectChange={value => setValue("provider.documentId.type", value)}
                          selectProps={{
                            readOnly: true,
                          }}
                          inputProps={{
                            readOnly: true,
                          }}
                        />
                      )}
                      rules={{
                        required: "Este campo es obligatorio",
                      }}
                    />
                    {
                      !!errors?.provider?.documentId?.type && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.provider?.documentId?.type?.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                </Grid>

                <Grid container spacing={2}>
                  <Grid xs={3} xsOffset={9}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Tasa del dolar
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("convertionRate.rate", {
                        required: "Este campo es obligatorio",
                        validate: {
                          isNotZero: v => v !== 0 || "No puede ser 0",
                          hasSpaces: v => /\S/g.test(v) || "Evite el uso de espacios en blanco",
                          hasSpecialChars: v => {
                            const isValid = !/\W/gi.test(`${v}`?.replaceAll(/[.]/gi, ""));
                            return isValid || "Evite usar caracteres especiales exceptuando el punto \".\"";
                          },
                          hasLetters: v => !isNaN(`${v}`.replaceAll(/[+.]/gi, "")) || "Evite el uso de letras",
                        }
                      })}
                      error={!!errors?.convertionRate?.rate}
                      sx={{ input: { textAlign: "right" } }}
                      InputProps={{
                        startAdornment: <MDTypography variant="caption">Bs.</MDTypography>,
                      }}
                    />
                    {
                      !!errors?.convertionRate?.rate && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.convertionRate?.rate?.message}
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
                        render={({ field: { onChange, ...rest } }) => (
                          <Autocomplete
                            {...rest}
                            fullWidth
                            multiple
                            options={productsForSelection}
                            getOptionLabel={(option) => {
                              const { code, name, type, typeClass } = option;
                              const optionLabel = `[${code}] ${name} - ${type.label} ${typeClass ? `"${typeClass}"` : ""}`;

                              return optionLabel;
                            }}
                            renderTags={() => null}
                            filterSelectedOptions
                            onChange={(event, newValue) => onChange(newValue)}
                            isOptionEqualToValue={(option, value) => {
                              const optionKey = option.code + option.name + option.type + option.typeClass;
                              const valueKey = value.code + value.name + value.type + value.typeClass;
                              return optionKey === valueKey
                            }}
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
                      products={selectedProducts}
                      onProductsDataChange={handleSelectedProductsDataChange}
                      onProductRemove={handleProductRemove}
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
                    placeholder="Ej: Proveedor tiene muchos accidentes durante la entrega.."
                    readOnly={!userSession.privileges.billing.upsert}
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

                {/* Buttons */}
                <MDBox mt={3} mb={1} display="flex" justifyContent="flex-between" width="100%">
                  <MDBox width="100%">
                    {
                      isEditingBill && userSession?.privileges?.inventory?.delete &&
                      (
                        <MDButton loading={isSubmitting} color="error" variant="gradient" onClick={handleBillDelete}>
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
    </Modal >
  )
}

BillModalForm.defaultProps = {
  billData: {},
  onSubmit: console.log,
}

BillModalForm.propTypes = {
  billData: PropTypes.object,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
}

export default BillModalForm;