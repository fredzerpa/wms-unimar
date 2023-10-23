import { LinearProgress } from "@mui/material";
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import logo from "assets/images/logo.svg";

const LoadingPage = ({ message = "" }) => {

  return (
    <MDBox display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 16px)">
      <MDBox sx={{ width: 360, maxWidth: "80%" }}>
        <img src={logo} alt="Paint Logo" width="100%" />
        <MDBox sx={{ overflow: "hidden" }}>
          <LinearProgress color="warning" />
        </MDBox>
        <MDTypography mt={2} align="center">
          {message}
        </MDTypography>
      </MDBox>
    </MDBox>
  )
}

export default LoadingPage;