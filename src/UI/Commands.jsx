import React, { useEffect } from "react";
import NavBar from "../pages/Clients/NavBar";
import ButtonsFunctionality from "./ButtonsFunctionality";
import { useNavigate } from "react-router-dom";
import CommandsLists from "./CommandsLists";
import { useAddedToCart } from "../APIs/AddToCart";
import { useQuery } from "@tanstack/react-query";

function Commands() {
  const navigate = useNavigate();
  const { addedShopping, name } = useAddedToCart();

  const ids = addedShopping.map((item) => item.id);

  const fetchKnnProducts = async (ids) => {
    const response = await fetch(`http://127.0.0.1:8005/recomandationSystem`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["knnProducts", ids],
    queryFn: () => fetchKnnProducts(ids),
    retry: 1,
  });

  localStorage.removeItem("knnProducts");

  localStorage.setItem("knnProducts", JSON.stringify(data));

  useEffect(() => {
    if (addedShopping.length === 0 || name.length === 0) {
      navigate("/electronix/1");
    }
  }, [addedShopping, name, navigate]);

  return (
    <>
      <NavBar />
      <ButtonsFunctionality />
      <CommandsLists />
    </>
  );
}

export default Commands;
