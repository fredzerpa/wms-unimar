// Libraries
import { useState } from "react";
import { confirmable } from "react-confirm";
import { useForm } from "react-hook-form";
import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { InfoOutlined, Visibility, VisibilityOff } from "@mui/icons-material";
import PropTypes from "prop-types";

// Context & API
// import createUserApi from "api/users.api";
import { useAuth } from "context/auth.context";
import { createConfirmation } from "context/confirmation.context";

// Components
import MDBox from "components/MDBox";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";

const GetPasswordConsent = ({ title = "confirmacion", description, warning, show, proceed, dismiss, cancel }) => {
  const { user } = useAuth();
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: {
      password: "",
    }
  });
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async ({ password }) => {
    try {
      setIsLoading(true);
      // TODO: add User API password confirm
      // const { confirmPassword } = createUserApi(user.token);
      // const { data } = await confirmPassword(password);
      return proceed(password);
    } catch (err) {
      return proceed(err.response.data);
    } finally {
      setIsLoading(false);
    }
  }

  const renderPasswordVisibilityIcon = () => {
    return visiblePassword ?
      <Visibility />
      :
      <VisibilityOff />
  }

  return (
    <Dialog open={show} onClose={dismiss} maxWidth="xs">
      <DialogTitle component="div">
        <MDTypography variant="subtitle1" textTransform="capitalize">
          {title}
        </MDTypography>
      </DialogTitle>
      <DialogContent>
        <MDTypography variant="body2" fontWeight="regular" color="text" paragraph>
          {description}
        </MDTypography>
        <MDBox component="form" onSubmit={handleSubmit(onSubmit)}>
          <MDBox mb={2}>
            <MDBox ml={0.5}>
              <MDTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                Contraseña*
              </MDTypography>
            </MDBox>
            <MDInput
              fullWidth
              type={visiblePassword ? "text" : "password"}
              {...register(
                "password",
                {
                  required: {
                    value: true,
                    message: "Este campo es obligatorio",
                  },
                  minLength: {
                    value: 8,
                    message: "La contraseña debe contener al menos 8 caracteres"
                  }
                }
              )}
              autoFocus
              error={!!errors?.password}
              placeholder="Contraseña"
              icon={{
                component: renderPasswordVisibilityIcon(),
                direction: "right",
                onClick: () => setVisiblePassword(!visiblePassword),
              }}
            />
            {errors?.password && <MDTypography fontSize="small" color="error" fontWeight="light">{errors?.password.message}</MDTypography>}
          </MDBox>

          <MDBox mb={2}>
            {
              typeof warning === "string" ?
                (
                  <MDTypography variant="caption" fontWeight="light" color="error">
                    <InfoOutlined /> {warning}
                  </MDTypography>
                )
                :
                warning
            }
          </MDBox>

          <MDBox mb={2} display="flex" justifyContent="flex-end" gap={3}>
            <MDButton color="dark" variant="text" onClick={dismiss} sx={{ alignSelf: "center" }}>Cancelar</MDButton>
            <MDButton loading={isLoading} color="info" variant="gradient" type="submit">Continuar</MDButton>
          </MDBox>

        </MDBox>
      </DialogContent>
    </Dialog>
  );
}

GetPasswordConsent.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  warning: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  show: PropTypes.bool, // from confirmable. indicates if the dialog is shown or not.
  proceed: PropTypes.func, // from confirmable. call to close the dialog with promise resolved.
  confirmation: PropTypes.string, // arguments of your confirm function
  options: PropTypes.object // arguments of your confirm function
}

// confirmable HOC pass props `show`, `dismiss`, `cancel` and `proceed` to your component.
export default createConfirmation(confirmable(GetPasswordConsent));