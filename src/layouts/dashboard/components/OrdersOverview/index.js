// @mui material components
import Card from "@mui/material/Card";
import Icon from "@mui/material/Icon";
import SimpleBar from "simplebar-react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Material Dashboard 2 React example components
import TimelineItem from "examples/Timeline/TimelineItem";

const OrdersOverview = () => {
  return (
    <Card sx={{ height: "100%", py: 3 }}>
      <SimpleBar style={{ maxHeight: 500 }}> {/* 500px stands for DataTable height */}
        <MDBox px={3}>
          <MDTypography variant="h6" fontWeight="medium">
            Ultimos 30 dias
          </MDTypography>
          <MDBox mt={0} mb={2}>
            <MDTypography variant="button" color="text" fontWeight="regular">
              <MDTypography display="inline" variant="body2" verticalAlign="middle">
                <Icon sx={{ color: ({ palette: { success } }) => success.main }}>arrow_upward</Icon>
              </MDTypography>
              &nbsp;
              <MDTypography variant="button" color="text" fontWeight="medium">
                24%
              </MDTypography>{" "}
              envios este mes
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox px={2}>
          <TimelineItem
            color="primary"
            icon="shopping_cart"
            title="Compra de 100 productos"
            dateTime="5 OCT"
          />
          <TimelineItem
            color="success"
            icon="send"
            title="64 productos enviados a Local-1"
            dateTime="5 OCT"
          />
          <TimelineItem
            color="warning"
            icon="close"
            title="Cancelación de compra de productos orden #1832412"
            dateTime="3 OCT"
          />
          <TimelineItem
            color="success"
            icon="send"
            title="20 productos enviados a Local-2"
            dateTime="1 OCT"
          />
          <TimelineItem
            color="success"
            icon="send"
            title="44 productos enviados a Local-4"
            dateTime="1 OCT"
          />
          <TimelineItem
            color="primary"
            icon="shopping_cart"
            title="Compra de 120 productos"
            dateTime="28 SEP"
          />
          <TimelineItem
            color="success"
            icon="send"
            title="37 productos enviados a Local-3"
            dateTime="25 SEP"
            lastItem
          />
        </MDBox>
      </SimpleBar>
    </Card>
  );
}

export default OrdersOverview;
