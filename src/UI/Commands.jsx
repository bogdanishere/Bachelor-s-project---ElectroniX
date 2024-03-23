import React, { useEffect } from "react";
import NavBar from "../pages/Clients/NavBar";
import ButtonsFunctionality from "./ButtonsFunctionality";
import { useNavigate } from "react-router-dom";
import CommandsLists from "./CommandsLists";
import { useAddedToCart } from "../APIs/AddToCart";

function Commands() {
  const navigate = useNavigate();
  const { addedShopping, name } = useAddedToCart();

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
