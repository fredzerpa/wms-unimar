import { useState } from "react";
// @mui material components
import Card from "@mui/material/Card";
import Grid from "@mui/material/Unstable_Grid2/Grid2";

// MD UI Dashboard React components
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

// Images
import backgroundImage from "assets/images/bg-profile.jpeg";

import { Controller, useForm } from "react-hook-form";
import { AddPhotoAlternate } from "@mui/icons-material";
import { enqueueSnackbar } from "notistack";
import { serialize as formatObjToFormData } from "object-to-formdata";
import { CircularProgress } from "@mui/material";


const Header = ({ user = {}, onImageChange = async file => null, children }) => {
  const { setValue, control, handleSubmit } = useForm({
    defaultValues: {
      imageUrl: user.imageUrl
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async data => {
    try {
      setIsLoading(true);
      const formData = formatObjToFormData(data); // Needed to send image to the server
      const response = await onImageChange(formData);
      if (response?.error || !response) throw new Error(response?.message || "No se pudo cambiar su imagen de perfil");
      setValue("imageUrl", response.imageUrl);
      enqueueSnackbar("Se ha cambiado su imagen de perfil", { variant: "success" });
    } catch (err) {
      console.log(err)
      enqueueSnackbar(err.message || "No se pudo cambiar su imagen de perfil", { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };
  const submitForm = async e => await handleSubmit(onSubmit)(e);

  return (
    <MDBox position="relative">
      <MDBox
        display="flex"
        alignItems="center"
        position="relative"
        minHeight="18.75rem"
        borderRadius="xl"
        sx={{
          backgroundImage: ({ functions: { rgba, linearGradient }, palette: { gradients } }) =>
            `${linearGradient(
              rgba(gradients.info.main, 0.6),
              rgba(gradients.info.state, 0.6)
            )}, url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "50%",
          overflow: "hidden",
        }}
      />
      <Card
        component="form"
        role="form"
        encType="multipart/form-data"
        sx={{
          backdropFilter: `saturate(200%) blur(30px)`,
          backgroundColor: ({ functions: { rgba }, palette: { white } }) => rgba(white.main, 0.8),
          boxShadow: ({ boxShadows: { navbarBoxShadow } }) => navbarBoxShadow,
          position: "relative",
          mt: -8,
          mx: 3,
          py: 2,
          px: 2,
        }}
      >
        <Grid container spacing={3} alignItems="center">
          <Grid>
            <Controller
              control={control}
              name="imageUrl"
              render={({ field: { onChange, value } }) => (
                <MDButton loading={isLoading} component="label" variant="text" sx={{ p: 0 }}>
                  <MDAvatar
                    size="xxl"
                    variant="rounded"
                    shadow="md"
                    bgColor={value && (typeof value === "string") ? "transparent" : "dark"}
                    src={typeof value === "string" ? value : ""}
                    sx={{
                      svg: { // overwrites icon styles
                        fontSize: "3.5rem !important"
                      }
                    }}
                  >
                    {
                      isLoading ? <CircularProgress color="white" /> : <AddPhotoAlternate />
                    }
                  </MDAvatar>
                  <input
                    hidden
                    accept="image/,.jpg,.jpeg,.png,.gif,.webp"
                    type="file"
                    onChange={async e => {
                      // On cancel nothing happens
                      if (e.target.files.length) {
                        await setValue("imageUrl", e.target.files[0])
                        return await submitForm(e);
                      }
                    }}
                  />
                  <MDBox
                    sx={{
                      display: !(typeof value === "string" && value) && "none",
                      position: "absolute",
                      zIndex: 1300,
                      width: "100%",
                      bottom: 0,
                    }}
                  >
                    <MDButton
                      color="white"
                      variant="text"
                      onClick={async e => {
                        await setValue("imageUrl", null)
                        return await submitForm(e);
                      }}
                      p={0}
                      size="small"
                      sx={{
                        width: "100%",
                        borderRadiusBottom: 0,
                        "&, :hover": {
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                        }
                      }}
                    >
                      <MDTypography color="white" fontWeight="regular" textTransform="uppercase" variant="button" fontSize="0.55rem">
                        Quitar Imagen
                      </MDTypography>
                    </MDButton>
                  </MDBox>
                </MDButton>
              )}
            />
          </Grid>
          <Grid>
            <MDBox height="100%" mt={0.5} lineHeight={1}>
              <MDTypography variant="h5" fontWeight="medium" textTransform="capitalize">
                {user.fullname}
              </MDTypography>
              <MDTypography variant="button" color="text" fontWeight="regular" textTransform="uppercase">
                {user.isAdmin ? "administrador" : "auxiliar"}
              </MDTypography>
            </MDBox>
          </Grid>
        </Grid>
        {children}
      </Card>
    </MDBox>
  );
}

export default Header;
