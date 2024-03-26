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
import DeleteProductsByProvider from "./DeleteProductsByProvider";
import { useNavigate, useParams } from "react-router-dom";

const Title = styled.span`
  font-size: 1.5em;
  font-weight: bold;
  margin-bottom: 2em;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Button = styled.button`
  border: 0;
  outline: none;
  border-radius: 2rem;
  padding: 1.5rem 0;
  font-size: 1rem;
  font-weight: 300;
  letter-spacing: 0.1em;
  background: var(--color-blue-700);
  color: #fff;
  cursor: pointer;
  transition: all 0.5s ease;
  width: 15rem;
  margin: 8px 0;
  &:hover,
  &:focus {
    background: var(--color-indigo-700);
  }
`;

function Providers() {
  const queryClient = useQueryClient();
  const { name: username } = useAddedToCart();
  const { page } = useParams();
  const navigate = useNavigate();

  const goToPage = (newPage) => {
    navigate(`/providers/${newPage}`);
  };

  const fetchProvidersConfirmations = async () => {
    const response = await fetch(
      `http://127.0.0.1:8005/show_order_details/${username}`
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  };

  const { data, error, isLoading, refetch } = useQuery({
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
      <Button onClick={() => refetch()}>Reîncarcă comenzile</Button>{" "}
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
      <DeleteProductsByProvider
        username={username}
        page={page}
        goToPage={goToPage}
      />
    </>
  );
}

export default Providers;
