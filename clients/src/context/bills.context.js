import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { billsData } from "data/billsData";

const BillsContext = createContext(null);

export const BillsProvider = ({ children }) => {
  const [bills, setBills] = useState([]);
  const [loadingBills, setLoadingBills] = useState(false);
  const [errors, setErrors] = useState(null);

  const loadBills = useCallback(async () => {
    try {
      setLoadingBills(true);
      const data = await (new Promise((res, rej) => setTimeout(() => res(billsData), 800)));
      setBills(data);
    } catch (error) {
      setErrors({
        type: "Loading Bills",
        message: error.response,
      })
    } finally {
      setLoadingBills(false);
    }
  }, [])

  useEffect(() => {
    loadBills();
  }, [loadBills])

  return (
    <BillsContext.Provider value={{ bills, loadingBills, errors }}>
      {children}
    </BillsContext.Provider>
  )
}

export const useBills = () => useContext(BillsContext);