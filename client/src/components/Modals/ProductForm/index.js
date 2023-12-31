// Libraries
import { Card, MenuItem, Modal, Select } from "@mui/material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";
import { LocalizationProvider } from "@mui/x-date-pickers";
import PropTypes from "prop-types";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { Controller, useForm } from "react-hook-form";
import { Lock } from "@mui/icons-material";
import lodash from "lodash";
import { enqueueSnackbar } from "notistack";

// Components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";

// Context
import { useAuth } from "context/auth.context";
import { formatProductSubmitData, formatProductEntryData } from "./utils/functions.utils";
import GetPasswordConsent from "components/GetPasswordConsent";
import { useMemo } from "react";

const INITIAL_VALUES = {
  _id: null,
  name: "",
  code: "",
  type: "",
  typeClass: "",
};

const ProductModalForm = ({ productData, open, close, onSubmit, onDelete }) => {
  const { user: userSession } = useAuth();
  const { register, handleSubmit, control, watch, setValue, formState: { errors, isDirty, isSubmitting } } = useForm({
    values: lodash.defaultsDeep(formatProductEntryData(productData), INITIAL_VALUES),
    shouldFocusError: true,
  });

  const watchTypeSelection = watch("type");

  const isEditingProduct = useMemo(() => !lodash.isEmpty(productData), [productData]);

  const handleProductDelete = async e => {
    try {
      const consent = await GetPasswordConsent({
        title: `Eliminar ${productData.name}`,
        description: "Ingrese su clave para eliminar el producto",
      });

      if (consent?.error || !consent) throw new Error(consent?.message ?? "Contraseña incorrecta");

      const response = await onDelete(productData);
      if (!response?.error) enqueueSnackbar("Se ha eliminado el producto exitosamente", { variant: "success" })

      handleClose();
    } catch (err) {
      if (err.target?.innerText.toLowerCase() === "cancelar") return; // Clicked "cancel" on password consent
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" })
    }
  }

  const onFormSubmit = async data => {
    try {
      const formattedData = formatProductSubmitData(data);
      const response = await onSubmit(formattedData);

      const submitMessage = isEditingProduct ? "Se ha actualizado el producto exitosamente" : "Se creado el producto exitosamente"
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
                {
                  userSession?.privileges?.inventory?.upsert ?
                    isEditingProduct ? "Editar" : "Nuevo"
                    : "Detalles de"
                } Producto
              </MDTypography>

              <MDBox>
                <Grid container spacing={2}>

                  {/* Name */}
                  <Grid xs={8}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Nombre del Producto
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("name", { required: "Este campo es obligatorio" })}
                      fullWidth
                      error={!!errors?.name}
                      placeholder="Ej: Gris Claro"
                      inputProps={{
                        readOnly: !userSession?.privileges?.inventory?.upsert,
                      }}
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
                  <Grid xs={4}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Codigo
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("code", { required: "Este campo es obligatorio" })}
                      error={!!errors?.code}
                      placeholder="Codigo del articulo"
                      fullWidth
                      inputProps={{
                        readOnly: !userSession?.privileges?.inventory?.upsert,
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
                  
                  <Grid container xs={12}>
                    {/* Type */}
                    <Grid xs={6}>
                      <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Tipo
                        <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                      </MDTypography>
                      <Controller
                        control={control}
                        name="type"
                        render={({ field }) => {
                          return (
                            <Select
                              {...field}
                              onChange={e => {
                                setValue("typeClass", "");
                                return field.onChange(e)
                              }}
                              error={!!errors?.typeClass}
                              fullWidth
                              readOnly={!userSession?.privileges?.inventory?.upsert}
                            >
                              <MenuItem value="architectural" sx={{ my: 0.5 }}>Arquitectonico</MenuItem>
                              <MenuItem value="enamel" sx={{ my: 0.5 }}>Esmalte</MenuItem>
                              <MenuItem value="industrialAndMarine" sx={{ my: 0.5 }}>Industrial & Marina</MenuItem>
                            </Select>
                          )
                        }}
                        rules={{
                          required: "Este campo es obligatorio",
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
                    <Grid xs={6}>
                      <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Clase
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
                            readOnly={!userSession?.privileges?.inventory?.upsert}
                            disabled={!watchTypeSelection}
                            onClickCapture={(event) => {
                              if (!watchTypeSelection) {
                                return enqueueSnackbar(
                                  'Escoja un tipo',
                                  { variant: "warning" }
                                );
                              }
                            }}
                          >
                            {
                              watchTypeSelection === "industrialAndMarine" ?
                                (
                                  <MenuItem value="U" sx={{ my: 0.5 }}>Clase U</MenuItem>
                                )
                                :
                                ([
                                  <MenuItem key="A" value="A" sx={{ my: 0.5 }}>Clase A</MenuItem>,
                                  <MenuItem key="B" value="B" sx={{ my: 0.5 }}>Clase B</MenuItem>,
                                  <MenuItem key="C" value="C" sx={{ my: 0.5 }}>Clase C</MenuItem>,
                                ])
                            }
                          </Select>
                        )}
                        rules={{
                          required: "Este campo es obligatorio",
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
                    {
                      userSession?.privileges?.inventory?.upsert &&
                      (
                        <MDButton loading={isSubmitting} disabled={!isDirty} color="info" variant="gradient" type="submit">
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

ProductModalForm.defaultProps = {
  onSubmit: async data => await console.log(new Promise((res, rej) => setTimeout(() => res(data), 3000))),
  onDelete: async data => await console.log(new Promise((res, rej) => setTimeout(() => res(data), 3000))),
}

ProductModalForm.propTypes = {
  productData: PropTypes.object,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
}

export default ProductModalForm;