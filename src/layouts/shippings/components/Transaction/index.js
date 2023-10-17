// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import colors from "assets/theme/base/colors";
import pxToRem from "assets/theme/functions/pxToRem";
import { useMaterialUIController } from "context";

const Transaction = ({ color, name, description, value, onClick }) => {
  const [controller] = useMaterialUIController();
  const { darkMode } = controller;

  const containerStyles = {
    '&:hover': {
      borderRadius: pxToRem(12),
      backgroundColor: darkMode ? colors.dark.focus : colors.light.main,
      cursor: 'pointer',
    }
  }

  return (
    <MDBox key={name} component="li" py={1} px={2} mb={1} sx={containerStyles} onClick={onClick}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center">
        <MDBox display="flex" alignItems="center">
          <MDBox display="flex" flexDirection="column">
            <MDTypography variant="button" fontWeight="medium" gutterBottom>
              {name}
            </MDTypography>
            <MDTypography variant="caption" color="text" fontWeight="regular">
              {description}
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDTypography variant="button" color={color} fontWeight="medium" textGradient>
          {value}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

// Typechecking props of the Transaction
Transaction.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]).isRequired,
  name: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default Transaction;
