// @mui material components
import Card from "@mui/material/Card";
import SimpleBar from "simplebar-react";
import { DateTime } from "luxon";

// Components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import TimelineItem from "components/Timeline/TimelineItem";


const OrdersOverview = ({ title, subtitle, orders }) => {

  return (
    <Card sx={{ py: 3 }}>
      <SimpleBar style={{ maxHeight: 500 }}> {/* 500px stands for DataTable height */}
        <MDBox px={3}>
          <MDTypography variant="h6" fontWeight="medium">
            {title}
          </MDTypography>
          <MDBox mt={0} mb={2}>
            <MDTypography variant="button" color="text" fontWeight="regular">
              <MDTypography variant="button" color={subtitle?.label ? subtitle?.color : "dark"} fontWeight="medium">
                {subtitle?.label ?? ""}
              </MDTypography>
              {" "} este mes
            </MDTypography>
          </MDBox>
        </MDBox>
        <MDBox px={2}>
          {
            (() => {
              const COLORS_MAP = {
                bill: "primary",
                shipping: "success",
              }
              const ICONS_MAP = {
                shipping: "send",
                bill: "shopping_cart",
              }

              if (!orders.length) return (
                <MDTypography align="center">
                  No hay actividades recientes
                </MDTypography>
              )

              return orders.map((order, idx, arr) => {
                const orderCanceled = order.status === "canceled";
                const isShipping = order?.isShipping;
                const color = orderCanceled ? "warning" : COLORS_MAP[isShipping ? "shipping" : "bill"];
                const icon = orderCanceled ? "close" : ICONS_MAP[isShipping ? "shipping" : "bill"];
                const title = orderCanceled ?
                  isShipping ?
                    `Cancelación de envio orden #${order.code}`
                    :
                    `Cancelación de compra de productos orden #${order.code}`
                  :
                  isShipping ?
                    `${order?.products?.length} producto's enviados a ${order?.store?.name}`
                    :
                    `Compra de ${order?.products?.length} por ${order?.provider?.name}`

                const datetime = DateTime.fromFormat(order.date, "dd/MM/yyyy").setLocale("es-ES");

                return (
                  <TimelineItem
                    key={order._id}
                    color={color}
                    icon={icon}
                    title={title}
                    dateTime={`${datetime.day} ${datetime.monthShort.toUpperCase()}`}
                    lastItem={idx + 1 === arr.length}
                  />
                )
              })
            })()
          }
        </MDBox>
      </SimpleBar>
    </Card>
  );
}

export default OrdersOverview;
