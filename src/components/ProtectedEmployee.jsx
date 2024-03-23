import { useNavigate } from "react-router-dom";
import { useProtectedRouteUsers } from "./ProtectedRouteUsers";
import { useEffect } from "react";

function ProtectedEmployee({ children }) {
  const navigate = useNavigate();
  const { typeUser } = useProtectedRouteUsers();

  useEffect(() => {
    if (typeUser !== "employee") {
      navigate("/electronix/1");
    }
  }, [typeUser, navigate]);

  return <>{typeUser === "employee" ? <div>{children}</div> : null}</>;
}

export default ProtectedEmployee;
