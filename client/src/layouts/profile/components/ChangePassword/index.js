import { useState } from "react";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { Visibility, VisibilityOff } from "@mui/icons-material";

// MD UI Dashboard React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import { InputAdornment } from "@mui/material";

const ChangePassword = ({ onChange }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: ""
    }
  })
  const [visibleOldPassword, setVisibleOldPassword] = useState(false);
  const [visibleNewPassword, setVisibleNewPassword] = useState(false);


  const onSubmit = async ({ oldPassword, newPassword }) => {
    try {
      const response = await onChange(oldPassword, newPassword);
      if (response?.error || !response) throw new Error(response?.message || "Error al cambiar contraseña")
      enqueueSnackbar("Su clave se ha cambiado exitosamente", { variant: "success" })
      reset(null, { defaultValues: true });
    } catch (err) {
      return enqueueSnackbar(err.message, { variant: "error" });
    }
  }

  const renderPasswordVisibilityIcon = (visible) => {
    return visible ?
      <Visibility />
      :
      <VisibilityOff />
  }

  return (
    <MDBox>
      <MDBox>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize" >
          Cambiar contraseña
        </MDTypography>
        <MDTypography variant="button" fontWeight="regular" color="text" paragraph>
          Si ha olvidado su contraseña, por favor comuniquese con administracion
        </MDTypography>
      </MDBox>
      <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
        <MDBox mb={2}>
          <MDBox mb={1} ml={0.5}>
            <MDTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
              Contraseña actual
            </MDTypography>
          </MDBox>
          <MDInput
            {...register("oldPassword", {
              required: "Este campo es obligatorio",
              minLength: { value: 8, message: "La contraseña debe contener al menos 8 caracteres" }
            })}
            placeholder="Contraseña Actual"
            error={!!errors?.oldPassword}
            type={visibleOldPassword ? 'text' : 'password'}
            fullWidth
            InputProps={{
              endAdornment: (
                <MDButton iconOnly disableRipple onClick={() => setVisibleOldPassword(!visibleOldPassword)}>
                  <InputAdornment position="end">
                    {renderPasswordVisibilityIcon(visibleOldPassword)}
                  </InputAdornment>
                </MDButton>
              )
            }}
          />
          {!!errors?.oldPassword &&
            <MDTypography fontSize="small" color="error" fontWeight="light">
              {errors?.oldPassword.message}
            </MDTypography>
          }
        </MDBox>
        <MDBox mb={2}>
          <MDBox mb={1} ml={0.5}>
            <MDTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
              Nueva contraseña
            </MDTypography>
          </MDBox>
          <MDInput
            {...register("newPassword", {
              required: "Este campo es obligatorio",
              minLength: { value: 8, message: "La contraseña debe contener al menos 8 caracteres" }
            })}
            placeholder="Nueva Contraseña"
            error={!!errors?.newPassword}
            type={visibleNewPassword ? 'text' : 'password'}
            fullWidth
            InputProps={{
              endAdornment: (
                <MDButton iconOnly disableRipple onClick={() => setVisibleNewPassword(!visibleNewPassword)}>
                  <InputAdornment position="end">
                    {renderPasswordVisibilityIcon(visibleNewPassword)}
                  </InputAdornment>
                </MDButton>
              )
            }}
          />
          {!!errors?.newPassword &&
            <MDTypography fontSize="small" color="error" fontWeight="light">
              {errors?.newPassword.message}
            </MDTypography>
          }
        </MDBox>
        <MDBox mt={4} mb={1}>
          <MDButton loading={isSubmitting} type="submit" variant="gradient" color="info" fullWidth>
            {!isSubmitting && "Cambiar contraseña"}
          </MDButton>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

export default ChangePassword;
