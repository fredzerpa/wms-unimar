// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDButton from "components/MDButton";

// Material Dashboard 2 React context
import { useMaterialUIController } from "context";
import colorsDark from "assets/theme-dark/base/colors";
import { Accordion, AccordionDetails, AccordionSummary, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import SimpleBar from "simplebar-react";
import { formatShippingsProductsLabels } from "components/Modals/ShippingForm/utils/functions.utils";

const ShippingDetails = ({ title, shippingData, noGutter, onEdit, onDelete }) => {
  const { store, date, products } = shippingData;

  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

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
            {title}
          </MDTypography>

          <MDBox display="flex" alignItems="center" mt={{ xs: 2, sm: 0 }} ml={{ xs: -1.5, sm: 0 }}>
            <MDBox mr={1}>
              <MDButton variant="text" color="error" onClick={onDelete}>
                <Icon>delete</Icon>&nbsp;delete
              </MDButton>
            </MDBox>
            <MDButton variant="text" color={darkMode ? "white" : "dark"} onClick={onEdit}>
              <Icon>edit</Icon>&nbsp;edit
            </MDButton>
          </MDBox>
        </MDBox>
        <MDBox mb={1} lineHeight={0}>
          <MDTypography variant="caption" color="text">
            Enviado a:&nbsp;&nbsp;&nbsp;
            <MDTypography variant="caption" fontWeight="medium" textTransform="capitalize">
              Local {store}
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
                        <TableCell align="center" width="15%">
                          <MDTypography variant="button" fontWeight="medium">
                            Codigo
                          </MDTypography>
                        </TableCell>
                        <TableCell align="center" width="25%">
                          <MDTypography variant="button" fontWeight="medium">
                            Nombre
                          </MDTypography>
                        </TableCell>
                        <TableCell align="center" width="20%">
                          <MDTypography variant="button" fontWeight="medium">
                            Tipo
                          </MDTypography>
                        </TableCell>
                        <TableCell align="center" width="7.5%">
                          <MDTypography variant="button" fontWeight="medium">
                            Clase
                          </MDTypography>
                        </TableCell>
                        <TableCell align="center" width="15%">
                          <MDTypography variant="button" fontWeight="medium">
                            Medida
                          </MDTypography>
                        </TableCell>
                        <TableCell align="center" width="10%">
                          <MDTypography variant="button" fontWeight="medium">
                            Cantidad
                          </MDTypography>
                        </TableCell>
                        <TableCell align="center" width="7.5%">
                          <MDTypography variant="button" fontWeight="medium">
                            Lote
                          </MDTypography>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {
                        formatShippingsProductsLabels(products).map(product => (
                          <TableRow
                            key={product.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                          >
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product.code}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product.name}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product.type}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product.typeClass ?? ""}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product.size}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                {product.quantity}
                              </MDTypography>
                            </TableCell>
                            <TableCell align="center">
                              <MDTypography variant="caption">
                                1
                              </MDTypography>
                            </TableCell>
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
