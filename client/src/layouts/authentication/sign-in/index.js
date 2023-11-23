import { useEffect, useMemo, useState } from "react";
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";
import { CardMedia, FormControlLabel, InputAdornment } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";

// Components
import BasicLayout from "layouts/authentication/components/BasicLayout";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Context
import { useAuth } from "context/auth.context";

// API
import AuthApi from "api/auth.api";

// Images
import bgImage from "assets/images/tiendas-montana-bg.jpg";
import miniLogo from "assets/images/montana-icon.webp";

const SignIn = () => {
  const { user, setUser } = useAuth();
  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: JSON.parse(window.localStorage.getItem("rememberSession")) || false,
    }
  });
  const [visiblePassword, setVisiblePassword] = useState(false);
  const navigate = useNavigate();


  const onSubmit = async ({ email, password, rememberMe }) => {
    try {
      const { data } = await AuthApi.loginWithEmailAndPassword({ email, password, session: rememberMe })
      if (data.status >= 400) return enqueueSnackbar(data.message, { variant: "error" });
      setUser(data);
      return navigate("/dashboard");
    } catch (err) {
      if (err.response) return enqueueSnackbar(err.response.data.message, { variant: "error" });
      return enqueueSnackbar("Ha ocurrido un error", { variant: "error" });
    }
  };

  useEffect(() => {
    if (user) navigate("/");
  }, [navigate, user])

  const passwordVisibilityIcon = useMemo(() => {
    return visiblePassword ?
      <Visibility />
      :
      <VisibilityOff />
  }, [visiblePassword])

  return (
    <BasicLayout image={bgImage}>
      <MDBox maxWidth={500}>
        <MDBox
          display="flex"
          justifyContent="center"
          width="100%"
        >
          <CardMedia
            component="img"
            sx={{
              width: "18rem",
              maxWidth: "100%",
              objectFit: "contain",
              m: 0,
              zIndex: 0,
              mb: 2,
            }}
            image={miniLogo}
          />
        </MDBox>
        <Card>
          <MDBox
            variant="gradient"
            bgColor="info"
            borderRadius="lg"
            coloredShadow="info"
            mx={2}
            mt={-3}
            p={2}
            mb={1}
            textAlign="center"
          >
            <MDTypography variant="h4" fontWeight="medium" color="white" mt={1}>
              Tiendas Montana WMS
            </MDTypography>
          </MDBox>
          <MDBox pt={4} pb={3} px={3}>
            <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
              <MDBox mb={2}>
                <MDInput
                  {...register("email", { required: "Este campo es obligatorio" })}
                  type="email"
                  label="Correo"
                  fullWidth
                  error={!!errors?.email}
                />
              </MDBox>
              <MDBox mb={2}>
                <MDInput
                  {...register("password", { required: "Este campo es obligatorio" })}
                  type={visiblePassword ? "text" : "password"}
                  error={!!errors?.password}
                  InputProps={{
                    endAdornment: (
                      <MDButton iconOnly disableRipple onClick={() => setVisiblePassword(!visiblePassword)}>
                        <InputAdornment position="end">
                          {passwordVisibilityIcon}
                        </InputAdornment>
                      </MDButton>
                    )
                  }}
                  label="Contraseña"
                  fullWidth
                />
              </MDBox>
              <MDBox display="flex" alignItems="center">
                <Controller
                  control={control}
                  name="rememberMe"
                  render={({ field: { value, onChange, ...rest } }) => (
                    <FormControlLabel
                      label={<MDTypography variant="button" fontWeight="regular">Recuerdame</MDTypography>}
                      control={
                        <Switch
                          {...rest}
                          value={value}
                          checked={value}
                          onChange={(event, nextValue) => {
                            window.localStorage.setItem("rememberSession", nextValue);
                            return onChange(event, nextValue);
                          }}
                        />
                      }
                      sx={{
                        width: "fit-content"
                      }}
                    />
                  )}

                />
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton loading={isSubmitting} variant="gradient" color="info" fullWidth type="submit">
                  Iniciar sesion
                </MDButton>
              </MDBox>
              <MDBox mt={3} mb={1} textAlign="center">
                <MDTypography variant="caption" color="text">
                  En caso de necesitar soporte comuniquese con un administrador.
                </MDTypography>
              </MDBox>
            </MDBox>
          </MDBox>
        </Card>
      </MDBox>
    </BasicLayout>
  );
}

export default SignIn;
