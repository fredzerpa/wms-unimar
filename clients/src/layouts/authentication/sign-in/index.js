import { useState } from "react";

// @mui material components
import Card from "@mui/material/Card";
import Switch from "@mui/material/Switch";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Authentication layout components
import BasicLayout from "layouts/authentication/components/BasicLayout";

// Images
import bgImage from "assets/images/tiendas-montana-bg.jpg";
import miniLogo from "assets/images/montana-icon.webp";
import { CardMedia } from "@mui/material";

const SignIn = () => {
  const [rememberMe, setRememberMe] = useState(false);

  const handleSetRememberMe = () => setRememberMe(!rememberMe);

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
            <MDBox component="form" role="form">
              <MDBox mb={2}>
                <MDInput type="email" label="Correo" fullWidth />
              </MDBox>
              <MDBox mb={2}>
                <MDInput type="password" label="Contraseña" fullWidth />
              </MDBox>
              <MDBox display="flex" alignItems="center" ml={-1}>
                <Switch checked={rememberMe} onChange={handleSetRememberMe} />
                <MDTypography
                  variant="button"
                  fontWeight="medium"
                  color="text"
                  onClick={handleSetRememberMe}
                  sx={{ cursor: "pointer", userSelect: "none", ml: -1, pl: 1 }}
                >
                  Recuerdame
                </MDTypography>
              </MDBox>
              <MDBox mt={4} mb={1}>
                <MDButton variant="gradient" color="info" fullWidth>
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
