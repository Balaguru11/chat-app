import { useContext, useDebugValue } from "react";
import { AuthContext } from "../App";

const useAuth = () => {
  const context = useContext(AuthContext);
  const { state } = context;
  useDebugValue(state, state?.isLoggedIn ? "Logged In" : "Logged Out");
  return context;
};

export default useAuth;
