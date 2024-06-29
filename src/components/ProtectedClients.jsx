import { useNavigate } from "react-router-dom";
import { useProtectedRouteUsers } from "./ProtectedRouteUsers";
import { useEffect } from "react";

function ProtectedClients({ children }) {
  const navigate = useNavigate();
  const { typeUser } = useProtectedRouteUsers();
  console.log(typeUser);

  useEffect(() => {
    if (typeUser !== "client") {
      navigate(-1);
    }
  }, [typeUser, navigate]);

  return <div>{children}</div>;
}

export default ProtectedClients;
