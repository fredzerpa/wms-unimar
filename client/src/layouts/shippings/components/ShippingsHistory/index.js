import { useCallback, useEffect, useState } from "react";
// @mui material components
import Card from "@mui/material/Card";
import { InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import SimpleBar from "simplebar-react";
import { DateTime } from "luxon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import ShippingDetails from "layouts/shippings/components/ShippingDetails";
import AddShippingButton from "../AddShippingButton";
import ShippingModalForm from "components/Modals/ShippingForm";
import DebouncedInput from "components/DebouncedInput";

// Context
import { useShippings } from "context/shippings.context";
import { useInventory } from "context/inventory.context";
import { useAuth } from "context/auth.context";


const ShippingsHistory = () => {
  const { user: userSession } = useAuth();
  const { shippings, createShipping, updateShippingById, deleteShippingById } = useShippings();
  const { loadInventory } = useInventory();
  const [filteredShippings, setFilteredShippings] = useState([]);
  const [editShipping, setEditShipping] = useState(null);

  const closeEditShipping = () => setEditShipping(null);

  useEffect(() => {
    // Load shippings
    setFilteredShippings(shippings);
  }, [shippings])

  const handleEditShipping = shippingData => setEditShipping(shippingData);
  const handleCreateShipping = async shippingData => {
    await createShipping(shippingData);
    await loadInventory();
  }
  const handleUpdateShipping = async shippingData => {
    await updateShippingById(shippingData._id, shippingData);
    await loadInventory();
  }
  const handleDeleteShipping = async shippingData => {
    await deleteShippingById(shippingData._id);
    await loadInventory();
  }

  const handleSearch = useCallback(search => {
    const filteredData = shippings.filter(shippingData => {
      const { store, date, products, code: orderNumber } = shippingData

      const detailedData = [store.name, date, orderNumber, ...products.flatMap(({ code, name }) => [code, name])];

      const regex = new RegExp(search, "gi");
      return detailedData.filter(data => regex.test(data)).length
    })

    setFilteredShippings(filteredData);
  }, [shippings])

  const sortShippings = data => data.sort((a, b) => {
    const diff = DateTime.fromFormat(b.date, 'dd/MM/yyyy').diff(DateTime.fromFormat(a.date, 'dd/MM/yyyy')).as('milliseconds');
    if (diff < 0) return -1
    else if (diff > 0) return 1
    else return 0
  });

  return (
    <>
      <Card>
        <MDBox pt={3} px={2} pb={2} display="flex" justifyContent="space-between" alignItems="center">
          <MDTypography variant="h6" fontWeight="medium">
            Historial de Envios
          </MDTypography>
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
            {
              userSession?.privileges?.shippings?.upsert && (
                <MDBox>
                  <AddShippingButton createShipping={handleCreateShipping} />
                </MDBox>
              )
            }
          </MDBox>
        </MDBox>
        <SimpleBar style={{ maxHeight: "600px" }}>
          <MDBox pt={1} pb={2} px={2}>
            <MDBox display="flex" justifyContent="flex-end" pt={1}>
              <MDTypography variant="caption" fontWeight="medium" align="right">
                {filteredShippings.length} envios encontrados
              </MDTypography>
            </MDBox>
            <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
              {
                sortShippings(filteredShippings).map((shipping, idx, arr) => (
                  <ShippingDetails
                    key={shipping.code}
                    title={`Orden #${shipping.code}`}
                    shippingData={shipping}
                    onEdit={handleEditShipping}
                    onDelete={userSession?.privileges?.shippings?.delete ? handleDeleteShipping : null}
                    readOnly={!userSession?.privileges?.shippings?.upsert}
                    noGutter={arr.length === (idx + 1)}
                  />
                ))
              }
            </MDBox>
          </MDBox>
        </SimpleBar>
      </Card>
      {
        editShipping && (
          <ShippingModalForm
            shippingData={editShipping}
            open={!!editShipping}
            close={closeEditShipping}
            onSubmit={handleUpdateShipping}
            onDelete={handleDeleteShipping}
          />
        )
      }
    </>
  );
}

export default ShippingsHistory;
