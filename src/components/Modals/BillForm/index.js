import { useCallback, useEffect, useState } from "react";
// Libraries
import { Autocomplete, Card, InputAdornment, Modal } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Controller, useForm } from "react-hook-form";
import { DateTime } from "luxon";
import { Lock, Search } from "@mui/icons-material";
import lodash from "lodash";

// Data
import { useMaterialUIController } from "context";
import useProducts from "context/products.context";
import { useBills } from "context/bills.context";
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
import { formatOnSubmitBillForm, formatBillFormEntryData, addProductsLabel, getAllRecordedProviders } from "./utils/functions.utils";


const INITIAL_VALUES = {
  _id: null,
  date: DateTime.now(),
  provider: {
    name: "",
    phone: "",
    documentId: {
      type: "RIF",
      number: "",
    }
  },
  convertionRate: {
    rate: 0,
    date: DateTime.now(),
  },
  products: [],
  observations: "",
}

const BillModalForm = ({ billData, open, close, onSubmit }) => {
  const { user: userSession } = useAuth();
  const { products } = useProducts();
  const { bills, loadingBills } = useBills();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { register, control, handleSubmit, watch, reset, setValue, getValues, formState: { errors, defaultValues } } = useForm({
    defaultValues: lodash.defaultsDeep(formatBillFormEntryData(billData, products), INITIAL_VALUES),
  });
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const selectedProducts = watch("products");
  const providerName = watch("provider.name");
  const documentIdType = watch("provider.documentId.type");
  const watchObservations = watch("observations");

  console.log(defaultValues)
  console.log(selectedProducts)
  useEffect(() => console.log(providerName), [providerName])

  const isEditing = !lodash.isEmpty(billData);

  const onFormSubmit = async data => {
    try {
      console.log(data);
      setIsSubmitting(true);
      await new Promise((res, rej) => setTimeout(() => res(true), 3000));
      onSubmit(formatOnSubmitBillForm(data));
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      handleClose();
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "backdropClick" || reason === "escapeKeyDown") return; // Do not close modal by accident
    reset();
    close();
  }

  const handleProductRemove = useCallback(productData => {
    const newSelectedProducts = selectedProducts.filter(product => product._id !== productData._id)
    setValue("products", newSelectedProducts)
  }, [selectedProducts, setValue]);

  const handleSelectedProductsDataChange = useCallback(newProductData => {
    const shippingProducts = getValues("products");
    const isProductAlreadySaved = shippingProducts.find(product => product._id === newProductData._id);

    const updatedShippingProducts = !isProductAlreadySaved ? [...shippingProducts, newProductData] : (
      shippingProducts.map(product => {
        if (product._id !== newProductData._id) return product;
        return newProductData;
      })
    )

    setValue("products", updatedShippingProducts);
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
                {isEditing ? "Editar Factura" : "Nueva Factura"}
              </MDTypography>

              <MDBox>
                <Grid container spacing={2} mb={1}>
                  <Grid xs={6} md={7} lg={8}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Proveedor
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      name="provider.name"
                      control={control}
                      render={({ field: { value, onChange, ...rest } }) => (
                        <Autocomplete
                          {...rest}
                          fullWidth
                          loading={loadingBills}
                          options={getAllRecordedProviders(bills)}
                          getOptionLabel={(option) => option?.name ?? ""}
                          value={value}
                          freeSolo
                          onBlur={({ target }) => {
                            const { value: newValue } = target;
                            console.log(newValue)
                            if (!newValue) return;
                            if (typeof newValue !== "object") {
                              const providerData = getAllRecordedProviders(bills).find(provider => provider?.name?.toLowerCase() === newValue?.toLowerCase());
                              console.log({ newValue, providerData })
                              setValue("provider.phone", providerData?.phone ?? "")
                              setValue("provider.documentId.type", providerData?.documentId.type ?? "")
                              setValue("provider.documentId.number", providerData?.documentId.number ?? "")
                              return onChange(providerData?.name ?? newValue)
                            }
                          }}
                          noOptionsText="No hay proveedores registrados"
                          onChange={(event, newValue) => {
                            console.log(newValue)
                            if (!newValue) return;
                            if (typeof newValue === "object") {
                              const { name, phone, documentId } = newValue;
                              setValue("provider.phone", phone ?? "")
                              setValue("provider.documentId.type", documentId?.type ?? "")
                              setValue("provider.documentId.number", documentId?.number ?? "")
                              return onChange(name ?? "");
                            }
                          }}
                          isOptionEqualToValue={(option, value) => option.name.toLowerCase() === value?.toLowerCase()}
                          renderInput={(params) => (
                            <MDInput
                              {...params}
                              placeholder="Ej: Distruibidor Pinta Hogar"
                              error={!!errors?.provider?.name}
                              InputProps={{
                                ...params.InputProps,
                                endAdornment: null,
                              }}
                              value={value}
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
                    />
                    {
                      !!errors?.provider?.phone && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.provider?.phone?.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

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
                      sx={{ input: { textAlign: "right" } }}
                      InputProps={{
                        startAdornment: "Bs. ",
                      }}
                    />
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
                        name="products"
                        control={control}
                        render={({ field: { value, onChange, ...rest } }) => (
                          <Autocomplete
                            {...rest}
                            fullWidth
                            multiple
                            options={addProductsLabel(products)}
                            getOptionLabel={(option) => `${option.name} - ${option.type.label} ${option?.typeClass ? `"${option.typeClass}"` : ""}`}
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
                                  endAdornment: <InputAdornment position="end"><Search color="text" /></InputAdornment>,
                                  style: { paddingRight: "0.75rem" }
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

                <MDBox mt={3} mb={1} display="flex" justifyContent="flex-between" width="100%">
                  <MDBox width="100%">
                    {
                      isEditing && userSession.privileges.billing.delete && (
                        <MDButton loading={isSubmitting} color="error" variant="gradient" onClick={null}>
                          <Lock sx={{ mr: 1 }} />
                          Eliminar
                        </MDButton>
                      )
                    }
                  </MDBox>
                  <MDBox display="flex" justifyContent="flex-end" gap={3} width="100%">
                    <MDButton loading={isSubmitting} variant="contained" onClick={handleClose} sx={{ alignSelf: "center" }}>Cancelar</MDButton>
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