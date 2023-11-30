import { LinearProgress, Box, Typography } from "@mui/material";

import logo from "assets/images/tiendas-montana.png";

const LoadingPage = ({ message = "" }) => {

  return (
    <Box display="flex" justifyContent="center" alignItems="center" height="calc(100vh - 16px)">
      <Box sx={{ width: 360, maxWidth: "80%" }}>
        <img src={logo} alt="Pinturas Montana Logo" width="100%" />
        <Box sx={{ overflow: "hidden" }}>
          <LinearProgress color="info" />
        </Box>
        <Typography mt={2} align="center">
          {message}
        </Typography>
      </Box>
    </Box>
  )
}

export default LoadingPage;