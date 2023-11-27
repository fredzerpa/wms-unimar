import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth.context";
import createBillApi from "api/billing.api";

const BillsContext = createContext(null);

export const BillsProvider = ({ children }) => {
  const { user } = useAuth();
  const [bills, setBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(false);
  const [errors, setErrors] = useState(null);

  const billApiInstance = useCallback(() => createBillApi(user.token), [user]);

  const getBills = useCallback(async () => {
    try {
      setLoadingBills(true);
      const { data: bills } = await billApiInstance().getAllBills();
      return bills
    } catch (err) {
      setErrors(...err?.response?.data);
    } finally {
      setLoadingBills(false);
    }
  }, [billApiInstance]);

  const loadBills = useCallback(async () => {
    setBills(await getBills());
  }, [getBills])

  useEffect(() => {
    // Al ser un context de react, este carga al inicio del render de la pagina
    // aun cuando no se esta logueado por lo que es necesario evitar acceder a la BD sin un usuario
    if (user) loadBills();
  }, [loadBills, user])

  const getBillById = useCallback(async (billId) => {
    try {
      setLoadingBills(true);
      const { data } = await billApiInstance().getBillById(billId);
      return data;
    } catch (err) {
      setErrors(...err?.response?.data);
    } finally {
      setLoadingBills(false);
    }
  }, [billApiInstance])

  const createBill = useCallback(async billData => {
    try {
      const { data } = await billApiInstance().createBill(billData);
      await loadBills();
      return data;
    } catch (err) {
      const { error, message } = err.response.data;
      return {
        error,
        message,
      }
    }
  }, [loadBills, billApiInstance])

  const updateBillById = useCallback(async (billId, billData) => {
    try {
      const { data } = await billApiInstance().updateBillById(billId, billData);
      await loadBills()
      return data;
    } catch (err) {
      setErrors(...err?.response?.data);
    }
  }, [billApiInstance, loadBills])

  const deleteBillById = useCallback(async (billId) => {
    try {
      const { data } = await billApiInstance().deleteBillById(billId);
      await loadBills()
      return data;
    } catch (err) {
      setErrors(...err?.response?.data);
    }
  }, [loadBills, billApiInstance])

  return (
    <BillsContext.Provider
      value={{
        bills,
        loadBills,
        getBillById,
        createBill,
        updateBillById,
        deleteBillById,
        loadingBills,
        errors
      }}
    >
      {children}
    </BillsContext.Provider>
  )
}

export const useBills = () => useContext(BillsContext);