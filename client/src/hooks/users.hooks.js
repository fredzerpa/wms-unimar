import { useCallback, useEffect, useState } from "react";
import { useAuth } from "context/auth.context";
import createUserApi from "api/users.api";

const useUsers = () => {
  const [users, setUsers] = useState([]);
  const { user, setUser } = useAuth();

  const userApiInstance = useCallback(() => createUserApi(user.token), [user.token]);

  const loadUsers = useCallback(async () => {
    const { data } = await userApiInstance().getAllUsers();
    setUsers(data);
  }, [userApiInstance])

  useEffect(() => {
    loadUsers();
  }, [loadUsers])

  const getUserById = useCallback(async (userId) => {
    try {
      const { data } = await userApiInstance().getUserById(userId);
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [userApiInstance])

  const createUser = useCallback(async (userData) => {
    try {
      const { data } = await userApiInstance().createUser(userData);
      await loadUsers();
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [loadUsers, userApiInstance])

  const updateUserByEmail = useCallback(async (userEmail, userData) => {
    try {
      const { data } = await userApiInstance().updateUserByEmail(userEmail, userData);
      await loadUsers()
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [loadUsers, userApiInstance])

  const deleteUserByEmail = useCallback(async (userEmail) => {
    try {
      const { data: userDeleted } = await userApiInstance().deleteUserByEmail(userEmail);
      await loadUsers()
      return userDeleted;
    } catch (err) {
      return err.response.data;
    }
  }, [loadUsers, userApiInstance])

  const changePassword = useCallback(async (oldPassword, newPassword) => {
    try {
      const { data } = await userApiInstance().changePassword(oldPassword, newPassword);
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [userApiInstance])

  const updateSelfData = useCallback(async (userData) => {
    try {
      delete userData.isAdmin; // User cannot self update this property
      delete userData.privileges; // User cannot self update this property
      delete userData.password; // This property is not updated here
      const { data } = await userApiInstance().updateSelfUser(userData);
      setUser(data);
      return data;
    } catch (err) {
      return err.response.data;
    }
  }, [setUser, userApiInstance])


  return {
    users,
    loadUsers,
    getUserById,
    createUser,
    updateUserByEmail,
    deleteUserByEmail,
    changePassword,
    updateSelfData,
  }
}

export default useUsers;