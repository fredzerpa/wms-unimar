import { useCallback, useEffect, useState } from "react";
// @mui material components
import Card from "@mui/material/Card";
import { InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import SimpleBar from "simplebar-react";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

// Billing page components
import ShippingDetails from "layouts/shippings/components/ShippingDetails";
import AddShippingButton from "../AddShippingButton";
import ShippingModalForm from "components/Modals/ShippingForm";

import { shippingsData } from "data/shippingData";
import { DateTime } from "luxon";
import DebouncedInput from "components/DebouncedInput";


const ShippingsHistory = () => {
  const [shippings, setShippings] = useState(shippingsData);
  const [editShipping, setEditShipping] = useState(null);

  const closeEditShipping = () => setEditShipping(null);

  useEffect(() => console.log(editShipping), [editShipping])

  const handleEditShipping = shippingData => {
    setEditShipping(shippingData);
  }
  const handleDeleteShipping = shippingData => console.log(shippingData);

  const handleSearch = useCallback(search => {
    const filteredData = shippingsData.filter(shippingData => {
      const { store, date, products } = shippingData

      const detailedData = [store.name, date, ...products.flatMap(({ code, name }) => [code, name])];

      const regex = new RegExp(search, "gi");
      return detailedData.filter(data => regex.test(data)).length
    })

    setShippings(filteredData);
  }, [])

  const sortShippings = data => data.sort((a, b) => {
    const diff = DateTime.fromFormat(b.date, 'dd/MM/yyyy').diff(DateTime.fromFormat(a.date, 'dd/MM/yyyy')).as('milliseconds');
    if (diff < 0) return -1
    else if (diff > 0) return 1
    else return 0
  });

  return (
    <>
      <Card>
        <MDBox pt={3} px={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDBox>
            <MDTypography variant="h6" fontWeight="medium">
              Historial de Envios
            </MDTypography>
          </MDBox>
          <MDBox display="flex" gap={2} justifyContent="space-between" alignItems="center">
            <MDBox>
              <DebouncedInput
                label="Busca aqui.."
                size="small"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Search />
                    </InputAdornment>
                  ),
                }}
                onChange={handleSearch}
              />
            </MDBox>
            <MDBox>
              <AddShippingButton />
            </MDBox>
          </MDBox>
        </MDBox>
        <SimpleBar style={{ maxHeight: "600px" }}>
          <MDBox pt={1} pb={2} px={2}>
            <MDBox display="flex" justifyContent="flex-end" pt={1}>
              <MDTypography variant="caption" fontWeight="medium" align="right">
                {shippings.length} envios encontrados
              </MDTypography>
            </MDBox>
            <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
              {
                sortShippings(shippings).map(data => (
                  <ShippingDetails
                    key={data._id}
                    title={`${data.products.length} Productos Enviados`}
                    shippingData={data}
                    onEdit={e => handleEditShipping(data)}
                    onDelete={e => handleDeleteShipping(data)}
                  />
                ))
              }
            </MDBox>
          </MDBox>
        </SimpleBar>
      </Card>
      {
        editShipping && (
          <ShippingModalForm shippingData={editShipping} open={!!editShipping} close={closeEditShipping} onSubmit={console.log} />
        )
      }
    </>
  );
}

export default ShippingsHistory;
