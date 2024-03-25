import { useQuery, useQueryClient } from "@tanstack/react-query";
import Personal from "../UI/Empl-Prov/PersonalRender";
import PersonalUI from "../UI/Empl-Prov/PersonalUI";
import NavBar from "./Clients/NavBar";
import Spinner from "../../Spinner";
import toast from "react-hot-toast";
import ButtonsFunctionality from "../UI/ButtonsFunctionality";
import { useAddedToCart } from "../APIs/AddToCart";
import styled from "styled-components";

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

function Employee() {
  const queryClient = useQueryClient();
  const { name: username } = useAddedToCart();

  const fetchCommands = async () => {
    const response = await fetch(`http://127.0.0.1:8005/show_orders`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  };

  const { data, error, isLoading, refetch } = useQuery({
    queryKey: ["commands"],
    queryFn: fetchCommands,
    // refetchInterval: 3000,
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>An error occurred: {error.message}</div>;
  function Header() {
    return (
      <>
        <div>ID-ul comenzii</div>
        <div>Clientul are adresa introdusa?</div>
        <div>Data crearii</div>
        <div>Angajatul responsabil</div>
        <div>Statusul comenzii</div>
      </>
    );
  }
  const columns = ["1.2fr 1.5fr 1.2fr 1fr 1fr 1fr 1fr"];

  const name = username ? username : "Angajatule";

  async function acceptOrder(id) {
    console.log(id);
    try {
      const response = await fetch(
        `http://127.0.0.1:8005/confirm_employee/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ order_id: id }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      toast.success("Comanda a fost adaugata cu succes!");

      queryClient.invalidateQueries(["commands"]);
    } catch (error) {
      toast.error("A apărut o eroare la adaugarea comenzii.");
    }
  }

  async function rejectOrder(id) {
    try {
      const response = await fetch(`http://127.0.0.1:8005/delete_order/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      toast.success("Comanda a fost stearsa cu succes!");

      queryClient.invalidateQueries(["commands"]);
    } catch (error) {
      console.error("Error rejecting order:", error);
      toast.error("A apărut o eroare la ștergerea comenzii.");
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
    </>
  );
}

export default Employee;
