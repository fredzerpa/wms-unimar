// Libraries
import { useCallback, useState } from "react";
import { Accordion, AccordionDetails, AccordionSummary, Card, Checkbox, Divider, FormControl, FormControlLabel, FormGroup, FormLabel, Modal } from "@mui/material";
import { ExpandMore, Visibility, VisibilityOff } from "@mui/icons-material";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import SimpleBar from "simplebar-react";
import { Controller, useForm } from "react-hook-form";
import { defaultsDeep } from "lodash";
import { serialize as formatObjToFormData } from "object-to-formdata";
import { enqueueSnackbar } from "notistack";

// MD UI components
import MDAvatar from "components/MDAvatar";
import MDBox from "components/MDBox";
import MDButton from "components/MDButton";
import MDInput from "components/MDInput";
import MDTypography from "components/MDTypography";
import GetPasswordConsent from "components/GetPasswordConsent";

// Context & Utils
import { useAuth } from "context/auth.context";
import { formatPrivilegesToModalSchema, formatPrivilegesToMongoSchema } from "./utils/functions.utils";

const DEFAULT_VALUES = {
  imageUrl: null,
  names: "",
  lastnames: "",
  email: "",
  phones: { main: "" },
  password: "",
  isAdmin: false,
  privileges: {
    reports: {
      label: "Reportes",
      access: {
        read: {
          label: "Ver Reportes",
          value: true,
          required: true,
        }
      }
    },
    inventory: {
      label: "Inventario",
      access: {
        read: {
          label: "Ver Inventario",
          value: true,
          required: true,
        },
        upsert: {
          label: "Crear y Editar Inventario",
          value: false
        },
        delete: {
          label: "Eliminar Inventario",
          value: false
        },
      }
    },
    shippings: {
      label: "Envios",
      access: {
        read: {
          label: "Ver Envios",
          value: true,
          required: true,
        },
        upsert: {
          label: "Crear y Editar Envios",
          value: false
        },
        delete: {
          label: "Eliminar Envios",
          value: false
        },
      }
    },
    billing: {
      label: "Facturas",
      access: {
        read: {
          label: "Ver Facturas",
          value: true,
          required: true,
        },
        upsert: {
          label: "Crear y Editar Facturas",
          value: false
        },
        delete: {
          label: "Eliminar Facturas",
          value: false
        },
      }
    },
    users: {
      label: "Usuarios",
      access: {
        read: {
          label: "Ver Usuarios",
          value: true,
          required: true,
        },
        upsert: {
          label: "Crear y Editar Usuarios",
          value: false
        },
        delete: {
          label: "Eliminar Usuarios",
          value: false
        },
      }
    },
  }
}

const UserFormModal = ({ title = "", open, close, user = {}, onSubmit: actionOnSubmit = () => null }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [visiblePassword, setVisiblePassword] = useState(false);
  const [expandAdvancedFeatures, setExpandAdvancedFeatures] = useState(false);
  const { register, setValue, getValues, control, handleSubmit, reset, formState: { errors } } = useForm({
    defaultValues: defaultsDeep(
      { ...user, privileges: formatPrivilegesToModalSchema(user?.privileges || {}) },
      DEFAULT_VALUES
    ),
  });
  const { user: userSession } = useAuth();

  const onSubmit = async data => {
    const consent = await GetPasswordConsent({
      title: `Actualizar ${data.names.split(" ")[0]}`,
      description: "Ingrese su clave para actualizar el usuario",
    });

    if (consent?.error || !consent) throw new Error(consent?.message || "Contraseña incorrecta");

    setIsLoading(true);
    // Add missing properties
    data.fullname = `${data.names} ${data.lastnames}`;
    // Format data to Mongoose Schema
    data.privileges = formatPrivilegesToMongoSchema(data.privileges);

    const formData = formatObjToFormData(data); // Needed to send image to the server

    try {
      const isUpdatingUser = Object.keys(user).length;
      const response = await actionOnSubmit(formData);
      if (response?.error || !response) throw new Error(response?.message || `No se pudo ${isUpdatingUser ? "actualizar" : "crear"} el usuario`);
      enqueueSnackbar(`Se ha ${isUpdatingUser ? "actualizado" : "creado"} el usuario con exito`, { variant: "success" });
      close();
    } catch (err) {
      console.log(err)
      enqueueSnackbar(err.message, { variant: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "backdropClick") return; // Do not close modal by accident
    reset();
    close();
  }

  const handleExpandAdvanceFeatures = () => setExpandAdvancedFeatures(!expandAdvancedFeatures);

  const renderPasswordVisibilityIcon = () => visiblePassword ? <Visibility /> : <VisibilityOff />;

  const setAdminPrivileges = useCallback(async () => {
    try {
      const nextValue = !getValues("isAdmin");

      const allPrivileges = Object.fromEntries(Object.entries(getValues("privileges")).map(([key, { label, access }]) => {
        const setValue = Object.fromEntries(Object.entries(access).map(([accessKey, values]) => {
          return [accessKey, { ...values, value: (values.required || nextValue) }]
        }));
        return [key, { label, access: setValue }];
      }));

      setValue("privileges", allPrivileges);
      setValue("isAdmin", nextValue);
    } catch (err) {
      return enqueueSnackbar(err.message, { variant: "error" });
    }
  }, [getValues, setValue]);

  const renderPrivilegesCheckbox = useCallback(() => {
    return Object.entries(getValues("privileges")).map(([key, { label, access }]) => {

      const userToUpdateIsSupervisor = user?.privileges?.users?.upsert || user?.privileges?.users?.delete;
      if (key === "users" && ((userToUpdateIsSupervisor && !userSession.isAdmin) || !userSession.isAdmin)) return null;

      const items = Object.entries(access).map(([accessKey, { label: accessLabel, required }]) => {
        const handleOnChange = (onChangeHook) => (...e) => {
          const adminIsChecked = getValues("isAdmin");
          // if isAdmin is checked don't change the value
          if (adminIsChecked) return enqueueSnackbar(`No se puede realizar este cambio mientras "Administrador" este seleccionado`, { variant: "warning" })
          return onChangeHook(...e);
        }
        return (
          <Controller
            key={accessKey}
            control={control}
            name={`privileges.${key}.access.${accessKey}.value`}
            render={({
              field: { onChange, onBlur, value, ref },
            }) => (
              <FormControlLabel
                label={
                  <MDTypography variant="button" fontWeight="regular">
                    {accessLabel}
                  </MDTypography>
                }
                control={
                  <Checkbox
                    checked={required || value}
                    disabled={required}
                    onBlur={onBlur} // notify when input is touched
                    onChange={handleOnChange(onChange)} // send value to hook form
                    inputRef={ref}
                  />
                }
              />)
            }
          />
        )
      })

      return (
        <Grid xs={12} sm={6} key={key}>
          <FormControl component="fieldset">
            <FormLabel component="legend">
              <MDTypography variant="button" fontWeight="medium">
                {label}
              </MDTypography>
            </FormLabel>
            <FormGroup>
              {items}
            </FormGroup>
          </FormControl>
        </Grid>
      )
    })
  }, [control, getValues, user?.privileges?.users?.delete, user?.privileges?.users?.upsert, userSession.isAdmin])

  return (
    <Modal
      open={open}
      onClose={handleClose}
    >
      <Card
        component="form"
        encType="multipart/form-data"
        onSubmit={handleSubmit(onSubmit)}
        sx={theme => ({
          width: "500px",
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
            maxHeight: window.matchMedia("(max-width:767.95px)").matches ? "100vh" : "90vh",
          }}
        >
          <MDBox p={3}>
            <MDTypography variant="h4" fontWeight="medium" textTransform="capitalize" gutterBottom>
              {title}
            </MDTypography>
            <MDBox>

              <MDBox display="flex" mb={2}>
                <MDBox mr={3} display="flex" alignItems="center" justifyContent="center" flexDirection="column">
                  <MDBox sx={{ position: "relative" }}>
                    <Controller
                      control={control}
                      name="imageUrl"
                      render={({ field: { onChange, value } }) => (
                        <MDButton component="label" variant="text" sx={{ p: 0 }}>
                          <MDAvatar
                            size="xxxl"
                            variant="rounded"
                            shadow="md"
                            bgColor={value ? "transparent" : "dark"}
                            src={value && (typeof value === "string" ? value : URL.createObjectURL(value))}
                          />
                          <input
                            hidden
                            accept="image/,.jpg,.jpeg,.png,.gif,.webp"
                            type="file"
                            onChange={e => {
                              // On cancel nothing happens
                              if (e.target.files.length) return setValue("imageUrl", e.target.files[0])
                            }}
                          />
                          <MDBox
                            sx={{
                              display: !value && "none",
                              position: "absolute",
                              zIndex: 1300,
                              width: "100%",
                              bottom: 0,
                            }}
                          >
                            <MDButton
                              color="white"
                              variant="text"
                              onClick={() => setValue("imageUrl", null)}
                              p={0}
                              sx={{
                                width: "100%",
                                borderRadiusBottom: 0,
                                "&, :hover": {
                                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                                }
                              }}
                            >
                              Quitar Imagen
                            </MDButton>
                          </MDBox>
                        </MDButton>
                      )}
                    />
                  </MDBox>
                </MDBox>
                <MDBox display="flex" flexDirection="column" width="100%" mb={2}>
                  <MDBox width="100%">
                    <MDBox ml={0.5}>
                      <MDTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Nombre*
                      </MDTypography>
                    </MDBox>
                    <MDInput
                      fullWidth
                      {...register("names", { required: "Este campo es obligatorio" })}
                      placeholder="Nombres"
                      error={!!errors?.names}
                    />
                    {!!errors?.names && <MDTypography fontSize="small" color="error" fontWeight="light">{errors?.names.message}</MDTypography>}
                  </MDBox>
                  <MDBox width="100%">
                    <MDBox ml={0.5}>
                      <MDTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                        Apellido*
                      </MDTypography>
                    </MDBox>
                    <MDInput
                      fullWidth
                      {...register("lastnames", { required: "Este campo es obligatorio" })}
                      error={!!errors?.lastnames}
                      placeholder="Apellidos"
                    />
                    {!!errors?.lastnames && <MDTypography fontSize="small" color="error" fontWeight="light">{errors?.lastnames.message}</MDTypography>}
                  </MDBox>
                </MDBox>
              </MDBox>

              <MDBox display="flex" justifyContent="space-between" gap={2} width="100%" mb={2}>
                <MDBox width="100%">
                  <MDBox ml={0.5}>
                    <MDTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Email*
                    </MDTypography>
                  </MDBox>
                  <MDInput
                    fullWidth
                    {...register("email", { required: "Este campo es obligatorio" })}
                    type="email"
                    error={!!errors?.email}
                    placeholder="Email"
                  />
                  {!!errors?.email && <MDTypography fontSize="small" color="error" fontWeight="light">{errors?.email.message}</MDTypography>}
                </MDBox>
                <MDBox width="100%">
                  <MDBox ml={0.5}>
                    <MDTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                      Telefono
                    </MDTypography>
                  </MDBox>
                  <MDInput
                    fullWidth
                    {...register("phones.main")}
                    type="tel"
                    placeholder="Telefono"
                  />
                </MDBox>
              </MDBox>

              <MDBox mb={2}>
                <MDBox ml={0.5}>
                  <MDTypography component="label" variant="caption" fontWeight="bold" textTransform="capitalize">
                    Contraseña{Object.keys(user).length === 0 && "*"}
                  </MDTypography>
                </MDBox>
                <MDInput
                  fullWidth
                  type={visiblePassword ? "text" : "password"}
                  {...register(
                    "password",
                    {
                      required: {
                        value: Object.keys(user).length === 0,
                        message: "Este campo es obligatorio",
                      },
                      minLength: {
                        value: 8,
                        message: "La contraseña debe contener al menos 8 caracteres"
                      }
                    }
                  )}
                  error={!!errors?.password}
                  placeholder="Contraseña"
                  icon={{
                    component: renderPasswordVisibilityIcon(),
                    direction: "right",
                    onClick: () => setVisiblePassword(!visiblePassword),
                  }}
                />
                {!!errors?.password && <MDTypography fontSize="small" color="error" fontWeight="light">{errors?.password.message}</MDTypography>}
              </MDBox>
              <MDBox mb={2}>
                <Accordion expanded={expandAdvancedFeatures} onChange={handleExpandAdvanceFeatures} sx={{ boxShadow: "none" }}>
                  <AccordionSummary
                    expandIcon={<ExpandMore fontSize="medium" />}
                    aria-controls="advanced-options-content"
                    id="advanced-options"
                  >
                    <MDBox display="flex" flexDirection="column">
                      <MDTypography fontSize="1rem" fontWeight="medium">
                        Configuraciones Avanzadas
                      </MDTypography>
                      <MDTypography fontSize="small" fontWeight="light">
                        Privilegios de la cuenta
                      </MDTypography>
                    </MDBox>
                  </AccordionSummary>
                  <AccordionDetails>
                    <MDBox>
                      {
                        userSession.isAdmin &&
                        (<>
                          <Controller
                            control={control}
                            name="isAdmin"
                            render={({ field: { onChange, onBlur, value, ref } }) => (
                              <FormControlLabel
                                label={<MDTypography fontSize="medium" fontWeight="medium">Administrador</MDTypography>}
                                control={
                                  <Checkbox
                                    checked={value}
                                    onChange={setAdminPrivileges}
                                    onBlur={onBlur}
                                    inputRef={ref}
                                  />
                                }
                                sx={{
                                  width: "fit-content"
                                }}
                              />
                            )}
                          />
                          <Divider />
                        </>)
                      }

                      <Grid container>
                        {renderPrivilegesCheckbox()}
                      </Grid>
                    </MDBox>
                  </AccordionDetails>
                </Accordion>
              </MDBox>
              <MDBox mb={2} display="flex" justifyContent="flex-end" gap={3}>
                <MDButton color="dark" variant="text" onClick={close} sx={{ alignSelf: "center" }}>Cancelar</MDButton>
                <MDButton loading={isLoading} color="info" variant="gradient" type="submit">Guardar</MDButton>
              </MDBox>
            </MDBox>
          </MDBox>
        </SimpleBar>
      </Card>
    </Modal >
  )
}

export default UserFormModal;