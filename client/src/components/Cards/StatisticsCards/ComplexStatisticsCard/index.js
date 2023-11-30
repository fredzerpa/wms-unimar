// prop-types is a library for typechecking of props
import PropTypes from "prop-types";

// @mui material components
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import { MenuItem, Select } from "@mui/material";
import SettingsMenu from "layouts/profile/components/SettingsMenu/SettingsMenu";

const ComplexStatisticsCard = ({ color, title, count, percentage, icon, slotProps, options, onOptionChange }) => {
  return (
    <Card {...slotProps?.card}>
      <MDBox display="flex" justifyContent="space-between" pt={1} px={2}>
        <MDBox
          variant="gradient"
          bgColor={color}
          color={color === "light" ? "dark" : "white"}
          coloredShadow={color}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          width="4rem"
          height="4rem"
          mt={-3}
        >
          <Icon fontSize="medium" color="inherit" {...slotProps?.icon}>
            {icon}
          </Icon>
        </MDBox>
        <MDBox lineHeight={1.25}>
          <MDBox display="flex" justifyContent="flex-end" mb={1}>
            <MDBox mt={2} mr={1}>
              <MDTypography variant="button" align="right" fontWeight="light" color="text" component="p" {...slotProps?.title}>
                {title}
              </MDTypography>
              <MDTypography variant="h4" align="right" {...slotProps?.count}>{count}</MDTypography>
            </MDBox>
            <SettingsMenu
              button={{
                size: "medium",
                sx: { p: 0 },
                disableRipple: true,
              }}
              menu={{
                transformOrigin: { horizontal: "right", vertical: "top" },
                anchorOrigin: { horizontal: "right", vertical: "bottom" }
              }}
              items={options.map(option => ({
                label: option.label,
                action: () => onOptionChange(option),
              }))}
              noDivision
            />
          </MDBox>
        </MDBox>
      </MDBox>
      <Divider />
      <MDBox pb={2} px={2}>
        <MDTypography component="p" variant="button" color="text" display="flex">
          <MDTypography
            component="span"
            variant="button"
            fontWeight="bold"
            color={percentage.color}
            {...slotProps?.percentage}
          >
            {percentage.amount}
          </MDTypography>
          &nbsp;{percentage.label}
        </MDTypography>
      </MDBox>
    </Card>
  );
}

// Setting default values for the props of ComplexStatisticsCard
ComplexStatisticsCard.defaultProps = {
  color: "info",
  percentage: {
    color: "success",
    text: "",
    label: "",
  },
};

// Typechecking props for the ComplexStatisticsCard
ComplexStatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "primary",
    "secondary",
    "info",
    "success",
    "warning",
    "error",
    "light",
    "dark",
  ]),
  title: PropTypes.string.isRequired,
  count: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  percentage: PropTypes.shape({
    color: PropTypes.oneOf([
      "primary",
      "secondary",
      "info",
      "success",
      "warning",
      "error",
      "dark",
      "white",
    ]),
    amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  }),
  icon: PropTypes.node.isRequired,
};

export default ComplexStatisticsCard;
