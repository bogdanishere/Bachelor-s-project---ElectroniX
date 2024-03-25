import { useQuery, useQueryClient } from "@tanstack/react-query";
import NavBar from "./Clients/NavBar";
import Personal from "../UI/Empl-Prov/PersonalRender";
import PersonalUI from "../UI/Empl-Prov/PersonalUI";
import Spinner from "../../Spinner";
import toast from "react-hot-toast";
import ButtonsFunctionality from "../UI/ButtonsFunctionality";
import { useAddedToCart } from "../APIs/AddToCart";
import AddProductForm from "../UI/AddProductForm";
import styled from "styled-components";

const Title = styled.span`
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

function Providers() {
  const queryClient = useQueryClient();
  const { name: username } = useAddedToCart();

  const fetchProvidersConfirmations = async () => {
    const response = await fetch(
      `http://127.0.0.1:8005/show_order_details/${username}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["providersConfirmations"],
    queryFn: fetchProvidersConfirmations,
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>An error occurred: {error.message}</div>;

  function Header() {
    return (
      <>
        <div>ID-ul comenzii</div>
        <div>Numele produsului</div>
        <div>Data crearii</div>
        <div>Numele furnizorului</div>
        <div>Status produs</div>
      </>
    );
  }
  const columns = ["1.2fr 1.5fr 1.2fr 1fr 1fr 1fr 1fr"];

  const name = username ? username : "Furnizorule";

  async function acceptOrder(id) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8005/confirm_provider/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_detail_id: id }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message);

      queryClient.invalidateQueries(["providersConfirmations"]);
    } catch (error) {
      toast.error("A apărut o eroare in adaugarea comenzii!");
      console.error("Error accepting order:", error);
    }
  }

  async function rejectOrder(id, orderId) {
    try {
      const response = await fetch(
        `http://127.0.0.1:8005/delete_order_by_provider/${id}/${orderId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_detail_id: id, order_id: orderId }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success(data.message);

      queryClient.invalidateQueries(["providersConfirmations"]);
    } catch (error) {
      toast.error("A apărut o eroare in stergerea comenzii!");
      console.error("Error accepting order:", error);
    }
  }

  return (
    <>
      <NavBar />
      <ButtonsFunctionality />
      <Personal
        Header={Header}
        data={data}
        acceptOrder={acceptOrder}
        rejectOrder={rejectOrder}
        columns={columns}
        name={name}
      >
        <PersonalUI />
      </Personal>
      <Title>Puteti adauga propriul vostru produs</Title>
      <AddProductForm providerUsername={username} />
    </>
  );
}

export default Providers;
