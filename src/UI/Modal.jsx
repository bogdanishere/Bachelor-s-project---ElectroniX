import { createContext, useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import styled from "styled-components";
import { FaXmark } from "react-icons/fa6";
import { FiMinus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useAddedToCart } from "../APIs/AddToCart";
import StarRating from "./StarRating";
import { useAddRating } from "../APIs/RouteAddRating";
import { useProtectedRouteUsers } from "../components/ProtectedRouteUsers";
import { useConvertPrice } from "../APIs/ConvertPrice";
import { convertUSDtoRON, formatCurrency } from "../helpers/helpers";
import toast from "react-hot-toast";

const StyledModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: var(--color-grey-0);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  padding: 3.2rem 4rem;
  transition: all 0.5s;
`;

const FlexButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: space-between;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: var(--backdrop-color);
  backdrop-filter: blur(4px);
  z-index: 1000;
  transition: all 0.5s;
`;

const List = styled.ul`
  list-style-type: none;
  margin: 0;
  padding: 0;
`;

const ListItem = styled.li`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  padding: 0.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  gap: 2rem;
`;

const Quantity = styled.span`
  margin-right: auto;
  font-weight: bold;
`;

const ProductName = styled.span``;

const ButtonGroup = styled.div`
  margin-left: auto;
`;

const Button = styled.button`
  margin-right: 0.5rem;
  background-color: var(--color-red-700);
  color: var(--color-grey-0);
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

const StyledTotalPrice = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 2rem;
`;

const CloseButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-bottom: 2rem;
`;

////////////////////////////////////////////////////////

function useOutsideClick(handler, listenCapturing = true) {
  const ref = useRef();

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) handler();
    }
    document.addEventListener("click", handleClick, listenCapturing);

    return () =>
      document.removeEventListener("click", handleClick, listenCapturing);
  }, [handler, listenCapturing]);

  return ref;
}

const ModalContext = createContext();

function Modal({ children, isOpen, onClose }) {
  return (
    <ModalContext.Provider value={{ isOpen, close: onClose }}>
      {children}
    </ModalContext.Provider>
  );
}

function Window({ children }) {
  const { isOpen, close } = useContext(ModalContext);
  const ref = useOutsideClick(close);

  return isOpen
    ? createPortal(
        <Overlay>
          <StyledModal ref={ref}>
            <CloseButtonContainer>
              <Button onClick={close}>
                <FaXmark />
              </Button>
            </CloseButtonContainer>
            {children}
          </StyledModal>
        </Overlay>,
        document.body
      )
    : null;
}
function Products({ products, onProducts }) {
  const { priceInRON } = useConvertPrice();

  const [priceRON, setPriceRON] = useState(0);

  const handleIncrement = (id) => {
    onProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === id ? { ...product, number: product.number + 1 } : product
      )
    );
  };

  const handleDecrement = (id) => {
    onProducts((currentProducts) =>
      currentProducts.reduce((acc, product) => {
        if (product.id === id) {
          if (product.number <= 1) {
            return acc;
          } else {
            return [...acc, { ...product, number: product.number - 1 }];
          }
        } else {
          return [...acc, product];
        }
      }, [])
    );
  };

  const handleDelete = (id) => {
    onProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    );
  };

  const navigate = useNavigate();
  const { close } = useContext(ModalContext);
  const handleCommand = () => {
    close();
    navigate("/electronix/address");
  };

  if (products.length === 0)
    return <ProductName>Nu ati selectat niciun produs</ProductName>;

  const sumProducts = products
    .reduce(
      (acc, currValue) =>
        acc + Number(currValue.price) * Number(currValue.number),
      0
    )
    .toFixed(2);

  convertUSDtoRON(sumProducts, products[0].currency).then((result) => {
    setPriceRON(result);
  });

  return (
    <>
      <List>
        {products.map((product) => (
          <ListItem key={product.id}>
            <Quantity>{product.number}x</Quantity>
            <ProductName>{product.name.slice(0, 45)}</ProductName>
            <ButtonGroup>
              <Button onClick={() => handleDecrement(product.id)}>
                <FiMinus />
              </Button>
              <Button onClick={() => handleIncrement(product.id)}>
                <FaPlus />
              </Button>
              <Button onClick={() => handleDelete(product.id)}>
                <FaTrash />
              </Button>
            </ButtonGroup>
          </ListItem>
        ))}
      </List>
      <StyledTotalPrice>
        <div>
          Price:{" "}
          {priceInRON === false
            ? formatCurrency(sumProducts, products[0].currency)
            : formatCurrency(priceRON.toFixed(2))}
        </div>

        <Button onClick={handleCommand}>Open Cart</Button>
      </StyledTotalPrice>
    </>
  );
}

function Wishies({ products, onProducts }) {
  const navigate = useNavigate();
  const { close } = useContext(ModalContext);
  const handleDelete = (id) => {
    onProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    );
  };
  const handleNavigateToProduct = (name, id) => {
    close();
    navigate(`/electronix/product/${name}/${id}`);
  };

  if (products.length === 0) return <div>Nu ati selectat niciun produs</div>;
  return (
    <>
      <h1>Produsele favorite</h1>
      <List>
        {products.map((product) => (
          <ListItem key={product.id}>
            <ProductName
              onClick={() => handleNavigateToProduct(product.name, product.id)}
            >
              {product.name.slice(0, 50)}
            </ProductName>
            <Button onClick={() => handleDelete(product.id)}>
              <FaTrash />
            </Button>
          </ListItem>
        ))}
      </List>
    </>
  );
}

function Login() {
  const navigate = useNavigate();

  const { close } = useContext(ModalContext);
  const { name: username, setName: setUsername } = useAddedToCart();
  const { typeUser, setTypeUser } = useProtectedRouteUsers();

  function handleSignOut() {
    setUsername("");
    setTypeUser("client");
    close();
    navigate("/electronix/1");
  }

  function handleLoginOnAnotherAccount() {
    setUsername("");
    setTypeUser("client");
    close();
    navigate("/electronix/form=login");
  }

  return (
    <List>
      {username.length !== 0 && (
        <>
          <ListItem>
            <h3>{username} sunteti deja autentificat</h3>
          </ListItem>
          <ListItem>
            <h3>
              Doriti sa va deconectati? Va rugam sa apasati pe butonul de mai
              jos
            </h3>
          </ListItem>
          <FlexButtons>
            <Button onClick={handleLoginOnAnotherAccount}>
              {" "}
              Conectati-va pe alt cont
            </Button>
            <Button onClick={handleSignOut}>Deconectare</Button>
          </FlexButtons>
        </>
      )}
      {username.length === 0 && (
        <>
          <ListItem>
            <h3>Va rugam sa va autentificati</h3>
          </ListItem>
          <FlexButtons>
            <Button
              onClick={() => {
                close();
                navigate("/electronix/form=login");
              }}
            >
              Login
            </Button>
            <Button
              onClick={() => {
                close();
                navigate("/electronix/form=signup");
              }}
            >
              Signup
            </Button>
          </FlexButtons>
        </>
      )}
    </List>
  );
}

const StyledReviewButtons = styled.div`
  display: flex;
  gap: 1rem;
`;

const Textarea = styled.textarea`
  width: 100%;
  font-size: 1.5rem;
`;
const StyledProduct = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
`;

const StyledReviewContainer = styled.div`
  display: flex;
  gap: 1rem;
  flex-direction: column;
`;
const StyledInput = styled.input`
  width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
  border: 1px solid var(--color-grey-300);
`;

function AddReview() {
  const { product, reviewStar, setReviewStar } = useAddRating();
  const { name: username } = useAddedToCart();
  const { name: productName, product_id: productId } = product;
  const { close } = useContext(ModalContext);
  const [valueInput, setValueInput] = useState("");
  const [valueTextarea, setValueTextarea] = useState("");

  function handleSendReview() {
    const review = {
      product_id: productId,
      title: valueInput,
      review: valueTextarea,
      rating: reviewStar,
      product: productName,
      username,
    };
    console.log("Review trimis", review);
    async function sendReview() {
      try {
        const response = await fetch(`http://127.0.0.1:8005/review`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(review),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();
        console.log("Review trimis", data);
        toast.success("Review adaugat cu succes!");
      } catch (error) {
        console.error("Error sending review:", error);
      }
    }
    sendReview();

    close();
  }

  return (
    <StyledReviewContainer>
      <h1>Adauga un review pentru:</h1>
      <h2>{productName}</h2>
      <StarRating
        size={"32"}
        defaultRating={Number(reviewStar)}
        color={"var(--color-brand-500)"}
        onSetRatingHandle={(rating) => setReviewStar(rating)}
      />
      <ListItem>
        <h3>Titlu review:</h3>
        <StyledInput
          type="text"
          placeholder="Foloseste o sugestie sau scrie propriul titlu"
          value={valueInput}
          onChange={(e) => setValueInput(e.target.value)}
        />
      </ListItem>
      <StyledReviewButtons>
        <Button onClick={() => setValueInput("Multumit")}>Multumit</Button>
        <Button onClick={() => setValueInput("Imi place")}>Imi place</Button>
        <Button onClick={() => setValueInput("Merita")}>Merita</Button>
        <Button onClick={() => setValueInput("Bun")}>Bun</Button>
        <Button onClick={() => setValueInput("Rezonabil")}>Rezonabil</Button>
      </StyledReviewButtons>
      <Textarea
        rows="4"
        value={valueTextarea}
        onChange={(e) => setValueTextarea(e.target.value)}
      />

      <FlexButtons>
        <Button onClick={() => handleSendReview()}>Adauga review</Button>
      </FlexButtons>
    </StyledReviewContainer>
  );
}

Modal.Login = Login;
Modal.Window = Window;
Modal.Products = Products;
Modal.Wishies = Wishies;
Modal.AddReview = AddReview;

export default Modal;
