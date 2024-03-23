import { createContext, useContext, useState } from "react";

const ProtectedRouteUsersContext = createContext();

export const useProtectedRouteUsers = () =>
  useContext(ProtectedRouteUsersContext);

function ProtectedRouteUsers({ children }) {
  const [username, setUsername] = useState("");
  const [typeUser, setTypeUser] = useState("client");
  return (
    <ProtectedRouteUsersContext.Provider
      value={{ username, setUsername, typeUser, setTypeUser }}
    >
      {children}
    </ProtectedRouteUsersContext.Provider>
  );
}

export default ProtectedRouteUsers;
