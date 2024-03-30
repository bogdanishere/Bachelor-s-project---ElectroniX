import { useNavigate } from "react-router-dom";
import { useAddedToCart } from "../APIs/AddToCart";
import styled from "styled-components";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../../Spinner";
import { useConvertPrice } from "../APIs/ConvertPrice";
import { useEffect, useState } from "react";
import { convertUSDtoRON, formatCurrency } from "../helpers/helpers";

const Details = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 2rem;
`;

const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 2rem;
`;

const Button = styled.button`
  margin-right: 0.5rem;
  background-color: #f44336;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  padding: 0.5rem 1rem;
  padding: 0.4rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s;
  top: 1.2rem;
  right: 1.9rem;

  &:last-child {
    margin-right: 0;
  }

  &:hover {
    background-color: #d32f2f;
  }
`;

const StyleCommand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

function CommandsLists() {
  const navigate = useNavigate();
  const { addedShopping, setAddedShopping, name: username } = useAddedToCart();
  const [priceRON, setPriceRON] = useState(0);
  const { priceInRON } = useConvertPrice();
  const [price, setPrice] = useState(500);
  const [currency, setCurrency] = useState("USD");

  const sumPrice = addedShopping
    .reduce(
      (acc, currValue) =>
        acc + Number(currValue.price) * Number(currValue.number),
      0
    )
    .toFixed(2);

  convertUSDtoRON(sumPrice).then((result) => {
    setPriceRON(result);
  });

  useEffect(() => {
    if (priceInRON === false) {
      console.log(Number(sumPrice));
      setPrice(Number(sumPrice));
      setCurrency("USD");
    }
    if (priceInRON === true) {
      console.log(priceRON);
      setPrice(Number(priceRON));
      setCurrency("RON");
    }
  }, [priceInRON, sumPrice, priceRON]);

  const fetchIdAddress = async () => {
    const response = await fetch(
      `http://127.0.0.1:8005/get_address/${username}`
    );
    if (!response.ok) throw new Error("Something went wrong");
    return response.json();
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["idAddress", username],
    queryFn: fetchIdAddress,
  });

  if (isLoading) return <Spinner />;

  if (error) return <div>Error: {error.message}</div>;

  const items = addedShopping.map((item) => {
    return {
      product_id: item.id,
      provider_username: item.provider,
      quantity: item.number,
    };
  });

  localStorage.setItem("addedShopping", JSON.stringify(items));

  console.log(JSON.parse(localStorage.getItem("addedShopping")));

  const checkout = async () => {
    console.log(price, currency);
    try {
      const response = await fetch("http://localhost:8005/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ price, currency }),
      });
      const data = await response.json();

      if (data.url) {
        // localStorage.setItem("paymentData", JSON.stringify(data));
        window.location.assign(data.url);
      }
    } catch (error) {
      console.error("Eroare la checkout:", error);
    }
  };

  return (
    <StyleCommand>
      <Details>
        <h1>Comanda dumneavoastra</h1>
        <ul style={{ listStyleType: "none" }}>
          {addedShopping.map((product) => (
            <li key={product.id}>
              {product.number} produse - {product.name}
            </li>
          ))}
        </ul>
        <div>
          Price:
          {priceInRON === false
            ? formatCurrency(sumPrice, "USD")
            : formatCurrency(priceRON)}
        </div>
      </Details>
      <Buttons>
        <Button onClick={() => navigate("/electronix/1")}>
          Intoarceti-va la pagina originala
        </Button>
        <Button onClick={() => checkout()}>Plasati Comanda</Button>
      </Buttons>
    </StyleCommand>
  );
}
export default CommandsLists;
