import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../APIs/RouteLoginSignup";
import { useAddedToCart } from "../APIs/AddToCart";
import NavBar from "./Clients/NavBar";
import toast from "react-hot-toast";
import { set } from "react-hook-form";

// Styled components
const FormContainer = styled.div`
  background: var(--color-grey-0);
  padding: 40px;
  max-width: 600px;
  margin: 40px auto;
  border-radius: 15px;
  box-shadow: 0 4px 10px 4px rgba(19, 35, 47, 0.3);
`;

const TabGroup = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 40px 0;
  &:after {
    content: "";
    display: table;
    clear: both;
  }
`;

const Tab = styled.li`
  float: left;
  width: 50%;
  & a {
    display: block;
    text-decoration: none;
    padding: 15px;
    background: rgba(160, 179, 176, 0.25);
    color: #a0b3b0;
    font-size: 20px;
    text-align: center;
    cursor: pointer;
    transition: 0.5s ease;
    &:hover {
      background: #01939c;
      color: var(--color-grey-800);
    }
  }
  &.active a {
    background: #01939c;
    color: var(--color-grey-800);
  }
`;

const Input = styled.input`
  font-size: 17px;
  padding: 10px;
  margin: 10px 0;
  background: none;
  border: 1px solid #01939c;
  color: var(--color-grey-800);
  border-radius: 6px;
  width: calc(100% - 20px);
  box-sizing: border-box;
`;

const Button = styled.button`
  border: 0;
  outline: none;
  border-radius: 15px;
  padding: 15px 0;
  font-size: 20px;
  font-weight: 400;
  letter-spacing: 0.1em;
  background: #01939c;
  color: var(--color-grey-800);
  cursor: pointer;
  transition: all 0.5s ease;
  width: 100%;
  margin: 10px 0;
  &:hover,
  &:focus {
    background: #025c61;
  }
`;

const Title = styled.h2`
  color: var(--color-grey-400);
`;

const Form = styled.form`
  margin-top: 20px;
`;

const Signup = () => {
  const location = useLocation();

  const type = location.pathname.split("=")[1];
  const { activeTab, setActiveTab } = useAuth();
  const navigate = useNavigate();

  const [alreadyConnected, setAlreadyConnected] = useState(false);

  const { name: usernameActual } = useAddedToCart();

  useEffect(() => {
    if (usernameActual.length > 0 && alreadyConnected === true) {
      toast.success("Sunteti deja conectat cu un cont!", {
        id: "signup-already-connected",
      });
      navigate("/electronix/1");
    }
  }, [usernameActual, navigate, alreadyConnected]);

  useEffect(() => {
    setActiveTab(type);
  }, [type, setActiveTab]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const [error, setError] = useState("");

  const { name: isActuallyAnUsername, setName: addUsername } = useAddedToCart();

  useEffect(() => {
    if (isActuallyAnUsername.length > 0) {
      navigate("/electronix/1");
    }
  }, [isActuallyAnUsername, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();
    const userData = {
      email,
      password,
      username,
      type: "client",
      firstName,
      lastName,
    };

    try {
      const response = await fetch("http://127.0.0.1:8005/add_client", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      addUsername(username);
      // local storage
      localStorage.setItem("username", JSON.stringify(username));

      toast.success("V-ati creat contul cu succes!");
      setAlreadyConnected((loggedInUser) => !loggedInUser);

      navigate(-1);
    } catch (error) {
      toast.error("Va rugam alegeti-va alt email sau username");
      setError("Va rugam alegeti-va alt email sau username");
    }
  };

  return (
    <>
      <NavBar />
      <FormContainer>
        {error && (
          <div
            style={{ color: "black", fontSize: "30px", textAlign: "center" }}
          >
            {error}
          </div>
        )}
        <TabGroup>
          <Tab
            className={activeTab === "signup" ? "active" : ""}
            onClick={() => setActiveTab("signup")}
          >
            <Link to="/electronix/form=signup">Sign Up</Link>
          </Tab>
          <Tab
            className={activeTab === "login" ? "active" : ""}
            onClick={() => setActiveTab("login")}
          >
            <Link to="/electronix/form=login">Log In</Link>
          </Tab>
        </TabGroup>

        <Form id="signup">
          <Title>Register</Title>
          <Input
            type="text"
            placeholder="Username"
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <Input
            type="firstName"
            placeholder="First Name"
            onChange={(e) => setFirstName(e.target.value)}
          />
          <Input
            type="lastName"
            placeholder="Last Name"
            onChange={(e) => setLastName(e.target.value)}
          />
          <Button type="submit" onClick={(e) => handleSignup(e)}>
            Sign Up
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default Signup;
