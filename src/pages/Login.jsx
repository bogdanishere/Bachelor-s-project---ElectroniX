import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../APIs/RouteLoginSignup";
import { useAddedToCart } from "../APIs/AddToCart";
import NavBar from "./Clients/NavBar";
import toast from "react-hot-toast";
import { useProtectedRouteUsers } from "../components/ProtectedRouteUsers";

const FormContainer = styled.div`
  width: 100%;
  height: 100%;
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
  color: var(--color-grey-500);
`;

const Form = styled.form`
  margin-top: 20px;
`;

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const type = location.pathname.split("=")[1];
  const { activeTab, setActiveTab } = useAuth();
  useEffect(() => {
    setActiveTab(type);
  }, [type, setActiveTab]);

  const { setName: setUsername, name: username } = useAddedToCart();

  const { setTypeUser } = useProtectedRouteUsers();

  const [alreadyConnected, setAlreadyConnected] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userData = {
      email: email,
      password: password,
    };

    try {
      const response = await fetch("http://127.0.0.1:8005/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "An error occurred during login");
      }

      setTypeUser(data?.message.split(" ")[0].toLowerCase());
      setUsername(data?.user);
      localStorage.setItem("username", JSON.stringify(data.user));
      localStorage.removeItem("token");
      localStorage.setItem("token", JSON.stringify(data.token));

      toast.success("V-ati autentificat cu succes!");

      if (data?.message.split(" ")[0].toLowerCase() === "employee") {
        navigate("/employee");
      }

      if (data?.message.split(" ")[0].toLowerCase() === "provider") {
        navigate("/providers/1");
      }

      if (data?.message.split(" ")[0].toLowerCase() === "client") {
        navigate("/electronix/1");
      }

      setAlreadyConnected((loggedInUser) => !loggedInUser);
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error("Ati introdus email sau parola gresita!");
    }
  };

  useEffect(() => {
    if (username.length > 0 && alreadyConnected === false) {
      toast.success("Sunteti deja conectat!", {
        id: "login-already-connected",
      });
      navigate(-1);
    }
  }, [username, navigate, alreadyConnected]);

  useEffect(() => {
    const verifyTokenAndLogin = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        const token1 = token.replace(/['"]+/g, "");

        try {
          const response = await fetch("http://127.0.0.1:8005/verify_token", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ token1 }),
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "Could not verify token");
          }

          setTypeUser(data?.type.toLowerCase());
          setUsername(data?.username);
          localStorage.setItem("username", JSON.stringify(data.username));
          navigateBasedOnUserRole(data?.type.toLowerCase());
        } catch (error) {
          console.error("Token verification error:", error.message);

          // localStorage.removeItem("token");
        }
      }
    };

    verifyTokenAndLogin();
  }, []);

  const navigateBasedOnUserRole = (userType) => {
    switch (userType) {
      case "employee":
        navigate("/employee");
        break;
      case "provider":
        navigate("/providers/1");
        break;
      case "client":
        navigate("/electronix/1");
        break;
      default:
        console.log("User type is unknown or not provided");
    }
  };

  return (
    <>
      <NavBar />
      <FormContainer>
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

        <Form id="login">
          <Title>Welcome Back!</Title>
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
          <Button type="submit" onClick={(e) => handleSubmit(e)}>
            Login
          </Button>
        </Form>
      </FormContainer>
    </>
  );
};

export default Login;
