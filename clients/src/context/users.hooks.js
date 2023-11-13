import { useCallback, useEffect, useState } from "react";
import { usersData } from "data/usersData";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errors, setErrors] = useState(null);

  const loadUsers = useCallback(async () => {
    try {
      setLoadingUsers(true);
      const data = await (new Promise((res, rej) => setTimeout(() => res(usersData), 800)));
      setUsers(data);
    } catch (error) {
      setErrors({
        type: "Loading Users",
        message: error.response,
      })
    } finally {
      setLoadingUsers(false);
    }
  }, [])

  useEffect(() => {
    loadUsers();
  }, [loadUsers])

  return {
    users,
    loadUsers,
    loadingUsers,
    errors,
  }
}

export default useUsers;