import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "./auth.context";
import createInventoryApi from "api/inventory.api";

const InventoryRecordsContext = createContext(null);

export const InventoryProvider = ({ children }) => {
  const { user } = useAuth();
  const [inventory, setInventoryRecords] = useState([]);
  const [loadingInventory, setLoadingInventory] = useState(false);
  const [errors, setErrors] = useState(null);

  const inventoryApiInstance = useCallback(() => createInventoryApi(user.token), [user]);

  const getInventoryRecords = useCallback(async () => {
    try {
      setLoadingInventory(true);
      const { data: inventorys } = await inventoryApiInstance().getAllInventoryRecords();
      return inventorys
    } catch (err) {
      setErrors(...err.response.data);
    } finally {
      setLoadingInventory(false);
    }
  }, [inventoryApiInstance]);

  const loadInventory = useCallback(async () => {
    setInventoryRecords(await getInventoryRecords());
  }, [getInventoryRecords])

  useEffect(() => {
    // Al ser un context de react, este carga al inicio del render de la pagina
    // aun cuando no se esta logueado por lo que es necesario evitar acceder a la BD sin un usuario
    if (user) loadInventory();
  }, [loadInventory, user])

  const getInventoryRecordById = useCallback(async (inventoryId) => {
    try {
      setLoadingInventory(true);
      const { data } = await inventoryApiInstance().getInventoryRecordById(inventoryId);
      return data;
    } catch (err) {
      setErrors(...err.response.data);

    } finally {
      setLoadingInventory(false);
    }
  }, [inventoryApiInstance])

  const createInventoryRecord = useCallback(async (eventData) => {
    try {
      const { data } = await inventoryApiInstance().createInventoryRecord(eventData);
      await loadInventory();
      return data;
    } catch (err) {
      setErrors(...err.response.data);

    }
  }, [loadInventory, inventoryApiInstance])

  const updateInventoryRecordById = useCallback(async (inventoryRecordId, inventoryRecordData) => {
    try {
      const { data } = await inventoryApiInstance().updateInventoryRecordById(inventoryRecordId, inventoryRecordData);
      await loadInventory()
      return data;
    } catch (err) {
      setErrors(...err.response.data);
    }
  }, [inventoryApiInstance, loadInventory])

  const deleteInventoryRecordById = useCallback(async (eventId) => {
    try {
      const { data } = await inventoryApiInstance().deleteInventoryRecordById(eventId);
      await loadInventory()
      return data;
    } catch (err) {
      setErrors(...err.response.data);
    }
  }, [loadInventory, inventoryApiInstance])

  return (
    <InventoryRecordsContext.Provider
      value={{
        inventory,
        getInventoryRecordById,
        createInventoryRecord,
        updateInventoryRecordById,
        deleteInventoryRecordById,
        loadingInventory,
        errors
      }}
    >
      {children}
    </InventoryRecordsContext.Provider>
  )
}

export const useInventory = () => useContext(InventoryRecordsContext);