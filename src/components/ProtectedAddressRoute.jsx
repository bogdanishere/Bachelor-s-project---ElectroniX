import { useNavigate } from "react-router-dom";
import { useAddedToCart } from "../APIs/AddToCart";
import { useEffect } from "react";

function ProtectedAddressRoute({ children }) {
  const navigate = useNavigate();
  const { name } = useAddedToCart();
  useEffect(() => {
    if (name.length === 0) navigate("/electronix/form=login");
  }, [name, navigate]);
  return <div>{children}</div>;
}

export default ProtectedAddressRoute;
