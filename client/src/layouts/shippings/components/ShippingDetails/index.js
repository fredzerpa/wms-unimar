import PropTypes from "prop-types";
import Icon from "@mui/material/Icon";
import { ExpandMore } from "@mui/icons-material";
import { Accordion, AccordionDetails, AccordionSummary, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import SimpleBar from "simplebar-react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";
import colorsDark from "assets/theme-dark/base/colors";
import { addLabelsToProducts } from "components/Modals/ShippingForm/utils/functions.utils";

// Context
import { useMaterialUIController } from "context";
import { enqueueSnackbar } from "notistack";
import GetPasswordConsent from "components/GetPasswordConsent";


const ShippingDetails = ({ title, shippingData, noGutter, onEdit, onDelete, readOnly }) => {
  const { store, date, products } = shippingData;

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const handleClickDelete = async event => {
    try {
      const consent = await GetPasswordConsent({
        title: `Eliminar envio`,
        description: "Ingrese su clave para eliminar el envio",
      });

      if (consent?.error || !consent) throw new Error(consent?.message ?? "Contraseña incorrecta");

      const response = await onDelete(shippingData);
      if (!response?.error) enqueueSnackbar("Se ha eliminado el envio exitosamente", { variant: "success" })

      return response;

    } catch (err) {
      if (err.target?.innerText.toLowerCase() === "cancelar") return; // Clicked "cancel" on password consent
      console.error(err);
      enqueueSnackbar(err.message, { variant: "error" })
    }
  }

  const handleClickEdit = async event => {
    try {
      return await onEdit(shippingData);
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" })
    }
  }

  return (
    <MDBox
      component="li"
      display="flex"
      justifyContent="space-between"
      alignItems="flex-start"
      bgColor={darkMode ? colorsDark.dark.focus : "grey-100"}
      borderRadius="lg"
      p={3}
      pb={1}
      mb={noGutter ? 0 : 1}
      mt={2}
    >
      <MDBox width="100%" display="flex" flexDirection="column">
        <MDBox
          display="flex"
          justifyContent="space-between"
          alignItems={{ xs: "flex-start", sm: "center" }}
          flexDirection={{ xs: "column", sm: "row" }}
          mb={2}
        >
          <MDTypography variant="button" fontWeight="medium">
            {title ?? ""}
          </MDTypography>

          {/* Edit/Delete Buttons */}
          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            {
              onDelete !== null && (
                <MDBox mr={1}>
                  <MDButton variant="text" color="error" onClick={handleClickDelete}>
                    <Icon>delete</Icon>&nbsp;Eliminar
                  </MDButton>
                </MDBox>
              )
            }
            <MDBox>
              <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={handleClickEdit}>
                <Icon>{readOnly ? "visibility" : "edit"}</Icon>&nbsp;{readOnly ? "ver" : "editar"}
              </MDButton>
            </MDBox>
          </MDBox>
        </MDBox>
        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Enviado a:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
              {store.name}
            </MDTypography>
          </MDTypography>
        </MDBox>
        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Fecha:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium">
              {date}
            </MDTypography>
          </MDTypography>
        </MDBox>
        <MDBox mt={1}>
          <Accordion sx={{ background: "transparent", boxShadow: "none" }}>
            <AccordionSummary
              expandIcon={<ExpandMore color={darkMode ? "white" : "dark"} />}
              sx={{ "& > .MuiAccordionSummary-content": { flexGrow: 0 } }} // center icon
            />
            <AccordionDetails>
              <TableContainer component={Paper}>
                <SimpleBar style={{ maxHeight: 400 }}>
                  <Table sx={{ minWidth: 700 }}>
                    <TableHead>
                      <TableRow>
                        {/* Code */}
                        <TableCell align="center" width="17.5%">
                          <MDTypography variant="button" fontWeight="medium">
                            Codigo
                          </MDTypography>
                        </TableCell>

                        {/* Name */}
                        <TableCell align="center" width="25%">
                          <MDTypography variant="button" fontWeight="medium">
                            Nombre
                          </MDTypography>
                        </TableCell>

                        {/* Type */}
                        <TableCell align="center" width="20%">
                          <MDTypography variant="button" fontWeight="medium">
                            Tipo
                          </MDTypography>
                        </TableCell>

                        {/* Type Class */}
                        <TableCell align="center" width="10%">
                          <MDTypography variant="button" fontWeight="medium">
                            Clase
                          </MDTypography>
                        </TableCell>

                        {/* Size */}
                        <TableCell align="center" width="17.5%">
                          <MDTypography variant="button" fontWeight="medium">
                            Medida
                          </MDTypography>
                        </TableCell>

                        {/* Quantity */}
                        <TableCell align="center" width="10%">
                          <MDTypography variant="button" fontWeight="medium">
                            Cantidad
                          </MDTypography>
                        </TableCell>

                        {/* TODO: add */}
                        {/* Inventory Code */}
                        {/* <TableCell align="center" width="10%">
                          <MDTypography variant="button" fontWeight="medium">
                            # Inventario
                          </MDTypography>
                        </TableCell> */}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        addLabelsToProducts(products)?.map(product => (
                          <TableRow
                            key={product._id + product.size}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            {/* Code */}
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product?.code}
                              </MDTypography>
                            </TableCell>

                            {/* Name */}
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product?.name}
                              </MDTypography>
                            </TableCell>

                            {/* Type */}
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product?.type?.label}
                              </MDTypography>
                            </TableCell>

                            {/* Type Class */}
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product?.typeClass ?? ""}
                              </MDTypography>
                            </TableCell>

                            {/* Size */}
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product?.size?.label}
                              </MDTypography>
                            </TableCell>

                            {/* Quantity */}
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product?.quantity}
                              </MDTypography>
                            </TableCell>

                            {/* TODO: add */}
                            {/* Quantity */}
                            {/* <TableCell align="center">
                              <MDTypography variant="caption">
                                {product?.inventoryRef?.code}
                              </MDTypography>
                            </TableCell> */}
                          </TableRow>
                        ))
                      }
                    </TableBody>
                  </Table>
                </SimpleBar>
              </TableContainer>
            </AccordionDetails>
          </Accordion>
        </MDBox>
      </MDBox>
    </MDBox>
  );
}

// Setting default values for the props of Bill
ShippingDetails.defaultProps = {
  title: "",
  shippingData: {},
  noGutter: false,
};

// Typechecking props for the Bill
ShippingDetails.propTypes = {
  title: PropTypes.string.isRequired,
  shippingData: PropTypes.object.isRequired,
  noGutter: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
};

export default ShippingDetails;
