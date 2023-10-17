// @mui material components
import Card from "@mui/material/Card";
// import Divider from "@mui/material/Divider";
import Icon from "@mui/material/Icon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
// import MDButton from "components/MDButton";

// Billing page components
import Transaction from "layouts/shippings/components/Transaction";
import { DateTime } from "luxon";
import SimpleBar from "simplebar-react";

const Transactions = () => {
  const todayDT = DateTime.now().setLocale('es-VE');

  return (
    <Card sx={{ height: "100%" }}>
      <MDBox display="flex" justifyContent="space-between" alignItems="center" pt={3} px={2}>
        <MDTypography variant="h6" fontWeight="medium" textTransform="capitalize">
          Ultimas compras
        </MDTypography>
        <MDBox display="flex" alignItems="flex-start">
          <MDBox color="text" mr={0.5} lineHeight={0}>
            <Icon color="inherit" fontSize="small">
              date_range
            </Icon>
          </MDBox>
          <MDTypography variant="button" color="text" fontWeight="regular" textTransform="capitalize">
            {todayDT.startOf('week').day} - {todayDT.endOf('week').day} {todayDT.monthLong} {todayDT.year}
          </MDTypography>
        </MDBox>
      </MDBox>
      <SimpleBar style={{ maxHeight: "600px" }}>
        <MDBox pt={3} pb={2} px={2}>
          <MDBox mb={2}>
            <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
              Mas recientes
            </MDTypography>
          </MDBox>
          <MDBox
            component="ul"
            display="flex"
            flexDirection="column"
            p={0}
            m={0}
            sx={{ listStyle: "none" }}
          >
            <Transaction
              color="error"
              icon="expand_more"
              name="Netflix"
              description="27 March 2020, at 12:30 PM"
              value="- $ 2,500"
              onClick={console.log}
            />
            <Transaction
              color="success"
              icon="expand_less"
              name="Apple"
              description="27 March 2020, at 04:30 AM"
              value="+ $ 2,000"
              onClick={console.log}
            />
          </MDBox>
          <MDBox mt={1} mb={2}>
            <MDTypography variant="caption" color="text" fontWeight="bold" textTransform="uppercase">
              Esta semana
            </MDTypography>
          </MDBox>
          <MDBox
            component="ul"
            display="flex"
            flexDirection="column"
            p={0}
            m={0}
            sx={{ listStyle: "none" }}
          >
            <Transaction
              color="success"
              icon="expand_less"
              name="Stripe"
              description="26 March 2020, at 13:45 PM"
              value="+ $ 750"
              onClick={console.log}
            />
            <Transaction
              color="success"
              icon="expand_less"
              name="HubSpot"
              description="26 March 2020, at 12:30 PM"
              value="+ $ 1,000"
              onClick={console.log}
            />
            <Transaction
              color="success"
              icon="expand_less"
              name="Creative Tim"
              description="26 March 2020, at 08:30 AM"
              value="+ $ 2,500"
              onClick={console.log}
            />
            <Transaction
              color="dark"
              icon="priority_high"
              name="Webflow"
              description="26 March 2020, at 05:00 AM"
              value="Pending"
              onClick={console.log}
            />
            <Transaction
              color="success"
              icon="expand_less"
              name="HubSpot"
              description="26 March 2020, at 12:30 PM"
              value="+ $ 1,000"
              onClick={console.log}
            />
            <Transaction
              color="success"
              icon="expand_less"
              name="Creative Tim"
              description="26 March 2020, at 08:30 AM"
              value="+ $ 2,500"
              onClick={console.log}
            />
            <Transaction
              color="dark"
              icon="priority_high"
              name="Webflow"
              description="26 March 2020, at 05:00 AM"
              value="Pending"
              onClick={console.log}
            />
          </MDBox>
        </MDBox>
      </SimpleBar>
    </Card >
  );
}

export default Transactions;
