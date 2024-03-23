import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useProtectedRouteUsers } from "./ProtectedRouteUsers";

function ProtectedProviders({ children }) {
  const navigate = useNavigate();
  const { typeUser } = useProtectedRouteUsers();

  useEffect(() => {
    if (typeUser !== "provider") {
      navigate("/electronix/1");
    }
  }, [typeUser, navigate]);

  return <>{typeUser === "provider" ? <div>{children}</div> : null}</>;
}

export default ProtectedProviders;
