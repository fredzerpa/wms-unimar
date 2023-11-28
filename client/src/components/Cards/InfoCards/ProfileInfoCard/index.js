// Libraries
import { useState } from "react";
import PropTypes from "prop-types";
import { Card, Divider, Tooltip } from "@mui/material";
import { Edit } from "@mui/icons-material";
import { useForm } from "react-hook-form";
import { enqueueSnackbar } from "notistack";
import { defaultsDeep } from 'lodash';

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDInput from "components/MDInput";
import MDButton from "components/MDButton";

// Utils
import { formatUserEntryData, formatUserSubmitData } from "./utils/functions.utils";

const DEFAULT_VALUES = {
  email: {
    label: "Email",
    value: "",
    isEditable: false,
  },
  fullname: {
    label: "Nombre Completo",
    value: {
      names: {
        label: "Nombres",
        value: "",
      },
      lastnames: {
        label: "Apellidos",
        value: ""
      },
    },
    isEditable: true,
  },
  phone: {
    label: "Telefono",
    value: "",
    isEditable: true,
  },
}

const ProfileInfoCard = ({ title, info, onSubmit: onActionSubmit }) => {
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, getValues, reset, formState: { errors } } = useForm({
    defaultValues: defaultsDeep(formatUserEntryData(info), DEFAULT_VALUES)
  });

  const openEditMode = () => setEditMode(true);
  const closeEditMode = () => setEditMode(false);

  const onSubmit = async (data) => {
    try {
      // Remove non editable properties
      Object.entries(data).forEach(([key, { isEditable }]) => {
        if (!isEditable) delete data[key];
      });

      const formattedData = formatUserSubmitData(data)

      // Set data structure as mongo schema
      formattedData.phones = { main: formattedData.phone };
      formattedData.names = formattedData.fullname.names;
      formattedData.lastnames = formattedData.fullname.lastnames;
      formattedData.fullname = `${formattedData.names} ${formattedData.lastnames}`;
      delete formattedData.phone; // remove duplicate

      const response = await onActionSubmit(formattedData);
      if (response?.error) throw new Error(response.message);
      enqueueSnackbar("Se ha actualizado su perfil", { variant: "success" });
      closeEditMode();
    } catch (err) {
      reset(null, { keepDefaultValues: true });
      return enqueueSnackbar(err.message, { variant: "error" });
    }
  }

  const onCancel = () => {
    reset(null, { keepDefaultValues: true })
    closeEditMode();
  }

  // Render the card info items
  const renderItems = Object.entries(info).map(([key, value], i) => {
    const isEditable = getValues(key)?.isEditable;

    // Nested Objects in value
    if (typeof value === "object") {
      return (
        <MDBox key={i} display="flex" flexDirection="column" py={1}>
          <MDTypography variant="button" width="100%" fontWeight="bold" textTransform="capitalize" >
            {
              // Convert this form `objectKey` of the object key in to this `object key`
              getValues(key).label
            }
          </MDTypography>
          <MDBox display="flex" justifyContent="space-between" gap={1}>
            {
              editMode ?
                (
                  Object.entries(value).map(([childKey, childValue]) => {
                    return (
                      <MDBox width="100%">
                        <MDInput
                          key={childKey}
                          {...register(`${key}.value.${childKey}.value`)}
                          size="small"
                          placeholder={getValues(key).value[childKey].label}
                          InputProps={{
                            readOnly: !isEditable,
                          }}
                          fullWidth
                        />
                        {
                          !!errors?.[key]?.value?.[childKey]?.value && (
                            <MDTypography fontSize="small" color="error" fontWeight="light">
                              {errors?.[key]?.value.message}
                            </MDTypography>
                          )
                        }
                      </MDBox>
                    )
                  })
                )
                :
                (
                  <MDTypography
                    fontWeight="regular"
                    variant="button"
                    width="100%"
                    textTransform="capitalize"
                    sx={theme => ({
                      color: theme.palette.grey[700], // Same input color
                      padding: `${theme.functions.pxToRem(8)} ${theme.functions.pxToRem(12)}`, // Same input padding
                    })}
                  >
                    {Object.values(getValues(key).value).map(({ value }) => value).join(" ")}
                  </MDTypography>
                )
            }
          </MDBox>
        </MDBox>
      )
    }

    return (
      <MDBox key={i} display="flex" flexDirection="column" py={1}>
        <MDTypography variant="button" width="100%" fontWeight="bold" textTransform="capitalize" >
          {
            // Convert this form `objectKey` of the object key in to this `object key`
            getValues(key).label
          }
        </MDTypography>
        <MDBox width="100%">
          {
            editMode ?
              (
                <>
                  <MDInput
                    {...register(`${key}.value`, {
                      validate: key === "phone" && {
                        hasSpaces: v => (/\S/g.test(v) || !v.length) || "Evite el uso de espacios en blanco",
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
                    size="small"
                    readOnly={!(isEditable && editMode)}
                    fullWidth
                    InputProps={{
                      readOnly: !(isEditable && editMode),
                    }}
                  />
                  {
                    !!errors?.[key]?.value && (
                      <MDTypography fontSize="small" color="error" fontWeight="light">
                        {errors?.[key]?.value.message}
                      </MDTypography>
                    )
                  }
                </>
              )
              :
              (
                <MDTypography
                  fontWeight="regular"
                  variant="button"
                  width="100%"
                  sx={theme => ({
                    color: theme.palette.grey[700], // Same input color
                    padding: `${theme.functions.pxToRem(8)} ${theme.functions.pxToRem(12)}`, // Same input padding
                  })}
                >
                  {getValues(key).value}
                </MDTypography>
              )
          }
        </MDBox>
      </MDBox >
    )
  });

  return (
    <Card sx={{ height: "100%", boxShadow: "none", backgroundColor: "inherit" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={2} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          {title}
        </MDTypography>
        {
          !editMode && (
            <Tooltip title="Editar" placement="top">
              <MDButton
                iconOnly
                variant="text"
                color="secondary"
                circular
                onClick={openEditMode}
              >
                <Edit />
              </MDButton>
            </Tooltip>
          )
        }
      </MDBox>
      <MDBox p={2}>
        <MDBox mb={2} lineHeight={1}>
          <MDTypography variant="button" color="text" fontWeight="light">
            Para cambiar su nivel o email, por favor comuniquese con un administrador
          </MDTypography>
        </MDBox>
        <MDBox opacity={0.3}>
          <Divider />
        </MDBox>
        <MDBox component="form" role="form" onSubmit={handleSubmit(onSubmit)}>
          <MDBox>
            {renderItems}
          </MDBox>
          {
            editMode && (
              <MDBox display="flex" alignItems="center" justifyContent="flex-end" gap={3} p={2}>
                <MDButton size="small" onClick={onCancel}>
                  Cancelar
                </MDButton>
                <MDButton size="small" variant="gradient" color="dark" type="submit">
                  Guardar
                </MDButton>
              </MDBox>
            )
          }
        </MDBox>
      </MDBox>
    </Card>
  );
}


// Typechecking props for the ProfileInfoCard
ProfileInfoCard.propTypes = {
  title: PropTypes.string.isRequired,
  info: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default ProfileInfoCard;
