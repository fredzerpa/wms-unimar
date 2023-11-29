import { memo, useCallback, useState } from "react";
import isEqual from "react-fast-compare";
import Card from "@mui/material/Card";
import { InputAdornment } from "@mui/material";
import { Search } from "@mui/icons-material";
import SimpleBar from "simplebar-react";
import { DateTime } from "luxon";

// Material Dashboard 2 React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import BillDetails from "layouts/billing/components/BillDetails";
import AddBillButton from "../AddBillButton";
import BillModalForm from "components/Modals/BillForm";
import DebouncedInput from "components/DebouncedInput";

// Context
import { useBills } from "context/bills.context";
import { useInventory } from "context/inventory.context";
import { useAuth } from "context/auth.context";

const BillingHistory = () => {
  const { user: userSession } = useAuth();

  const { bills, createBill, updateBillById, deleteBillById } = useBills();
  const { loadInventory } = useInventory();
  const [search, setSearch] = useState(bills);
  const [editBill, setEditBill] = useState(null);

  const closeEditBill = () => setEditBill(null);

  const handleEditBill = billData => setEditBill(billData);
  const handleCreateBill = async billData => {
    await createBill(billData);
    await loadInventory();
  }
  const handleUpdateBill = async billData => {
    await updateBillById(billData._id, billData);
    await loadInventory();
  }
  const handleDeleteBill = async billData => {
    await deleteBillById(billData._id);
    await loadInventory();
  }

  const handleSearch = useCallback(search => {
    const filteredData = bills.filter(billData => {
      const { provider, date, products } = billData

      const detailedData = [provider.name, date, ...products.flatMap(({ code, name }) => [code, name])];
      const regex = new RegExp(search, "gi");
      return detailedData.filter(data => regex.test(data)).length
    })

    setSearch(filteredData);
  }, [bills])

  const sortBills = data => data.sort((a, b) => {
    const diff = DateTime.fromFormat(b.date, "dd/MM/yyyy").diff(DateTime.fromFormat(a.date, "dd/MM/yyyy")).as("milliseconds");
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
              Historial de Facturas
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
                      <Search color="text" />
                    </InputAdornment>
                  ),
                }}
                onChange={handleSearch}
              />
            </MDBox>
            <MDBox>
              <AddBillButton createBill={handleCreateBill} />
            </MDBox>
          </MDBox>
        </MDBox>
        <SimpleBar style={{ maxHeight: "600px" }}>
          <MDBox pt={1} pb={2} px={2}>
            <MDBox display="flex" justifyContent="flex-end" pt={1}>
              <MDTypography variant="caption" fontWeight="medium" align="right">
                {search.length} facturas encontradas
              </MDTypography>
            </MDBox>
            <MDBox component="ul" display="flex" flexDirection="column" p={0} m={0}>
              {
                sortBills(search).map((bill, idx, arr) => (
                  <BillDetails
                    key={bill._id}
                    title={`#${bill.code}`}
                    billData={bill}
                    onEdit={handleEditBill}
                    onDelete={userSession?.privileges?.billing?.delete ? handleDeleteBill : null}                    
                    readOnly={!userSession?.privileges?.billing?.upsert}
                    noGutter={arr.length === (idx + 1)}
                  />
                ))
              }
            </MDBox>
          </MDBox>
        </SimpleBar>
      </Card>
      {
        editBill && (
          <BillModalForm
            billData={editBill}
            open={!!editBill}
            close={closeEditBill}
            onSubmit={handleUpdateBill}
            onDelete={handleDeleteBill}
          />
        )
      }
    </>
  );
}

export default memo(BillingHistory, isEqual);
