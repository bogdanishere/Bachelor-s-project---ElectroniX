import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../pages/Clients/NavBar";
import { useQuery } from "@tanstack/react-query";
import { useAddedToCart } from "../APIs/AddToCart";
import toast from "react-hot-toast";
import styled from "styled-components";

// Definirea componentelor stilizate
const Container = styled.div`
  background: var(--color-grey-0);
  padding: 40px;
  max-width: 600px;
  margin: 40px auto;
  border-radius: 15px;
  box-shadow: 0 4px 10px 4px rgba(19, 35, 47, 0.3);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: center;
`;

const InputContainer = styled.div`
  margin: 0.2rem 0;
`;

const Label = styled.label`
  margin-right: 10px;
`;

const Input = styled.input`
  padding: 8px;
  margin: 0.5rem 0;
  border: 1px solid #01939c;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 10px 15px;
  background-color: #01939c;
  color: #fff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  &:hover {
    background-color: #025c61;
  }
`;

function Address() {
  const navigate = useNavigate();
  const { name: username } = useAddedToCart();

  const [address, setAddress] = useState({
    street: "",
    city: "",
    state: "",
    country: "",
    postalCode: "",
    clientUsername: username,
  });

  const fetchExistedAddress = async () => {
    const response = await fetch(
      `http://192.168.0.203:8005/check_address/${username}`
    );
    if (!response.ok) throw new Error("Something went wrong");
    return response.json();
  };

  const { data: dataId } = useQuery({
    queryKey: ["existedAddress", username],
    queryFn: fetchExistedAddress,
    enabled: !!username,
  });

  useEffect(() => {
    if (dataId?.exists) {
      navigate("/electronix/comands");
    }
  }, [dataId, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://192.168.0.203:8005/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(address),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      navigate("/electronix/comands");

      toast.success("Adresa a fost adăugată cu succes!");
    } catch (error) {
      toast.error("A apărut o eroare la adăugarea adresei!");
      console.error("Eroare la adăugarea adresei:", error);
    }
  };

  return (
    <>
      <NavBar />
      <Container>
        <h2
          style={{
            textAlign: "center",
          }}
        >
          Adresa de Livrare
        </h2>
        <Form onSubmit={handleSubmit}>
          <InputContainer>
            <Label>Strada:</Label>
            <Input
              type="text"
              name="street"
              value={address.street}
              onChange={handleChange}
            />
          </InputContainer>
          <InputContainer>
            <Label>Oraș:</Label>
            <Input
              type="text"
              name="city"
              value={address.city}
              onChange={handleChange}
            />
          </InputContainer>
          <InputContainer>
            <Label>Județ/Stat:</Label>
            <Input
              type="text"
              name="state"
              value={address.state}
              onChange={handleChange}
            />
          </InputContainer>
          <InputContainer>
            <Label>Țară:</Label>
            <Input
              type="text"
              name="country"
              value={address.country}
              onChange={handleChange}
            />
          </InputContainer>
          <InputContainer>
            <Label>Cod Poștal:</Label>
            <Input
              type="text"
              name="postalCode"
              value={address.postalCode}
              onChange={handleChange}
            />
          </InputContainer>
          <Button type="submit">Trimite Adresa</Button>
        </Form>
      </Container>
    </>
  );
}

export default Address;
