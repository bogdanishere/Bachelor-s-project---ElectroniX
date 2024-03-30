import NavBar from "./Clients/NavBar";
import styled from "styled-components";
import Sidebar from "./Clients/Sidebar";
import Header from "./Clients/Header";
import ButtonsFunctionality from "../UI/ButtonsFunctionality";
import Footer from "../UI/Footer";
import { useAddedToCart } from "../APIs/AddToCart";
import { useListArrivalOrder } from "../APIs/ListArrivalOrder";
import { useNavigate } from "react-router-dom";
import Spinner from "../../Spinner";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import ListArrivalOrders from "./ListArrivalOrders";

const StyledAppLayout = styled.div`
  display: grid;
  grid-template-columns: 20rem 1fr;
  grid-template-rows: auto 1fr;
  height: 100vh;
`;

const Main = styled.main`
  padding: 4rem 4.8rem 6.4rem;
  background-color: var(--color-grey-50);

  /* overflow: scroll; */
`;

const ContainerStyled = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 2rem;
`;

const Button = styled.button`
  width: 20%;
  height: auto;
  background-color: hsl(239, 77%, 54%);
  color: #dee2e6;
  border: none;
  border-radius: 10rem;
  font-size: 1.2rem;
  padding: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s;
`;

function ArrivalOrder() {
  const { name: username } = useAddedToCart();
  const { setListArrivalOrder } = useListArrivalOrder();

  const navigate = useNavigate();

  useEffect(() => {
    if (username.length === 0) {
      navigate("/electronix/form=login");
    }
  }, [username, navigate]);

  const fetchListCommands = async () => {
    const response = await fetch(
      `http://127.0.0.1:8005/searchFinishedOrders/${username}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    setListArrivalOrder(data);

    return data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["searchFinishedOrders", username],
    queryFn: fetchListCommands,
  });

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <>
      <NavBar />
      <StyledAppLayout>
        <Sidebar />
        <Header />
        <Main>
          <ButtonsFunctionality />
          <ContainerStyled>
            {data.length === 0 && <h1>Nu aveti nicio comanda finalizata</h1>}
            {data.length > 0 && (
              <>
                <h1>Produsele pe care le-ati comandat sunt urmatoarele:</h1>
                <div>
                  {data.map((order) => (
                    <ListArrivalOrders
                      key={order.product_id + order.order_id}
                      order={order}
                    />
                  ))}
                </div>
              </>
            )}

            <Button onClick={() => navigate(-1)}>Inapoi</Button>
          </ContainerStyled>
        </Main>
        {/* <Footer /> */}
      </StyledAppLayout>
    </>
  );
}

export default ArrivalOrder;
