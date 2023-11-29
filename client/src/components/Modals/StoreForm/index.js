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
import { formatStoreSubmitData } from "./utils/functions.utils";
import GetPasswordConsent from "components/GetPasswordConsent";
import { useMemo } from "react";

const INITIAL_VALUES = {
  _id: null,
  name: "",
  phone: "",
  address: {
    full: "",
    parts: {
      street: "",
      city: "",
      state: "Nueva Esparta",
      postalCode: "",
    },
    geo: {
      lat: null,
      lon: null,
    }
  },
};

const StoreModalForm = ({ storeData, open, close, onSubmit, onDelete }) => {
  const { user: userSession } = useAuth();
  const { register, control, handleSubmit, formState: { errors, isDirty, isSubmitting } } = useForm({
    values: lodash.defaultsDeep(storeData, INITIAL_VALUES),
    shouldFocusError: true,
  });

  const isEditingStore = useMemo(() => !lodash.isEmpty(storeData), [storeData]);

  const handleProductDelete = async e => {
    try {
      const consent = await GetPasswordConsent({
        title: `Eliminar ${storeData.name}`,
        description: "Ingrese su clave para eliminar el producto",
      });

      if (consent?.error || !consent) throw new Error(consent?.message ?? "Contraseña incorrecta");

      const response = await onDelete(storeData);
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
      const formattedData = formatStoreSubmitData(data);
      const response = await onSubmit(formattedData);

      const submitMessage = isEditingStore ? "Se ha actualizado el producto exitosamente" : "Se creado el producto exitosamente"
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
                  userSession?.privileges?.shippings?.upsert ?
                    isEditingStore ? "Editar" : "Nueva"
                    : "Detalles de"
                } Tienda
              </MDTypography>

              <MDBox>
                <Grid container spacing={2}>

                  {/* Name */}
                  <Grid xs={7}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Nombre de la tienda
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("name", { required: "Este campo es obligatorio" })}
                      fullWidth
                      error={!!errors?.name}
                      inputProps={{
                        readOnly: !userSession?.privileges?.shippings?.upsert,
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

                  {/* Phone */}
                  <Grid xs={5}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Telefono
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("phone", {
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
                      fullWidth
                      type="tel"
                      inputProps={{
                        readOnly: !userSession?.privileges?.shippings?.upsert,
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

                  {/* Street */}
                  <Grid xs={12}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Dirección
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("address.parts.street", { required: "Este campo es obligatorio" })}
                      fullWidth
                      error={!!errors?.address?.parts?.street}
                      placeholder="Calle, Avenida, y/o Num. del Local"
                      inputProps={{
                        readOnly: !userSession?.privileges?.shippings?.upsert,
                      }}
                    />
                    {
                      !!errors?.address?.parts?.street && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.address?.parts?.street.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* City */}
                  <Grid xs={4}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Ciudad
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <MDInput
                      {...register("address.parts.city", { required: "Este campo es obligatorio" })}
                      fullWidth
                      error={!!errors?.address?.parts?.city}
                      inputProps={{
                        readOnly: !userSession?.privileges?.shippings?.upsert,
                      }}
                    />
                    {
                      !!errors?.address?.parts?.city && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.address?.parts?.city.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* State */}
                  <Grid xs={4}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Estado
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="address.parts.state"
                      render={({ field }) => (
                        <Select
                          {...field}
                          error={!!errors?.address?.parts?.state}
                          fullWidth
                          readOnly={!userSession.privileges.shippings.upsert}
                        >
                          <MenuItem value="Nueva Esparta" sx={{ my: 0.5 }}>Nueva Esparta</MenuItem>
                          <MenuItem value="Caracas" sx={{ my: 0.5 }}>Caracas</MenuItem>
                        </Select>
                      )}
                      rules={{
                        required: "Este campo es obligatorio"
                      }}
                    />
                    {
                      !!errors?.address?.parts?.state && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.address?.parts?.state.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                  {/* Postal Code */}
                  <Grid xs={4}>
                    <MDTypography ml={1} component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Codigo Postal
                      <MDTypography color="error" component="span" fontWeight="light" fontSize="small">*</MDTypography>
                    </MDTypography>
                    <Controller
                      control={control}
                      name="address.parts.postalCode"
                      render={({ field }) => (
                        <MDInput
                          {...field}
                          fullWidth
                          error={!!errors?.address?.parts?.postalCode}
                          inputProps={{
                            readOnly: !userSession?.privileges?.shippings?.upsert,
                          }}
                        />
                      )}
                      rules={{
                        required: "Este campo es obligatorio",
                        setValueAs: Number,
                        validate: {
                          isNumber: value => !isNaN(value) || "Este campo solo acepta numeros"
                        }
                      }}
                    />
                    {
                      !!errors?.address?.parts?.postalCode && (
                        <MDTypography ml={1} fontSize="small" color="error" fontWeight="light">
                          {errors?.address?.parts?.postalCode.message}
                        </MDTypography>
                      )
                    }
                  </Grid>

                </Grid>

                {/* Buttons */}
                <MDBox mt={3} mb={1} display="flex" justifyContent="flex-between" width="100%">
                  <MDBox width="100%">
                    {
                      isEditingStore && userSession?.privileges?.shippings?.delete &&
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
                      userSession?.privileges?.shippings?.upsert &&
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

StoreModalForm.defaultProps = {
  onSubmit: async data => await console.log(new Promise((res, rej) => setTimeout(() => res(data), 3000))),
  onDelete: async data => await console.log(new Promise((res, rej) => setTimeout(() => res(data), 3000))),
}

StoreModalForm.propTypes = {
  storeData: PropTypes.object,
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
}

export default StoreModalForm;