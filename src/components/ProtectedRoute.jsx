import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Spinner from "../../Spinner";
import { useAddedToCart } from "../APIs/AddToCart";

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const session_id = params.get("session_id");
  console.log(session_id);
  const {
    addedShopping: addedShopping2,
    setAddedShopping,
    name: username2,
  } = useAddedToCart();

  const username = JSON.parse(localStorage.getItem("username"));
  const addedShopping = JSON.parse(localStorage.getItem("addedShopping"));

  console.log(addedShopping);

  console.log("username", username);

  const fetchVerifyPayment = async () => {
    const response = await fetch(
      `http://127.0.0.1:8005/verify_payment/${session_id}`
    );
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return response.json();
  };

  const fetchIdAddress = async () => {
    const response = await fetch(
      `http://127.0.0.1:8005/get_address/${username}`
    );
    if (!response.ok) throw new Error("Something went wrong");
    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["stripeResponse", session_id],
    queryFn: () => fetchVerifyPayment(session_id),
  });

  console.log(data);

  const {
    data: idAddress,
    isLoading: isLoadingAddress,
    error: errorAddress,
  } = useQuery({
    queryKey: ["idAddress", username],
    queryFn: () => fetchIdAddress(username),
    enabled: !!username && data?.status === "success",
  });

  console.log("idAddress", idAddress);
  console.log(addedShopping);
  console.log("data", data);

  useEffect(() => {
    if (data && data.status !== "success") {
      navigate("/electronix/1");
      toast.error("Payment not successful. Please try again.");
    }
  }, [data, navigate]);

  useEffect(() => {
    async function handleSubmitOrder() {
      console.log(addedShopping);
      if (data && data.status === "success" && idAddress) {
        const finishCommand = {
          address_id: idAddress[0]?.address_id,
          employee_username: "test_employee",
          products: addedShopping.map((item) => ({
            product_id: item.product_id,
            provider_username: item.provider_username,
            quantity: item.quantity,
          })),
        };

        console.log("finishCommand", finishCommand);

        try {
          const response = await fetch("http://127.0.0.1:8005/add_command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(finishCommand),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const responseData = await response.json();
          toast.success(responseData.message);
          setAddedShopping([]);
          localStorage.removeItem("username");
          console.log("test", responseData);
        } catch (error) {
          toast.error("Comanda nu a fost plasată! Vă rugăm încercați din nou.");
          console.error("Error while adding order:", error);
        }
      }
    }

    if (data?.status === "success") {
      handleSubmitOrder();
    }
  }, [data, idAddress, addedShopping, navigate, setAddedShopping, username]);

  if (isLoading || isLoadingAddress) {
    return <Spinner />;
  }

  if (error || errorAddress) {
    return <div>Error: {error?.message || errorAddress?.message}</div>;
  }

  return children;
}

export default ProtectedRoute;
