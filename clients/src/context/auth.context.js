import { createContext, useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import LoadingPage from "layouts/loading";
import { usersData } from "data/usersData";

const AuthContext = createContext(null);

export const AuthProvider = ({ userData, children }) => {
  const [user, setUser] = useState(userData);
  const [loadingSession, setLoadingSession] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoadingSession(true);
    (async () => {
      try {
        // Check for response in 15 seconds
        setTimeout(() => { setError({ type: "Connection unstable", error: "Bad internet connection" }) }, 15000);

        const data = await (new Promise((res, rej) => setTimeout(() => res(usersData[0]), 4000)));
        if (data?.error) throw new Error(data);
        setUser(data);
      } catch (err) {
        console.log(err);

        setError({
          type: "Fetching Session",
          error: err.response,
        });
      } finally {
        setLoadingSession(false);
      }
    })();

    return setError(null);
  }, [])

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {
        loadingSession ?
          <LoadingPage message={error?.type === "Connection unstable" && "Conexion a internet inestable"} />
          :
          children
      }
    </AuthContext.Provider>
  )
};

AuthProvider.propTypes = {
  userData: PropTypes.any,
  children: PropTypes.any,
};

export const useAuth = () => useContext(AuthContext);
