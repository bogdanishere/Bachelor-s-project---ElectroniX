import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

function RouteLoginSignup({ children }) {
  const [activeTab, setActiveTab] = useState("");

  return (
    <AuthContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </AuthContext.Provider>
  );
}

export default RouteLoginSignup;
